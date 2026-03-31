import { H3Event } from 'h3';
import _ from 'lodash';
import { BaseModel, Id } from '~~/models/core/base.model';
import { Model } from 'mongoose';
import { Query } from '~~/models/core/common.model';
import { User } from '~/models/auth/user.model';
import deepParseJson from "~/utils/deep-parse-json";
import useModels from './use-models';

declare module 'h3' {
    // we overload the context interface.
    interface H3EventContext {
        id?: Id,
        user: User | null,
        type: 'before' | 'after' | 'error',
        data: any,
        query: Query,
        result?: any,
        authenticated: boolean;
        error?: any;
    }
}

export type Hook = (event: H3Event) => Promise<any> | any;
export interface IHookEndpoint {
    before?: Hook[],
    after?: Hook[],
    error?: Hook[],
}
export interface IHookCollection {
    options?: {
        paginate?: boolean,
        page?: {
            limit?: number,
            max?: number;
        };
    },
    before?: {
        all?: Hook[];
        find?: Hook[];
        get?: Hook[];
        post?: Hook[];
        patch?: Hook[];
        remove?: Hook[];
    },
    after?: {
        all?: Hook[];
        find?: Hook[];
        get?: Hook[];
        post?: Hook[];
        patch?: Hook[];
        remove?: Hook[];
    },
    error?: {
        all?: Hook[];
        find?: Hook[];
        get?: Hook[];
        post?: Hook[];
        patch?: Hook[];
        remove?: Hook[];
    };
}

export interface IRestEndpointOptions {
    paginate?: boolean,
    client_paginate?: boolean, // if true, the client can decide to paginate the results or not
    page?: {
        limit?: number,
        max?: number,
    };
}

const defaultHooks = {
    options: {
        paginate: true,
        client_paginate: false,
        page: {
            limit: 10,
            max: 50
        }
    },
    before: {
        all: [],
        find: [],
        get: [],
        post: [],
        patch: [],
        remove: [],
    },
    after: {
        all: [],
        find: [],
        get: [],
        post: [],
        patch: [],
        remove: [],
    },
    error: {
        all: [],
        find: [],
        get: [],
        post: [],
        patch: [],
        remove: [],
    }
};

export default <T extends BaseModel = any>(MongooseModel: typeof Model, model: new (...args: any) => BaseModel<T>, hooks?: IHookCollection) => {
    return defineEventHandler(async (event: H3Event) => {

        const _method = event.method;
        const _hooks = _.merge({}, defaultHooks, hooks || {});
        switch (_method) {
            case 'GET':
                return useGet<T>(model, event, {
                    find: { before: _.concat([], _hooks['before']['all'], _hooks['before']['find']), after: _.concat([], _hooks['after']['all'], _hooks['after']['find']), error: _.concat([], _hooks['error']['all'], _hooks['error']['find']) },
                    get: { before: _.concat([], _hooks['before']['all'], _hooks['before']['get']), after: _.concat([], _hooks['after']['all'], _hooks['after']['get']), error: _.concat([], _hooks['error']['all'], _hooks['error']['get']) }
                }, _hooks.options);
            case 'POST':
                return usePost(model, event,
                    { before: _.concat([], _hooks['before']['all'], _hooks['before']['post']), after: _.concat([], _hooks['after']['all'], _hooks['after']['post']), error: _.concat([], _hooks['error']['all'], _hooks['error']['post']) }
                );
            case 'PATCH':
                return usePatch(model, event,
                    { before: _.concat([], _hooks['before']['all'], _hooks['before']['patch']), after: _.concat([], _hooks['after']['all'], _hooks['after']['patch']), error: _.concat([], _hooks['error']['all'], _hooks['error']['patch']) }
                );
            case 'DELETE':
                return useDelete(MongooseModel, model, event,
                    { before: _.concat([], _hooks['before']['all'], _hooks['before']['remove'],), after: _.concat([], _hooks['after']['all'], _hooks['after']['remove']), error: _.concat([], _hooks['error']['all'], _hooks['error']['remove']) }
                );
            default:
                console.warn('[useRest] use of non-rest method on endpoint : ' + event.path);
        }
    });
};

export async function useGet<T extends BaseModel = any>(model: new (...args: any) => BaseModel<T>, event: H3Event, hooks?: { find: IHookEndpoint, get: IHookEndpoint; }, options: IRestEndpointOptions = defaultHooks.options) {
    const params = getRouterParams(event);
    const { retrieve, list } = useModels();
    // console.log('PARAMS', getMethod(event));
    event.context.data = {};
    event.context.query = deepParseJson(getQuery(event) || {});
    event.context.id = params['id'];

    // case of feathers get
    if (event.context.id) {
        await useHooks('before', event, hooks?.get);
        // return the call before execution if result is set in b4 hook
        if (!event.context.result) {
            try {
                const data = await retrieve(new model(), _.assign(event.context.query, { _id: event.context.id as string }));
                event.context.result = data?.toJSON();
            } catch (error: any) {
                event.context.error = error;
                await useHooks('error', event, hooks?.get);
                throw error;
            }
        }
        await useHooks('after', event, hooks?.get);
        return event.context.result;
    } else {
        // case of feather find
        await useHooks('before', event, hooks?.find);
        try {
            // return the call before execution if result is set in b4 hook
            if (!event.context.result) {
                // result as context result
                event.context.result = await list(model, {
                    query: event.context.query,
                    ...options
                });
            }
            await useHooks('after', event, hooks?.find);
            return event.context.result;
        } catch (err: any) {
            await useHooks('error', event, hooks?.find);
            throw err;
        }
    }

}

export async function usePost(model: new (...args: any) => BaseModel<any>, event: H3Event, hooks?: IHookEndpoint) {
    const { save, bulk } = useModels();

    // set postedData as context.data
    event.context.data = await readBody(event) || {};
    event.context.query = deepParseJson(getQuery(event) || {});

    // before Hooks (can alter event.context)
    await useHooks('before', event, hooks);

    if (_.isArray(event.context.data)) {
          // Effectuez la mise à jour en masse
        try {
            // return the call before execution if result is set in b4 hook
            if (!event.context.result) {
                const { data } = await bulk.save(event.context.data, model);
                // result as context result
                event.context.result = data;
            }
            // after Hooks
            await useHooks('after', event, hooks);
            // use context result
            return event.context.result;
        } catch (err: any) {
            await useHooks('error', event, hooks);
            throw err;
        }

    } else {
        // return the call before execution if result is set in b4 hook
        if (!event.context.result) {
            // single operation 
            try {
                const data = await save(new model(event.context.data), { query: event.context.query });
                // result as context result
                event.context.result = data?.toJSON();
            } catch (error: any) {
                event.context.error = error;
                await useHooks('error', event, hooks);
                throw error;
            }
        }

        // after Hooks
        await useHooks('after', event, hooks);

        // use context result
        return event.context.result;
    }
}

export async function usePatch(model: new (...args: any) => BaseModel<any>, event: H3Event, hooks?: IHookEndpoint) {
    const { save, bulk } = useModels();

    const params = getRouterParams(event);
    event.context.id = params['id'];
    event.context.data = await readBody(event) || {};
    event.context.query = deepParseJson(getQuery(event) || {});

    await useHooks('before', event, hooks);

    if (event.context.id) {
        // return the call before execution if result is set in b4 hook
        if (!event.context.result) {
            try {
                const data = await save(new model(_.assign(event.context.data, { _id: event.context.id as string })), { query: event.context.query });
                // result as context result
                event.context.result = data?.toJSON();
            } catch (error: any) {
                if (error) {
                    event.context.error = error;
                    await useHooks('error', event, hooks);
                    throw error;
                };
            }
        }
        await useHooks('after', event, hooks);
        return event.context.result;
    } else if (_.isArray(event.context.data)) { // if it's an array do bulk operation
        // Effectuez la mise à jour en masse
        try {
            // return the call before execution if result is set in b4 hook
            if (!event.context.result) {
                const { data } = await bulk.save(event.context.data, model);
                // result as context result
                event.context.result = data;
            }
            // after Hooks
            await useHooks('after', event, hooks);
            // use context result
            return event.context.result;
        } catch (err: any) {
            await useHooks('error', event, hooks);
            throw err;
        }
    } else {
        try {
            if (!event.context.result) {
                // do a multiple patch query based
                // const report = await MongooseModel.updateMany(event.context.query, { $set: event.context.data }).exec();
                // const result = await MongooseModel.find(event.context.query).exec();
                // event.context.result = result;

                // TODO: Test if substitution work
                // do a multiple patch query based
                const { data } = await bulk.save([event.context.data], model, undefined, { query: event.context.query });
                // result as context result
                event.context.result = data;
            }
            // after Hooks
            await useHooks('after', event, hooks);
            // use context result
            return event.context.result;
        } catch (err: any) {
            await useHooks('error', event, hooks);
            throw err;
        }
    }
}

export async function useDelete(MongooseModel: typeof Model, model: new (...args: any) => BaseModel<any>, event: H3Event, hooks?: IHookEndpoint) {
    const { remove } = useModels();
    const params = getRouterParams(event);
    event.context.data = await readBody(event) || {};
    event.context.query = deepParseJson(getQuery(event) || {});
    event.context.id = params['id'];

    await useHooks('before', event, hooks);

    if (event.context.id) {
        if (!event.context.result) {
            try {
                const data = await remove(new model({ _id: event.context.id as string }), { query: event.context.query });
                event.context.result = data?.toJSON();
            } catch (error: any) {
                event.context.error = error;
                await useHooks('error', event, hooks);
                throw error;
            }
        }
        await useHooks('after', event, hooks);
        return event.context.result;
    } else if (_.isArray(event.context.data)) {
        const { bulk } = useModels();
        // Effectuez la mise à jour en masse
        try {
            if (!event.context.result) {
                const { report } = await bulk.remove(event.context.data, model);
                event.context.result = report;
            }
            await useHooks('after', event, hooks);
            return event.context.result;
        } catch (err: any) {
            await useHooks('error', event, hooks);
            throw err;
        }
    } else {
        try {
            if (!event.context.result) {
                // do a multiple delete query based
                const report = await MongooseModel.deleteMany(event.context.query).exec();
                event.context.result = report;
            }
            // after Hooks
            await useHooks('after', event, hooks);
            // use context result
            return event.context.result;
        } catch (err: any) {
            await useHooks('error', event, hooks);
            throw err;
        }
    }
}

export async function useHooks(type: 'before' | 'after' | 'error', event: H3Event, hooks?: IHookEndpoint) {
    if (!hooks)
        return;

    event.context.type = type;
    switch (type) {
        case 'before':
            if (hooks['before'])
                for (let hook of hooks['before']) {
                    await hook(event);
                }
            break;
        case 'after':
            if (hooks['after'])
                for (let hook of hooks['after']) {
                    await hook(event);
                }
            break;
        case 'error':
            if (hooks['error'])
                for (let hook of hooks['error']) {
                    await hook(event);
                }
            break;
    }
}
