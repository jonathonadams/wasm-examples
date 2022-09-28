/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * assembly/index/add
 * @param a `i32`
 * @param b `i32`
 * @returns `i32`
 */
export declare function add(a: number, b: number): number;
/**
 * assembly/index/subtract
 * @param a `i32`
 * @param b `i32`
 * @returns `i32`
 */
export declare function subtract(a: number, b: number): number;
/**
 * assembly/index/multiply
 * @param a `i32`
 * @param b `i32`
 * @returns `i32`
 */
export declare function multiply(a: number, b: number): number;
/**
 * assembly/index/divide
 * @param a `i32`
 * @param b `i32`
 * @returns `i32`
 */
export declare function divide(a: number, b: number): number;
/**
 * assembly/index/sum
 * @param numbers `~lib/array/Array<i32>`
 * @returns `i32`
 */
export declare function sum(numbers: Array<number>): number;
/**
 * assembly/index/average
 * @param numbers `~lib/array/Array<i32>`
 * @returns `i32`
 */
export declare function average(numbers: Array<number>): number;
/**
 * assembly/index/convolve
 * @param vectors `~lib/array/Array<~lib/array/Array<i32>>`
 * @returns `~lib/array/Array<i32>`
 */
export declare function convolve(vectors: Array<Array<number>>): Array<number>;
/**
 * assembly/index/calcFib
 * @param limit `i32`
 * @returns `~lib/array/Array<i32>`
 */
export declare function calcFib(limit: number): Array<number>;
/**
 * assembly/index/array
 * @param arr `~lib/array/Array<i32>`
 * @returns `i32`
 */
export declare function array(arr: Array<number>): number;
