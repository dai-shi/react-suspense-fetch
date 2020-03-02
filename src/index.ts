// ----------------------------------------------------------------------
// Symbols
// ----------------------------------------------------------------------

const RUN_FETCH = Symbol('RUN_FETCH');
const CLONE_FETCH = Symbol('CLONE_FETCH');

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

type FetchFunc<Result, Input> = (input: Input) => Promise<Result>;

type TransformFunc<Input, Source> = (source: Source) => Input;

/**
 * Type for suspendable result with special functions.
 * Suspendable can throw a promise.
 */
export type Suspendable<Result, Input> = Result & {
  [RUN_FETCH]: (input: Input) => void;
  [CLONE_FETCH]: () => Suspendable<Result, Input>;
};

type Prepare = {
  <Result extends object, Input, Source>(
    fetchFunc: FetchFunc<Result, Input>,
    transformFunc: TransformFunc<Input, Source>,
  ): Suspendable<Result, Source>;
  <Result extends object, Input>(
    fetchFunc: FetchFunc<Result, Input>,
  ): Suspendable<Result, Input>;
};

type Prefetch = {
  <Result extends object, Input, Source>(
    fetchFunc: FetchFunc<Result, Input>,
    source: Source,
    transformFunc: TransformFunc<Input, Source>,
  ): Suspendable<Result, Source>;
  <Result extends object, Input>(
    fetchFunc: FetchFunc<Result, Input>,
    input: Input,
  ): Suspendable<Result, Input>;
};

type Refetch = <Result extends object, Input>(
  result: Suspendable<Result, Input>,
  input: Input,
) => Suspendable<Result, Input>;

// ----------------------------------------------------------------------
// Utility Functions
// ----------------------------------------------------------------------

const isPromise = (x: unknown): x is Promise<unknown> => (
  !!x && typeof (x as Promise<unknown>).then === 'function'
);

const transform = async <Input, Source>(
  transformFunc: TransformFunc<Input, Source>,
  source: Source,
): Promise<Input> => {
  try {
    return transformFunc(source);
  } catch (e) {
    if (isPromise(e)) {
      await e;
      return transform(transformFunc, source);
    }
    throw e;
  }
};

// ----------------------------------------------------------------------
// Main Functions
// ----------------------------------------------------------------------

type State<Result> = {
  started: boolean;
  promise?: Promise<void>;
  resolve?: () => void;
  data?: Result;
  error?: Error;
};

/**
 * Create a new suspendable result from fetchFunc.
 * The result is mutable and can be run later just once.
 * It will suspend forever unless run() is called.
 *
 * This is an internal API. Prefer using prefetch/refetch.
 *
 * @example
 * import { prepare } from 'react-suspense-fetch';
 *
 * const fetchFunc = async (userId) => {
 *   const res = await fetch(`https://reqres.in/api/users/${userId}?delay=3`);
 *   return res.json();
 * };
 * const result = prepare(fetchFunc);
 */
export const prepare: Prepare = <Result extends object, Input, Source>(
  fetchFunc: FetchFunc<Result, Input>,
  transformFunc?: TransformFunc<Input, Source>,
) => {
  const state: State<Result> = { started: false };
  state.promise = new Promise((resolve) => {
    state.resolve = resolve;
  });
  const obj: Partial<Result> = {};
  const start = async (inputOrSource: Input | Source) => {
    state.started = true;
    try {
      let data: Result;
      if (transformFunc) {
        const input = await transform(transformFunc, inputOrSource as Source);
        data = await fetchFunc(input);
      } else {
        data = await fetchFunc(inputOrSource as Input);
      }
      Object.keys(data).forEach((key) => {
        obj[key as keyof Result] = data[key as keyof Result];
      });
      state.data = data;
    } catch (e) {
      state.error = e;
    } finally {
      delete state.promise;
      if (state.resolve) {
        state.resolve();
        delete state.resolve;
      }
    }
  };
  const runFetch = (inputOrSource: Input | Source) => {
    if (state.started) return;
    state.promise = start(inputOrSource);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cloneFetch = () => prepare(fetchFunc, transformFunc as any);
  return new Proxy(obj, {
    get(_target, key) {
      if (key === RUN_FETCH) return runFetch;
      if (key === CLONE_FETCH) return cloneFetch;
      if (state.promise) throw state.promise;
      if (state.error) throw state.error;
      return (state.data as { [key: string]: unknown })[key as string];
    },
    has(_target, key) {
      if (state.promise) throw state.promise;
      if (state.error) throw state.error;
      return key in (state.data as { [key: string]: unknown });
    },
    ownKeys() {
      if (state.promise) throw state.promise;
      if (state.error) throw state.error;
      return Reflect.ownKeys(state.data as { [key: string]: unknown });
    },
    getOwnPropertyDescriptor(_target, key) {
      if (state.promise) throw state.promise;
      if (state.error) throw state.error;
      return Reflect.getOwnPropertyDescriptor(state.data as { [key: string]: unknown }, key);
    },
    getPrototypeOf() {
      if (state.promise) throw state.promise;
      if (state.error) throw state.error;
      return Object.getPrototypeOf(state.data);
    },
    isExtensible() {
      return true;
    },
    preventExtensions() {
      return false;
    },
    setPrototypeOf() {
      return false;
    },
    set() {
      return false;
    },
    defineProperty() {
      return false;
    },
    deleteProperty() {
      return false;
    },
  }) as Suspendable<Result, Input | Source>;
};

/**
 * Run the prepared suspendable result.
 *
 * This is an internal API. Prefer using prefetch/refetch.
 *
 * @example
 * import { prepare, run } from 'react-suspense-fetch';
 *
 * const fetchFunc = async (userId) => {
 *   const res = await fetch(`https://reqres.in/api/users/${userId}?delay=3`);
 *   return res.json();
 * };
 * const result = prepare(fetchFunc);
 * run(result, 1); // the result will be mutated.
 */
export const run = <Result extends object, Input>(
  result: Suspendable<Result, Input>,
  input: Input,
) => result[RUN_FETCH](input);

/**
 * Create a new suspendable result and run fetchFunc immediately.
 *
 * @example
 * import { prefetch } from 'react-suspense-fetch';
 *
 * const fetchFunc = async userId => (await fetch(`https://reqres.in/api/users/${userId}?delay=3`)).json();
 * const result = prefetch(fetchFunc, 1);
 */
export const prefetch: Prefetch = <Result extends object, Input, Source>(
  fetchFunc: FetchFunc<Result, Input>,
  inputOrSource: Input | Source,
  transformFunc?: TransformFunc<Input, Source>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = prepare(fetchFunc, transformFunc as any);
  run(result, inputOrSource);
  return result;
};

/**
 * Create a new suspendable result and from an existing suspendable result.
 * It runs fetchFunc immediately.
 *
 * @example
 * import { refetch } from 'react-suspense-fetch';
 *
 * const result = ...; // created by prepare or prefetch
 * const newResult = refetch(result, 2);
 */
export const refetch: Refetch = <Result extends object, Input>(
  result: Suspendable<Result, Input>,
  input: Input,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newResult = result[CLONE_FETCH]();
  run(newResult, input);
  return newResult;
};
