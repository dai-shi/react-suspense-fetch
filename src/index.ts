type FetchFunc<Result, Input> = (input: Input) => Promise<Result>;

/**
 * fetch store
 *
 * `get` will throw a promise when a result is not ready.
 * `prefetch` will start fetching.
 * `evict` will remove a result.
 * If `input` is an object, a result will be stored in WeakMap.
 * Othrewise, a result will be stored in Map.
 */
export type FetchStore<Result, Input> = {
  get: (input: Input) => Result;
  prefetch: (input: Input) => void;
  evict: (input: Input) => void;
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

const createCache = <Input, GetResult>(
  cacheType?:
    | { type: 'WeakMap'}
    | {
      type: 'Map';
      areEqual?: ((a: Input, b: Input) => boolean);
    },
) => {
  if (cacheType?.type === 'WeakMap') {
    return new WeakMap<object, GetResult>() as unknown as Map<Input, GetResult>;
  }
  const areEqual = cacheType?.type === 'Map' && cacheType.areEqual;
  if (areEqual) {
    return createMapLikeWithComparator<Input, GetResult>(areEqual);
  }
  return new Map<Input, GetResult>();
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
  cacheType?:
    | { type: 'WeakMap'}
    | {
      type: 'Map';
      areEqual?: ((a: Input, b: Input) => boolean);
    },
  preloaded?: Iterable<readonly [Input, Result]>,
) {
  type GetResult = () => Result;
  const cache = createCache<Input, GetResult>(cacheType);
  const assertObjectInput = (input: Input) => {
    if (cacheType?.type === 'WeakMap' && !isObject(input)) {
      throw new Error('WeakMap requires object input');
    }
  };
  if (preloaded) {
    for (const [input, result] of preloaded) {
      assertObjectInput(input);
      cache.set(input, () => result);
    }
  }
  const createGetResult = (input: Input) => {
    let promise: Promise<void> | null = null;
    let result: Result | null = null;
    let error: Error | null = null;
    promise = (async () => {
      try {
        result = await fetchFunc(input);
      } catch (e) {
        error = e;
      } finally {
        promise = null;
      }
    })();
    const getResult = () => {
      if (promise) throw promise;
      if (error !== null) throw error;
      return result as Result;
    };
    return getResult;
  };
  const prefetch = (input: Input) => {
    assertObjectInput(input);
    if (!cache.has(input)) {
      cache.set(input, createGetResult(input));
    }
  };
  const evict = (input: Input) => {
    assertObjectInput(input);
    cache.delete(input);
  };
  const store: FetchStore<Result, Input> = {
    prefetch,
    evict,
    get: (input: Input) => {
      assertObjectInput(input);
      let getResult = cache.get(input);
      if (!getResult) {
        prefetch(input);
        getResult = cache.get(input) as GetResult;
      }
      return getResult();
    },
  };
  return store;
}
