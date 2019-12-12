 
declare const RUN_FETCH: unique symbol;
declare type FetchFunc<Result, Input> = (input: Input) => Promise<Result>;
declare type TransformFunc<Input, Source> = (source: Source) => Input;
declare type Suspendable<Result> = Result;
export declare type Prepared<Result, Input> = Suspendable<Result> & {
    [RUN_FETCH]: (input: Input) => void;
};
declare type Prepare = {
    <Result extends object, Input, Source>(fetchFunc: FetchFunc<Result, Input>, transformFunc: TransformFunc<Input, Source>): Prepared<Result, Source>;
    <Result extends object, Input>(fetchFunc: FetchFunc<Result, Input>): Prepared<Result, Input>;
};
declare type Prefetch = {
    <Result extends object, Input, Source>(fetchFunc: FetchFunc<Result, Input>, source: Source, transformFunc: TransformFunc<Input, Source>): Suspendable<Result>;
    <Result extends object, Input>(fetchFunc: FetchFunc<Result, Input>, input: Input): Suspendable<Result>;
};
/**
 * Create a new suspendable result from fetchFunc.
 * The result is mutable and can be run later just once.
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
 * Run the prepared suspendable result.
 *
 * @example
 * import { prepare, run } from 'react-suspense-fetch';
 *
 * const fetchFunc = async userId => (await fetch(`https://reqres.in/api/users/${userId}?delay=3`)).json();
 * const result = prepare(fetchFunc);
 * run(result, 1); // the result will be mutated.
 */
export declare const run: <Result extends object, Input>(result: Prepared<Result, Input>, input: Input) => void;
/**
 * Create a new suspendable result and run fetchFunc immediately.
 *
 * @example
 * import { prefetch } from 'react-suspense-fetch';
 *
 * const fetchFunc = async userId => (await fetch(`https://reqres.in/api/users/${userId}?delay=3`)).json();
 * const result = prefetch(fetchFunc, 1);
 */
export declare const prefetch: Prefetch;
export {};
