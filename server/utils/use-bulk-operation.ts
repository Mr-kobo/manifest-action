import _ from 'lodash';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

export default () => {
    const upsert = async (data: any[], model: Model<any>, primaryKey: string = '_id') => {
        const bulkOp = [];
        for (let item of data) {
            bulkOp.push({
                updateOne: {
                    filter: { [primaryKey]: item[primaryKey] || new ObjectId() },
                    update: { $set: item.toJSON? item.toJSON(): item },
                    upsert: true
                }
            });
        }
        const ids = [] //data.map(entity => entity[primaryKey]).filter(key => !!key);
        const report = await model.bulkWrite(bulkOp);
        for (let key in report.upsertedIds) {
            ids.push(report.upsertedIds[key]);
        }
        ids.push(...data.map(entity => entity[primaryKey]).filter(key => !!key));
        const result = await model.find({ [primaryKey]: { $in: ids } }).exec();
        return { report: report, data: result};
    }

    const remove = async (data: any[], model: Model<any>, primaryKey: string = '_id') => {
        const bulkOp = [];
        for (let item of data) {
            bulkOp.push({
                deleteOne: {
                    filter: { [primaryKey]: item[primaryKey] },
                }
            });
        }

        const result = await model.bulkWrite(bulkOp);
        return { report: result };
    }

    return {
        upsert,
        remove
    }

};
