declare const RUN_FETCH: unique symbol;
declare const CLONE_FETCH: unique symbol;
declare type FetchFunc<Result, Input> = (input: Input) => Promise<Result>;
declare type TransformFunc<Input, Source> = (source: Source) => Input;
/**
 * Type for suspendable result with special functions.
 * Suspendable can throw a promise.
 */
export declare type Suspendable<Result, Input> = Result & {
    [RUN_FETCH]: (input: Input) => void;
    [CLONE_FETCH]: () => Suspendable<Result, Input>;
};
declare type Prepare = {
    <Result extends object, Input, Source>(fetchFunc: FetchFunc<Result, Input>, transformFunc: TransformFunc<Input, Source>): Suspendable<Result, Source>;
    <Result extends object, Input>(fetchFunc: FetchFunc<Result, Input>): Suspendable<Result, Input>;
};
declare type Prefetch = {
    <Result extends object, Input, Source>(fetchFunc: FetchFunc<Result, Input>, source: Source, transformFunc: TransformFunc<Input, Source>): Suspendable<Result, Source>;
    <Result extends object, Input>(fetchFunc: FetchFunc<Result, Input>, input: Input): Suspendable<Result, Input>;
};
declare type Refetch = <Result extends object, Input>(result: Suspendable<Result, Input>, input: Input) => Suspendable<Result, Input>;
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
export declare const prepare: Prepare;
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
export declare const run: <Result extends object, Input>(result: Suspendable<Result, Input>, input: Input) => void;
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
export declare const refetch: Refetch;
export {};
