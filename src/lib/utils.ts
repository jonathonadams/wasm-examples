type Callable<T, K> = (...arg: K[]) => T;

export const perf = <T, K>(callable: Callable<T, K>) => {
	return (...arg: K[]) => {
		const start = performance.now();
		const re: T = callable(...arg);
		const end = performance.now();
		return [re, end - start] as const;
	};
};

export function formatPerformance(ms: number): string {
	return `${ms.toFixed(4)}ms (${(ms / 1000).toFixed(2)}s)`;
}
