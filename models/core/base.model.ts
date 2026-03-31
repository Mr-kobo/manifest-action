import { ZodEffects, ZodObject } from "zod";
import { Model as MongooseModel, Types } from "mongoose";
import { toRaw } from "vue";
import _ from "lodash";
import { _AsyncData } from "nuxt/dist/app/composables/asyncData";
import isServer from "~/utils/is-server";

export type Id = string | Types.ObjectId;

export abstract class BaseModel<T = any> {
    /** API endpoint of the entity */
    public readonly $endpoint: string | undefined;
    /** Mongoose Model name */
    public readonly $modelName: string;

    /** Class default validator defined in **.schema.ts */
    private static $zod: { [key: string]: ZodObject<any> | ZodEffects<any>; } = {};
    /** Return if this model is valid based of zod validator */
    public get valid() {
        // console.log(BaseModel.$zod[this.constructor.name].safeParse(this), this)
        return BaseModel.$zod[this.constructor.name].safeParse(this).success;
    }

    /** id of the entity in BDD */
    public _id?: Id;

    public get isNew(): boolean {
        return _.isNil(this._id);
    }

    /** override this to set default values upon entity creation */
    protected $defaults: Partial<T> = {};

    /** fields that need to be build using specified class ( ex: { role: Role } ) */
    protected $build: { [path: string]: new (data: any) => any; } = {};

    constructor(
        /* data: Partial<T> = {}, */ validator: ZodObject<any> | ZodEffects<any>,
        orm: MongooseModel<T>,
        endpoint?: string /*, defaultValues?: boolean*/
    ) {
        this.$endpoint = endpoint;
        if (isServer()) {
            this.$modelName = orm.modelName;
        }
        if (!BaseModel.$zod[this.constructor.name]) BaseModel.$zod[this.constructor.name] = validator;
    }

    /**
     * INIT the entity with data, clean reset the entity with default values
     * @param data
     * @param reset if set to true, reset the object by setting every enumerable field to undefined @default true
     * @returns
     */
    protected init(data: Partial<T> = {}) {
        this.reset();
        if (this.$defaults && !_.isEmpty(this.$defaults)) {
            this.assign(this.$defaults);
        }
        this.patch(data);
        return this;
    }

    /**
     * Patch the entity with a partial data (not in BDD)
     * @param data
     * @param reset if set to true, reset the object by setting every enumerable field to undefined @default true
     * @returns
     */
    public patch(data: Partial<T> = {}) {
        if (data) {
            this.assign(data);
        }
        return this;
    }

    private assign(data: any) {
        _.assign(this, (data as any).toJSON ? (data as any).toJSON() : toRaw(data));
        for (let member of Object.keys(this.$build)) {
            if (member === 'items.ressource') {
                console.log('KEY', member, _.get(data, member));

            }
            const current = _.get(data, member);
            if (current && _.isArray(current)) {
                _.set(
                    this,
                    member,
                    current.map((c) => new this.$build[member](c))
                );
            } else if (current) {
                _.set(this, member, new this.$build[member](current));
            }
        }
    }

    /**
     * Check if a given path is populated (check if it's an object and != than ObjectId)
     * @param path
     */
    public populated(path: string): boolean {
        return _.isObject(_.get(this, path)) && !(_.get(this, path) instanceof Types.ObjectId);
    }
    
    /**
     * Tell if there is a builder for the selected path
     * @param path 
     * @returns 
     */
    public hasBuilder(path: string) {
        return !!this.$build[path];
    }

    /**
     * Build the selected submember by path
     * @param path 
     * @param data 
     * @returns 
     */
    public build(path: string, data: any = null) {
        return new this.$build[path](data);
    }

    public toJSON() {
        const data: any = _.cloneDeep(this);
        for (let key of Object.keys(this.$build)) {
            const current: any = _.get(this, key);
            if (_.isArray(current)) {
                _.set(
                    data,
                    key,
                    current.map((c) => (c?.toJSON ? c?.toJSON() : c))
                );
            } else {
                _.set(data, key, current?.toJSON ? current?.toJSON() : current);
            }
        }
        return _.omit(data, ["$zod", "$orm", "$endpoint", "$modelName", "$build", "$zod", "$defaults",/* "created", "updated" */]);
    }

    /**
     * set all enumerable values to undefined, usefull when updating from a partial data
     *
     */
    private reset() {
        Object.keys(this)
            .filter((key) => !key.startsWith("$"))
            .forEach((key) => _.set(this, key, undefined));
    }
}
