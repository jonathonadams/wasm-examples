export function add(a: number, b: number): number {
	return a + b;
}

export function subtract(a: number, b: number): number {
	return a - b;
}

export function multiply(a: number, b: number): number {
	return a * b;
}

export function divide(a: number, b: number): number {
	return a / b;
}

export function sum(numbers: number[]): number {
	return numbers.reduce((total, x) => total + x, 0);
}

export function average(numbers: number[]): number {
	return sum(numbers) / numbers.length;
}

export function calcFib(limit: number): number[] {
	return getNextFib([], 0, limit);
}

export function array(arr: number[]): number {
	return 1;
}

function getNextFib(fibSequence: number[], curNum: number, limit: number): number[] {
	if (fibSequence.length > limit) return fibSequence;
	const curFib = fib(curNum);
	fibSequence.push(curFib);
	return getNextFib(fibSequence, ++curNum, limit);
}

export function fib(n: number): number {
	if (n < 2) {
		return n;
	}
	return fib(n - 1) + fib(n - 2);
}

export function convolution(vec1: number[], vec2: number[]) {
	let disp = 0; // displacement given after each vector multiplication by element of another vector
	const convVec = [];
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

	// Trim to original size
	// const span = Math.floor(vec1.length / 2);
	// return convVec.slice(Math.floor(convVec.length / 2) - span, Math.ceil(convVec.length / 2 + span));
}

export function convolve(vectors: number[][]): number[] {
	if (vectors.length === 0) return [];
	if (vectors.length === 1) return vectors[0];

	let convolved: number[] = vectors[1];

	for (let i = 1; i <= vectors.length - 1; i++) {
		convolved = convolution(convolved, vectors[i]);
	}

	return convolved;
}
