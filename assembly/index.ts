// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
	return a + b;
}

export function subtract(a: i32, b: i32): i32 {
	return a - b;
}

export function multiply(a: i32, b: i32): i32 {
	return a * b;
}

export function divide(a: i32, b: i32): i32 {
	return a / b;
}

export function sum(numbers: i32[]): i32 {
	return numbers.reduce((total, x) => total + x, 0);
}

export function average(numbers: i32[]): i32 {
	return sum(numbers) / numbers.length;
}

function convolution(vec1: Array<i32>, vec2: Array<i32>): Array<i32> {
	let disp = 0; // displacement given after each vector multiplication by element of another vector
	const convVec: Array<i32> = [];
	// for first multiplication
	for (let n = 0; n < vec2.length; n++) {
		convVec.push(vec1[0] * vec2[n]);
	}

	disp = disp + 1;

	for (let i = 1; i < vec1.length; i++) {
		for (let j = 0; j < vec2.length; j++) {
			if (disp + j !== convVec.length) {
				convVec[disp + j] = convVec[disp + j] + vec1[i] * vec2[j];
			} else {
				convVec.push(vec1[i] * vec2[j]);
			}
		}
		disp = disp + 1;
	}
	return convVec;
}

export function convolve(vectors: Array<Array<i32>>): Array<i32> {
	if (vectors.length === 0) return [];
	if (vectors.length === 1) return vectors[0];

	let convolved: Array<i32> = [];

	for (let i = 0; i < vectors.length - 1; i++) {
		convolved = convolution(vectors[i], vectors[i + 1]);
	}
	return convolved;
}

export function calcFib(limit: i32): i32[] {
	return calcFibSequence([], 0, limit);
}

function calcFibSequence(sequence: i32[], curNum: i32, limit: i32): i32[] {
	if (sequence.length > limit) return sequence;
	const curFib = fib(curNum);
	sequence.push(curFib);
	return calcFibSequence(sequence, ++curNum, limit);
}

function fib(n: i32): i32 {
	if (n < 2) {
		return n;
	}
	return fib(n - 1) + fib(n - 2);
}

export function array(arr: i32[]): i32 {
	return 1;
}
