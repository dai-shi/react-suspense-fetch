 
declare const RUN_FETCH: unique symbol;
declare type FetchFunc<Result, Input> = (input: Input) => Promise<Result>;
declare type TransformFunc<Input, Source> = (source: Source) => Input;
export declare type FetchResult<Result, Input> = Result & {
    [RUN_FETCH]: (input: Input) => FetchResult<Result, Input>;
};
declare type Prepare = {
    <Result extends object, Input, Source>(fetchFunc: FetchFunc<Result, Input>, transformFunc: TransformFunc<Input, Source>): FetchResult<Result, Source>;
    <Result extends object, Input>(fetchFunc: FetchFunc<Result, Input>): FetchResult<Result, Input>;
};
declare type Prefetch = {
    <Result extends object, Input, Source>(fetchFunc: FetchFunc<Result, Input>, source: Source, transformFunc: TransformFunc<Input, Source>): FetchResult<Result, Source>;
    <Result extends object, Input>(fetchFunc: FetchFunc<Result, Input>, input: Input): FetchResult<Result, Input>;
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
export declare const prepare: Prepare;
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
export declare const run: <Result extends object, Input>(result: FetchResult<Result, Input>, input: Input) => FetchResult<Result, Input>;
/**
 * Prefetch
 * Create a new suspendable result and run fetchFunc immediately.
 *
 * @example
 * import { prefetch } from 'react-suspense-fetch';
 *
 * const result = prefetch(fetchFunc, 1);
 */
export declare const prefetch: Prefetch;
export {};
