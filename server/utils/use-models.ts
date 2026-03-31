import _ from 'lodash';
import { BaseModel } from '~/models/core/base.model';
import { Paginated, Query } from "~~/models/core/common.model";
import { BadRequest, GeneralError, NotFound } from '~/models/core/errors.model';
import mongoose, { Types } from 'mongoose';
import isServer from '~/utils/is-server';
import { ObjectId } from 'mongodb';

export interface IModelOptions {
    query?: Query;
    paginate?: boolean,
    client_paginate?: boolean, // If true the client can decide to use pagination or not with the query params
    page?: {
        limit?: number,
        max?: number;
    };
    builder?: (data: any) => any;
}

export default () => {

    if (!isServer()) {
        throw new GeneralError('[UseModels] this composable is only usable in the server');
    }

    /**
     * Save the document in BDD,
     * Use updateById method if _id is defined
     * Or create the item in BDD
     * @returns this saved model
     */
    async function save<T extends BaseModel = BaseModel<any>>(entity: T, options?: IModelOptions) {
        let error = null;
        const execute = async () => {
            try {
                const orm = mongoose.model(entity.$modelName);
                const instance = await orm.findOneAndUpdate(_.assign({ _id: entity._id || new Types.ObjectId() }, options?.query || {}), entity.toJSON(), { upsert: true, new: true });
                entity.patch(instance?.toJSON() as Partial<T>);
            } catch (err: any) {
                console.error("\x1b[31m%s\x1b[0m", '[ERROR][SAVE]', err);
                if (err.codeName) error = new BadRequest({ message: "error." + err.codeName });
                else error = err;
                throw error;
            }
        };
        await execute();
        return entity;
    }

    async function remove<T extends BaseModel = BaseModel<any>>(entity: T, options?: IModelOptions) {
        if (!entity._id) {
            throw new GeneralError('[MODEL] NO ID, can\'t remove');
        }
        let error = null;
        const execute = async () => {
            try {
                const orm = mongoose.model(entity.$modelName);
                const instance = await orm.findOneAndDelete(_.assign({ _id: entity._id || new Types.ObjectId() }, options?.query || {}));
                if (_.isEmpty(instance)) throw new NotFound({ message: 'ERROR.NOT_FOUND' });
                entity.patch(instance?.toJSON() as Partial<T>);
            } catch (err: any) {
                console.error("\x1b[31m%s\x1b[0m", '[ERROR][DELETE]', err);
                if (err.codeName) error = new BadRequest({ message: "error." + err.codeName });
                else error = err;
                throw error;
            }
        };
        await execute();
        return entity;
    }

    /**
    * Retrieve this document in BDD from his _id
    * @returns
    */
    async function retrieve<T extends BaseModel = BaseModel<any>>(entity: T, query?: { [key: string]: any; } | string, options?: IModelOptions) {
        let error = null;
        query = _.merge(query, options?.query || {});
        const execute = async () => {
            try {
                const orm = mongoose.model(entity.$modelName);
                let promise: Promise<any> | undefined = undefined;
                if (_.isString(query)) {
                    promise = orm.findOne({ [query]: _.get(entity, query) }).exec();
                } else
                    if (query && !_.isEmpty(query)) {
                        promise = orm.findOne(query).exec();
                    } else
                        if (entity._id) {
                            promise = orm.findById(entity._id).exec();
                        }
                if (!promise) {
                    throw new GeneralError('[MODEL] NO QUERY OR ID, can\'t retrieve');
                };

                const instance = await promise;
                if (!instance) {
                    throw new NotFound({ statusCode: 404, message: "ERROR.NOT_FOUND" });
                }
                entity.patch(instance.toJSON() as Partial<T>);

            } catch (err: any) {
                console.error("\x1b[31m%s\x1b[0m", '[ERROR][RETRIEVE]', err);
                if (err.codeName) error = new BadRequest({ message: "error." + err.codeName });
                else error = err;
                throw error;
            }
        };
        await execute();
        return entity;
    }

    /**
    * Populate a given path or an array of poulateOptions
    * path should have a ref property in the mongoose schema
    * @param path
    * @returns
    */
    async function populate<T extends BaseModel = BaseModel<any>>(entity: T, ...paths: string[]): Promise<BaseModel<any>> {
        for (let path of paths) {
            if (!entity.hasBuilder(path) || !_.get(entity, `${path}ID`) || entity.populated(path)) {
                continue;
            }
            const orm = mongoose.model(entity.build(path, {}).constructor.name);
            const member = await orm.findById(_.get(entity, `${path}ID`));
            if (member) entity.patch({ [path]: entity.build(path, member) } as Partial<T>);
        }
        return entity;
    };

    async function list<T extends BaseModel = BaseModel<any>>(model: new (data: any) => T, options?: IModelOptions) {
        let query = options?.query || {};
        let page = options?.page || {};

        const orm = mongoose.model(new model({}).$modelName);
        if (!orm) throw new GeneralError('[useModels] ORM modelName is not valid !');

        let result: Paginated<T> | T[];
        const reqOptions: any = {};
        for (let key in query) {
            if (key.startsWith('$$')) {
                const newKey = key.replace('$$', '');
                const option = query[key];
                delete query[key];
                reqOptions[newKey] = option;
            }
        }

        // Determine paginate mode
        let paginate = options?.paginate;
        if (options?.client_paginate && query.paginate !== undefined) {
            paginate = query.paginate;
            delete query.paginate; // Remove from query to avoid passing to mongoose
        }
        if (paginate) {
            const limit = _.min([page?.max || 50, query?.limit !== undefined ? parseInt(query.limit as any) : page?.limit || 10]) || 0;
            result = await usePagination<T>(orm.find(query, {}, reqOptions), { index: parseInt(query?.index as any) || 0, skip: parseInt(query?.skip as any), limit });
        } else {
            result = (await orm.find<T>(query, {}, reqOptions).exec() as T[]);
        }
        // result as context result
        return transform(result, options?.builder ? options.builder : (data: any) => new model(data), []);
    }

    async function bulkSave<T extends BaseModel = BaseModel<any>>(data: any[], model: new (data: any) => T, primaryKey: string = '_id', options?: IModelOptions) {
        const orm = mongoose.model(new model({}).$modelName);
        if (!orm) throw new GeneralError('[useModels] ORM modelName is not valid !');

        const bulkOp = [];
        for (let item of data) {
            bulkOp.push({
                updateOne: {
                    filter: options?.query || { [primaryKey]: item[primaryKey] || new ObjectId() },
                    update: { $set: item.toJSON ? item.toJSON() : item },
                    upsert: true
                }
            });
        }
        const ids = []; //data.map(entity => entity[primaryKey]).filter(key => !!key);
        const report = await orm.bulkWrite(bulkOp);
        for (let key in report.upsertedIds) {
            ids.push(report.upsertedIds[key]);
        }
        ids.push(...data.map(entity => entity[primaryKey]).filter(key => !!key));
        let result = await orm.find(options?.query || { [primaryKey]: { $in: ids } }).exec();
        result = transform(result, options?.builder ? options.builder : (data: any) => new model(data), []);
        return { report: report, data: result };
    }

    async function bulkRemove<T extends BaseModel = BaseModel<any>>(data: any[], model: new (data: any) => T, primaryKey: string = '_id') {
        const orm = mongoose.model(new model({}).$modelName);
        if (!orm) throw new GeneralError('[useModels] ORM modelName is not valid !');

        const bulkOp = [];
        for (let item of data) {
            bulkOp.push({
                deleteOne: {
                    filter: { [primaryKey]: item[primaryKey] },
                }
            });
        }
        const result = await orm.bulkWrite(bulkOp);
        return { report: result };
    };

    const transform = <T>(data: Paginated<T> | T | T[], builder: (data: any) => any, defaultValue?: any) => {
        if (_.isArray(data)) {
            data = data.map(d => builder(d));
        } else if (data instanceof Paginated && _.isArray(data.data)) {
            data.data = data.data.map(d => builder(d));
        } else if (data) {
            data = builder(data);
        } else
            data = defaultValue || null;

        return data;
    };

    return {
        retrieve,
        save,
        remove,
        populate,
        list,
        bulk: {
            save: bulkSave,
            remove: bulkRemove
        }
    };
};