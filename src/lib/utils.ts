export const perf = <T>(callable: Function) => {
	return (...arg: any[]) => {
		const start = performance.now();
		const re: T = callable(...arg);
		const end = performance.now();
		console.log(end - start);
		return [re, end - start] as const;
	};
};
