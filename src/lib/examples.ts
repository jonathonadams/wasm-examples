export function calcFib(limit: number): number[] {
	return getNextFib([], 0, limit);
}

// function getNextFib(fibSequence: number[], curNum: number, limit: number): number[] {
// 	const nextFib = fib(curNum);
// 	if (fibSequence.length > limit) return fibSequence;
// 	if (fibSequence.length === 0) fibSequence.push(nextFib);
// 	if (nextFib !== fibSequence[fibSequence.length - 1]) fibSequence.push(nextFib);

// 	// fibSequence.push(nextFib);

// 	// curNum = nextFib;

// 	return getNextFib(fibSequence, ++curNum, limit);
// }

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

export function array(arr: number[]): number {
	return 1;
}
