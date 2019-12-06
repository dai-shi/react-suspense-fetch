/* eslint arrow-parens: off */ // FIXME why does it complain?

const RUN_FETCH = Symbol('RUN_FETCH');

type FetchFunc<Result, Input> = (input: Input) => Promise<Result>;

type TransformFunc<Input, Source> = (source: Source) => Input;

export type FetchResult<Result, Input> = Result & {
  [RUN_FETCH]: (input: Input) => FetchResult<Result, Input>;
};

type Prepare = {
  <Result extends object, Input, Source>(
    fetchFunc: FetchFunc<Result, Input>,
    transformFunc: TransformFunc<Input, Source>,
  ): FetchResult<Result, Source>;
  <Result extends object, Input>(
    fetchFunc: FetchFunc<Result, Input>,
  ): FetchResult<Result, Input>;
};

type Prefetch = {
  <Result extends object, Input, Source>(
    fetchFunc: FetchFunc<Result, Input>,
    source: Source,
    transformFunc: TransformFunc<Input, Source>,
  ): FetchResult<Result, Source>;
  <Result extends object, Input>(
    fetchFunc: FetchFunc<Result, Input>,
    input: Input,
  ): FetchResult<Result, Input>;
};

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

type State<Result> = {
  started: boolean;
  promise?: Promise<void>;
  resolve?: () => void;
  data?: Result;
  error?: Error;
};

/**
 * Prepare fetch
 * Create a new suspendable result from fetchFunc.
 * The result is mutable and can be run later.
 * It will suspend forever unless run() is called.
 *
 * @example
 * import { prepare } from 'react-suspense-fetch';
 *
 * const fetchFunc = async userId => (await fetch(`https://reqres.in/api/users/${userId}?delay=3`)).json();
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
  const start = async (inputOrSource: Input | Source) => {
    state.started = true;
    try {
      if (transformFunc) {
        const input = await transform(transformFunc, inputOrSource as Source);
        state.data = await fetchFunc(input);
      } else {
        state.data = await fetchFunc(inputOrSource as Input);
      }
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
  return new Proxy({}, {
    get(_target, key) {
      if (key === RUN_FETCH) return runFetch;
      if (state.promise) throw state.promise;
      if (state.error) throw state.error;
      const item = (state.data as { [key: string]: unknown })[key as string];
      if (typeof item === 'function') {
        // For something like Array.prototype.map
        // Is there a better way?
        return (item as Function).bind(state.data);
      }
      return item;
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
  }) as FetchResult<Result, Input | Source>;
};

/**
 * Run
 * Run the prepared suspendable result
 *
 * @example
 * import { prepare, run } from 'react-suspense-fetch';
 *
 * const result = prepare(fetchFunc);
 * run(result, 1); // the result will be mutated.
 */
export const run = <Result extends object, Input>(
  result: FetchResult<Result, Input>,
  input: Input,
) => result[RUN_FETCH](input);

/**
 * Prefetch
 * Create a new suspendable result and run fetchFunc immediately.
 *
 * @example
 * import { prefetch } from 'react-suspense-fetch';
 *
 * const result = prefetch(fetchFunc, 1);
 */
export const prefetch: Prefetch = <Result extends object, Input, Source>(
  fetchFunc: FetchFunc<Result, Input>,
  inputOrSource: Input | Source,
  transformFunc?: TransformFunc<Input, Source>,
) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const result = prepare(fetchFunc, transformFunc as any);
  run(result, inputOrSource as any);
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return result;
};
