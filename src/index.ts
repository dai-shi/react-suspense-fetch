type FetchFunc<Result, Input> = (
  input: Input,
  options: { signal: AbortSignal },
) => Promise<Result>;

type GetOptions = {
  forcePrefetch?: boolean;
};

/**
 * fetch store
 *
 * `prefetch` will start fetching.
 * `get` will return a result or throw a promise when a result is not ready.
 * `evict` will remove a result.
 * `abort` will cancel fetching.
 *
 * There are three cache types:
 * - WeakMap: `input` has to be an object in this case
 * - Map: you need to call evict to remove from cache
 * - Map with areEqual: you can specify a custom comparator
 */
export type FetchStore<Result, Input> = {
  prefetch: (input: Input) => void;
  get: (input: Input, option?: GetOptions) => Result;
  evict: (input: Input) => void;
  abort: (input: Input) => void;
};

const isObject = (x: unknown): x is object => typeof x === 'object' && x !== null;

const createMapLikeWithComparator = <K, V>(areEqual: (a: K, b: K) => boolean) => {
  const map = new Map<K, V>();
  const has = (key: K) => {
    for (const [k] of map) {
      if (areEqual(k, key)) {
        return true;
      }
    }
    return false;
  };
  const get = (key: K) => {
    for (const [k, v] of map) {
      if (areEqual(k, key)) {
        return v;
      }
    }
    return undefined;
  };
  const remove = (key: K) => {
    for (const [k] of map) {
      if (areEqual(k, key)) {
        map.delete(k);
      }
    }
  };
  return {
    set: (key: K, value: V) => { map.set(key, value); },
    has,
    get,
    delete: remove,
  };
};

type CacheType<Input> =
  | { type: 'WeakMap'}
  | {
    type: 'Map';
    areEqual?: ((a: Input, b: Input) => boolean);
  };

const createCache = <Input, Instance>(
  cacheType?: CacheType<Input>,
) => {
  if (cacheType?.type === 'WeakMap') {
    return new WeakMap<object, Instance>() as unknown as Map<Input, Instance>;
  }
  const areEqual = cacheType?.type === 'Map' && cacheType.areEqual;
  if (areEqual) {
    return createMapLikeWithComparator<Input, Instance>(areEqual);
  }
  return new Map<Input, Instance>();
};

export function createFetchStore<Result, Input extends object>(
  fetchFunc: FetchFunc<Result, Input>,
  cacheType: { type: 'WeakMap' },
  preloaded?: Iterable<readonly [Input, Result]>,
): FetchStore<Result, Input>

export function createFetchStore<Result, Input>(
  fetchFunc: FetchFunc<Result, Input>,
  cacheType?: {
    type: 'Map';
    areEqual?: ((a: Input, b: Input) => boolean);
  },
  preloaded?: Iterable<readonly [Input, Result]>,
): FetchStore<Result, Input>

/**
 * create fetch store
 *
 * @example
 * import { createFetchStore } from 'react-suspense-fetch';
 *
 * const fetchFunc = async (userId) => (await fetch(`https://reqres.in/api/users/${userId}?delay=3`)).json();
 * const store = createFetchStore(fetchFunc);
 * store.prefetch('1');
 */
export function createFetchStore<Result, Input>(
  fetchFunc: FetchFunc<Result, Input>,
  cacheType?: CacheType<Input>,
  preloaded?: Iterable<readonly [Input, Result]>,
) {
  type Instance = {
    get: () => Result;
    abort: () => void;
  };
  const cache = createCache<Input, Instance>(cacheType);
  const assertObjectInput = (input: Input) => {
    if (cacheType?.type === 'WeakMap' && !isObject(input)) {
      throw new Error('WeakMap requires object input');
    }
  };
  if (preloaded) {
    for (const [input, result] of preloaded) {
      assertObjectInput(input);
      cache.set(input, {
        get: () => result,
        abort: () => {
          // nothing
        },
      });
    }
  }
  const createInstance = (input: Input) => {
    let promise: Promise<void> | null = null;
    let result: Result | null = null;
    let error: unknown | null = null;
    const controller = new AbortController();
    promise = (async () => {
      try {
        result = await fetchFunc(input, { signal: controller.signal });
      } catch (e) {
        error = e;
      } finally {
        promise = null;
      }
    })();
    return {
      get: () => {
        if (promise) throw promise;
        if (error !== null) throw error;
        return result as Result;
      },
      abort: () => {
        controller.abort();
      },
    };
  };
  const prefetch = (input: Input) => {
    assertObjectInput(input);
    if (!cache.has(input)) {
      cache.set(input, createInstance(input));
    }
  };
  const get = (input: Input, options?: GetOptions) => {
    assertObjectInput(input);
    if (options?.forcePrefetch) {
      prefetch(input);
    }
    const instance = cache.get(input);
    if (!instance) {
      throw new Error('prefetch() must be called before get()');
    }
    return instance.get();
  };
  const evict = (input: Input) => {
    assertObjectInput(input);
    cache.delete(input);
  };
  const abort = (input: Input) => {
    assertObjectInput(input);
    cache.get(input)?.abort();
  };
  const store: FetchStore<Result, Input> = {
    prefetch,
    get,
    evict,
    abort,
  };
  return store;
}
