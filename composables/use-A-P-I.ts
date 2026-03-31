import _ from 'lodash';
import { BaseModel, Id } from '../models/core/base.model';
import { IPage, Paginated, Query } from "~~/models/core/common.model";
import { NuxtError, UseFetchOptions } from "#app";
import { FetchContext, FetchResponse, ResponseType } from 'ofetch';
import { v4 as uuid } from 'uuid';
import { GeneralError } from '~/models/core/errors.model';
import { UnwrapNestedRefs } from 'vue';
import { useEventSource } from '@vueuse/core';
import { IServerSentEvent } from '~/server/utils/use-server-events';
import { SSEEvent } from '~/schemas/core/sse-event';


export interface IFetchOptions<T> {
  snack?: {
    success?: string | null;
    error?: string | null | true;
  } | null,
  query?: Query;
  onError?: (error: NuxtError) => Promise<void> | void,
  /**
   *  perform a client side await for async operation
   *  can hang the component if user in the main render thread - prefer watch
   */
  await?: boolean,
  /**
   * Allow to build the object before returning it
   * @param data 
   * @returns 
   */
  builder?: (data: any) => T;
  /**
   * watch of an array of ref or query, page and body to re-call the API when one of them change
   * @default false (no watch)
   */
  watch?: boolean | Array<Ref<any> | UnwrapNestedRefs<any>>;
  /**
   * Patch the given entity or create a new one if false
   * @default true
   */
  mutate?: boolean;
  /**
   * Pass a ref to get the data updated in this ref
   */
  data?: any;
  /**
   * If set to false the call won't be done automatically
   * @default true
   */
  immediate?: boolean;
  /**
   * Pass a ref to get an update of the call progress
   * @default null
   */
  progress?: Ref<IProgress | null>;
  /**
   * Work with progress to store the SSE ID in localStorage for resuming later, do not store the id if null (default)
   * @default null
   */
  local_slug?: string;
}

export interface IProgress {
  value: number;
  message?: string;
  payload?: any;
}

export default () => {
  // const { errorToText } = useFrontValidation(undefined);
  const { success: snackSuccess, error: snackError } = useAlert();
  const { t } = useI18n();

  async function save<T extends BaseModel = BaseModel<any>>(entity: T, options?: IFetchOptions<T> & { onSuccess?: (data: T) => Promise<void> | void; }) {
    const transform = (data: any) => {
      const mutation = options?.mutate ?? true; // default to true
      return options?.builder ? options?.builder(data) : (mutation ? entity.patch(data) : new (entity.constructor as any)(entity).patch(data));
    };
    // persist item in store
    let url, method: any;
    if (entity._id) {
      url = `${entity.$endpoint}/${entity._id}`;
      method = 'PATCH';
    } else {
      url = `${entity.$endpoint}`;
      method = 'POST';
    }

    const { data, status, error, refresh, execute, clear } = useFetch<T>(url, {
      method,
      body: entity.toJSON(),
      query: options?.query,
      immediate: false,
      transform,
      key: uuid(),
      onResponse: async (context) => await onResponse(context, options, transform),
      onResponseError: async (context) => await onResponse(_.assign({}, context, { error: context.response._data }), options, transform),
      watch: _.isArray(options?.watch) ? options.watch : (options?.watch === true ? undefined : false), // false by default watch only if option is true
    });
    const pending = computed(() => status.value === 'pending');
    if (options?.immediate !== false) {
      if (isServer() || options?.await) await execute(); // Need to await for SSR :( (bc the page need to wait for data before rendering)
      else execute(); // don't await upon CSR (so the component don't hang) - use [data] with a watch !
    }

    return { data, status, error, refresh, execute, pending, clear };
  }

  async function retrieve<T extends BaseModel = BaseModel<any>>(entity: T, query: any = {}, options?: IFetchOptions<T> & { onSuccess?: (data: T) => Promise<void> | void; }) {
    if (!entity['_id'] && !query) {
      throw new Error('[MODEL API] no ID (_id) found, can\'t get');
    }

    if (entity.$endpoint) {
      let endpoint = `${entity.$endpoint}`;
      if (_.isString(query)) { // query on a path of the object
        query = { [query]: _.get(entity, query) };
      } else if (entity['_id']) {
        endpoint = `${entity.$endpoint}/${entity['_id']}`;
      }

      const transform = (data: any) => {
        if (_.isArray(data)) data = data[0] as T;
        if (_.isObject(data) && (data as Paginated<any>).data && _.isArray((data as Paginated<any>).data)) data = (data as Paginated<any>).data[0] as T;
        if (data) {
          const mutation = options?.mutate ?? true; // default to true
          return options?.builder ? options?.builder(data) : (mutation ? entity.patch(data) : new (entity.constructor as any)(entity).patch(data));
        } else
          return null;
      };

      const { data, status, error, refresh, execute, clear } = useFetch<T>(endpoint, {
        query: _.merge({}, query, options?.query || {}),
        transform,
        key: uuid(),
        immediate: false,
        watch: _.isArray(options?.watch) ? options.watch : (options?.watch === true ? undefined : false), // false by default watch only if option is true
        onResponse: async (context) => await onResponse(context, options, transform),
        onResponseError: async (context) => await onResponse(_.assign({}, context, { error: context.response._data }), options, transform),
      });
      const pending = computed(() => status.value === 'pending');
      if (options?.immediate !== false) {
        if (isServer() || options?.await) await execute(); // Need to await for SSR :( (bc the page need to wait for data before rendering)
        else execute(); // don't await upon CSR (so the component don't hang) - use [data] with a watch !
      }
      return { data, status, error, refresh, execute, pending, clear };
    }
    else {
      throw new Error(`[MODEL API] no endpoint has been defined for class ${entity.constructor.name}`);
    }
  }

  async function remove<T extends BaseModel = BaseModel<any>>(entity: T, options?: IFetchOptions<T> & { onSuccess?: (data: T) => Promise<void> | void; }) {
    // const { data, error, refresh, execute, pending, status } = (await entity.remove({ await: options?.await, useAPI: { onResponse, options } }) as _AsyncData<T, any>);
    // return { entity, data, error, refresh, execute, pending, status };
    const transform = (data: T) => {
      const mutation = options?.mutate ?? true; // default to true
      return options?.builder ? options?.builder(data) : (mutation ? entity.patch(data) : new (entity.constructor as any)(entity).patch(data)); // this.patch(data as T);
    };
    const { data, status, error, refresh, execute, clear } = useFetch(`${entity.$endpoint}/${entity._id}`, {
      method: 'DELETE',
      immediate: false,
      query: options?.query,
      transform,
      key: uuid(),
      onResponse: async (context) => await onResponse(context, options, transform),
      onResponseError: async (context) => await onResponse(_.assign({}, context, { error: context.response._data }), options, transform),
      watch: _.isArray(options?.watch) ? options.watch : (options?.watch === true ? undefined : false), // false by default watch only if option is true

    });
    const pending = computed(() => status.value === 'pending');
    if (options?.immediate !== false) {
      if (isServer() || options?.await) await execute(); // Need to await for SSR :( (bc the page need to wait for data before rendering)
      else execute(); // don't await upon CSR (so the component don't hang) - use [data] with a watch !
    }
    return { data, status, error, refresh, execute, pending, clear };
  }

  // async function populate<T extends BaseModel = BaseModel<any>>(entity: T, ...paths: string[]) {
  //   for (let path of paths) {
  //     if (!_.isString(path) || !entity.hasBuilder(path)) {
  //       throw new Error('[POPULATE] arguments must be a string and included in $build');
  //     }

  //     if (entity.populated(path)) {
  //       console.warn('[POPULATE] already populated.');
  //       return entity;
  //     }

  //     const memberID = _.get(entity, `${path}ID` || _.get(entity, path));
  //     const member = entity.build(path, { _id: memberID });
  //     const endpoint = member.$endpoint;
  //     if (!endpoint) {
  //       console.error('[POPULATE] no endpoint set in class, can\'t populate.');
  //       return entity;
  //     }
  //     if (!_.isString(memberID)) {
  //       console.error('[POPULATE] no id found in instance, can\'t populate.');
  //       return entity;
  //     }

  //     if (memberID && _.isString(memberID) && !entity.populated(path)) {
  //       // // get path or [path]ID
  //       // const { data, execute } = useFetch(`${endpoint}/${memberID}`, {
  //       //   method: 'GET' as any,
  //       //   immediate: false,
  //       //   transform: (data: any) => {
  //       //     return entity.build(path, data);
  //       //   },
  //       // });
  //       // await execute();
  //       // // if (error.value) throw error.value
  //       // member = data.value;
  //       const { data } = await retrieve(member, undefined, { await: true });
  //       // set the populated member
  //       if (data) {
  //         _.set(entity, path, entity.build(path, member));
  //       }
  //     }
  //   }

  //   return entity;
  // }

  async function fetch<T = any>(route: string, fetchOptions?: UseFetchOptions<any, any, any, any, any>, options?: IFetchOptions<T> & { onSuccess?: (data: T | T[] | Paginated<T>) => Promise<void> | void; }) {
    const { data, status, error, refresh, execute, clear } = useFetch<T>(route, {
      onResponse: async (context: any) => await onResponse(context, options),
      onResponseError: async (context: any) => await onResponse(_.assign({}, context, { error: context.response._data }), options),
      key: uuid(),
      watch: _.isArray(options?.watch) ? options.watch : (options?.watch === true ? undefined : false), // false by default watch only if option is true
      ...fetchOptions,
      immediate: false,
    } as any);
    const pending = computed(() => status.value === 'pending');
    if (options?.immediate !== false) {
      if (isServer() || options?.await) await execute(); // Need to await for SSR :( (bc the page need to wait for data before rendering)
      else execute(); // don't await upon CSR (so the component don't hang) - use [data] with a watch !
    }
    return { data, status, error, refresh, execute, pending, clear };
  }

  async function list<T extends BaseModel = BaseModel<any>>(model: new (data: any) => T, query: any = {}, page?: UnwrapNestedRefs<IPage>, options?: IFetchOptions<T> & { onSuccess?: (data: T[]) => Promise<void> | void; }) {
    const endpoint = new model({}).$endpoint;
    if (!endpoint) throw new GeneralError('Endpoint not exist on Model !');

    const transform = (result: Paginated<T> | T[]) => {
      if (!_.isArray(result) && result.data && result.page) {
        result.data = result.data.map((item: any) => options?.builder ? options?.builder(item) : new model(item));
        _.assign(page, result.page);
        return result.data;
      } else if (_.isArray(result)) {
        return result.map((item: any) => options?.builder ? options?.builder(item) : new model(item));
      } else {
        return [];
      }
    };
    const { data, status, error, refresh, execute, clear } = useFetch<T[]>(endpoint, {
      method: 'GET',
      query,
      params: page || {},
      immediate: false,
      key: uuid(),
      transform,
      watch: _.isArray(options?.watch) ? options.watch : (options?.watch === true ? undefined : false), // false by default watch only if option is true
      onResponse: async (context) => await onResponse(context, options, transform),
      onResponseError: async (context) => await onResponse(_.assign({}, context, { error: context.response._data }), options, transform)
    });
    const pending = computed(() => status.value === 'pending');
    if (options?.immediate !== false) {
      if (isServer() || options?.await) await execute();
      else execute();
    }

    return { data, pending, status, error, refresh, execute, clear };
  }

  async function count(model: new (data: any) => any, query: any = {}, options?: IFetchOptions<any> & { onSuccess?: (count: number) => Promise<void> | void; }) {
    const endpoint = new model({}).$endpoint;
    if (!endpoint) throw new GeneralError('Endpoint not exist on Model !');
    let page: Ref<Partial<IPage>> = ref({
      index: 1,
      limit: 0,
    });
    const transform = (result: Paginated<any>) => {
      if (!_.isArray(result) && result.data && result.page) {
        return result.page.total;
      } else if (_.isArray(result)) {
        return result.length;
      } else if (_.isNumber(result)) {
        return result;
      } else {
        return 0;
      }
    };

    const { data, status, error, refresh, execute, clear } = useFetch<any>(endpoint, {
      method: 'GET',
      query,
      params: page || {},
      immediate: false,
      key: uuid(),
      transform,
      watch: _.isArray(options?.watch) ? options.watch : (options?.watch === true ? undefined : false), // false by default watch only if option is true
      onResponse: async (context) => await onResponse(context, options, transform),
      onResponseError: async (context) => await onResponse(_.assign({}, context, { error: context.response._data }), options, transform)
    });
    const pending = computed(() => status.value === 'pending');
    if (options?.immediate !== false) {
      if (isServer() || options?.await) await execute();
      else execute();
    }
    return { data, pending, status, error, refresh, execute, clear };
  }

  async function bulkSave<T extends BaseModel = BaseModel<any>>(model: new (data: any) => T, entities: T[], options?: IFetchOptions<T> & { onSuccess?: (data: T[]) => Promise<void> | void; }) {
    const endpoint = new model({}).$endpoint;
    if (!endpoint) throw new GeneralError('Endpoint not exist on Model !');

    const transform = (result: T[]) => {
      if (_.isArray(result)) {
        return result.map((item: any) => new model(item));
      } else {
        return [];
      }
    };
    const { data, status, error, refresh, execute, clear } = useFetch(endpoint, {
      method: 'POST',
      body: entities,
      immediate: false,
      key: uuid(),
      transform,
      watch: _.isArray(options?.watch) ? options.watch : (options?.watch === true ? undefined : false), // false by default watch only if option is true
      onResponse: async (context) => await onResponse(context, options, transform),
      onResponseError: async (context) => await onResponse(_.assign({}, context, { error: context.response._data }), options, transform)
    });
    const pending = computed(() => status.value === 'pending');
    if (options?.immediate !== false) {
      if (isServer() || options?.await) await execute();
      else execute();
    }
    return { data, pending, status, error, refresh, execute, clear };
  }

  async function bulkRemove<T extends BaseModel = BaseModel<any>>(model: new (data: any) => T, entities: T[], options?: IFetchOptions<T> & { onSuccess?: (data: T[]) => Promise<void> | void; }) {
    const endpoint = new model({}).$endpoint;
    if (!endpoint) throw new GeneralError('Endpoint not exist on Model !');

    const transform = (result: T[]) => {
      if (_.isArray(result)) {
        return result.map((item: any) => new model(item));
      } else {
        return [];
      }
    };
    const { data, status, error, refresh, execute, clear } = useFetch(endpoint, {
      method: 'DELETE',
      body: entities.map(e => e._id).filter(id => !!id),
      immediate: false,
      key: uuid(),
      transform,
      onResponse: async (context) => await onResponse(context, options, transform),
      onResponseError: async (context) => await onResponse(_.assign({}, context, { error: context.response._data }), options, transform),
      watch: _.isArray(options?.watch) ? options.watch : (options?.watch === true ? undefined : false), // false by default watch only if option is true
    });
    const pending = computed(() => status.value === 'pending');
    if (options?.immediate !== false) {
      if (isServer() || options?.await) await execute();
      else execute();
    }
    return { data, pending, status, error, refresh, execute, clear };
  }

  async function onResponse<T>(context: FetchContext<T | T[], ResponseType> & { response: FetchResponse<T[] | T>; }, options?: IFetchOptions<T> & { onSuccess?: (data: any) => Promise<void> | void; }, transform?: (result: any) => T[] | T) {
    const defaultOptions: IFetchOptions<any> & { onSuccess?: (data: T[]) => Promise<void> | void; } = {
      snack: {
        success: null,
        error: null,
      },
      onSuccess: undefined,
      onError: undefined,
    };

    const _options: IFetchOptions<T> & { onSuccess?: (data: T[]) => Promise<void> | void; } = _.merge({}, defaultOptions, options || {});
    const errorHandle = async (error: any) => {
      if (!error) {
        return;
      }

      if (_.isString(_options.snack?.error)) {
        snackError(t(_options.snack!.error));
      } else if (error?.message || error?.statusMessage) {
        snackError(t(error?.message || error?.statusMessage as string));
      } else {
        console.error('[API] error', error);
        // snackError(t('failure'));
      }

      if (_options.onError) await _options.onError(error);
    };

    const storeSSEIdInLocalStorage = (id: string, slug: string) => {
      try {
        localStorage.setItem(slug, id);
      } catch (error) {
        console.error('Failed to store SSE ID in localStorage:', error);
      }
    };

    const sseHandler = async (data: any) => {
      if (!data.sse_handler) return data;
      const { type, id } = data.sse_handler;

      if (_options.local_slug)
        storeSSEIdInLocalStorage(id, `sse_id_${_options.local_slug}`);

      switch (type) {
        case 'progress':
          return await progress(id, _options.progress);
        default:
          return data;
      }

    };
    const dataHandle = async (data: any) => {
      if (!data) {
        return;
      }
      // Handle progress
      if (data?.sse_handler) {
        data = await sseHandler(data);
      }

      // Update the data ref in options if passed 
      if (_options?.data) {
        _options.data.value = data;
      }

      // console.log('SNACK ?', _options?.snack?.success && _.isString(_options.snack.success))
      if (_options?.snack?.success && _.isString(_options.snack.success)) {
        snackSuccess(t(_options.snack.success));
      }
      if (_options.onSuccess) await _options.onSuccess(data);

      return data;
    };

    if (context.error) await errorHandle(context.error);
    else if (context.response?._data && context.response.ok) {
      context.response._data = await dataHandle(transform ? transform(context.response._data) : context.response._data);
    }
  }

  async function resumeProgress(local_slug: string, progress_value: Ref<IProgress | null>, sse_id?: string): Promise<any> {
    const id = sse_id || localStorage.getItem(`sse_id_${local_slug}`);
    if (!id) return;

    try {
      const data_progress = await progress(id, progress_value);
      if (!sse_id && local_slug) localStorage.removeItem(`sse_id_${local_slug}`);
      return data_progress;
    } catch (error) {
      console.error(`[PROGRESS] Failed to resume SSE for ID: ${id}`, error);
      throw error;
    }
  }

  async function progress(id: string, progress?: Ref<IProgress | null>) {
    const { data, close, error, event, eventSource, lastEventId, open, status } = useEventSource(`/api/sse/${id}`, [], {
      immediate: true,
    });

    const stopWatch = watch(data, (value: string | null) => {
      if (value) {
        let progress_value: IProgress | IServerSentEvent = JSON.parse(value);
        if ('sse_handler' in progress_value && progress_value.sse_handler.done) {
          stopWatch();
          close();
          return;
        }
        if (progress) {
          progress.value = progress_value as IProgress;
        }
      }
    }, { deep: true });

    return await new Promise<void>((resolve, reject) => {
      const interval = setInterval(() => {
        if (data.value) {
          let progress_value: IProgress | IServerSentEvent = JSON.parse(data.value);
          if ('sse_handler' in progress_value && progress_value.sse_handler.done) {
            clearInterval(interval);
            if (progress) progress.value = null;
            if (progress_value.sse_handler.error) {
              reject(progress_value.sse_handler.error);
              return;
            }
            const data = progress_value.sse_handler.data;
            resolve(data ? progress_value.sse_handler.data : null);
            return;
          }
        }
        if (error.value) {
          clearInterval(interval);
          reject(error.value);
        }
      }, 100);
    });
  }

  return {
    save,
    remove,
    retrieve,
    fetch,
    list,
    count,
    resumeProgress,
    bulk: {
      save: bulkSave,
      remove: bulkRemove
    }
  };
};