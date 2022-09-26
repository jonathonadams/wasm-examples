/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * assembly/index/add
 * @param a `usize`
 * @param b `usize`
 * @returns `usize`
 */
export declare function add(a: number, b: number): number;
/**
 * assembly/index/convolution
 * @param vec1 `~lib/array/Array<usize>`
 * @param vec2 `~lib/array/Array<usize>`
 * @returns `~lib/array/Array<usize>`
 */
export declare function convolution(vec1: Array<number>, vec2: Array<number>): Array<number>;
/**
 * assembly/index/convolve
 * @param vectors `~lib/array/Array<~lib/array/Array<usize>>`
 * @returns `~lib/array/Array<usize>`
 */
export declare function convolve(vectors: Array<Array<number>>): Array<number>;
