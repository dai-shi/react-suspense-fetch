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
  preloaded?: Iterable<readonly [Input, Result]>,
) {
  type GetResult = () => Result;
  const cache = new Map<Input, GetResult>();
  const weakCache = new WeakMap<object, GetResult>();
  if (preloaded) {
    for (const [input, result] of preloaded) {
      if (isObject(input)) {
        weakCache.set(input, () => result);
      } else {
        cache.set(input, () => result);
      }
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
    if (isObject(input)) {
      if (!weakCache.has(input)) {
        weakCache.set(input, createGetResult(input));
      }
      return;
    }
    if (!cache.has(input)) {
      cache.set(input, createGetResult(input));
    }
  };
  const evict = (input: Input) => {
    if (isObject(input)) {
      weakCache.delete(input);
    } else {
      cache.delete(input);
    }
  };
  const store: FetchStore<Result, Input> = {
    prefetch,
    evict,
    get: (input: Input) => {
      let getResult = isObject(input) ? weakCache.get(input) : cache.get(input);
      if (!getResult) {
        prefetch(input);
        getResult = (
          isObject(input) ? weakCache.get(input) : cache.get(input)
        ) as GetResult;
      }
      return getResult();
    },
  };
  return store;
}
