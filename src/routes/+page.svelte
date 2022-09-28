<script lang="ts">
	import { formatPerformance, perf } from '$lib/utils';
	import { add, subtract, multiply, divide, sum, average } from '$lib/examples';
	import {
		add as wasmAdd,
		subtract as wasmSubtract,
		multiply as wasmMultiply,
		divide as wasmDivide,
		sum as wasmSum,
		average as wasmAverage
	} from '$lib/wasm/examples';

	let vectorLength = 10000;

	function randomIntFromInterval(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	const createVector = (length: number) => {
		const v = [];
		for (let i = 0; i < length; i++) {
			v.push(randomIntFromInterval(-10, 10));
		}

		return v;
	};

	$: vector = createVector(vectorLength);

	const jsTimes = {
		add: 0,
		subtract: 0,
		multiply: 0,
		divide: 0,
		sum: 0,
		average: 0
	};

	const wasmTimes = {
		add: 0,
		subtract: 0,
		multiply: 0,
		divide: 0,
		sum: 0,
		average: 0
	};

	const runJs = () => {
		const a = perf(() => vector.map((x) => add(x, 2)))();
		jsTimes.add = a[1];

		const s = perf(() => vector.map((x) => subtract(x, 2)))();
		jsTimes.subtract = s[1];

		const m = perf(() => vector.map((x) => multiply(x, 2)))();
		jsTimes.multiply = m[1];

		const d = perf(() => vector.map((x) => divide(x, 2)))();
		jsTimes.divide = d[1];

		const su = perf(() => sum(vector))();
		jsTimes.sum = su[1];

		const av = perf(() => average(vector))();
		jsTimes.average = av[1];
	};

	const runWasm = () => {
		const a = perf(() => vector.map((x) => wasmAdd(x, 2)))();
		wasmTimes.add = a[1];

		const s = perf(() => vector.map((x) => wasmSubtract(x, 2)))();
		wasmTimes.subtract = s[1];

		const m = perf(() => vector.map((x) => wasmMultiply(x, 2)))();
		wasmTimes.multiply = m[1];

		const d = perf(() => vector.map((x) => wasmDivide(x, 2)))();
		wasmTimes.divide = d[1];

		const su = perf(() => wasmSum(vector))();
		wasmTimes.sum = su[1];

		const av = perf(() => wasmAverage(vector))();
		wasmTimes.average = av[1];
	};
</script>

<div class="flex flex-col gap-4">
	<div class="flex">
		<input
			class="w-48 mr-4"
			id="len"
			type="range"
			min="10000"
			max="1000000"
			step="1000"
			bind:value={vectorLength}
		/>
		<label for="len">Array length: {vectorLength}</label>
	</div>

	<div class="flex gap-16">
		<div class="w-64 flex flex-col gap-4">
			<button type="button" class="btn" on:click={runJs}>Execute JavaScript</button>
			<p>Add: {formatPerformance(jsTimes.add)}</p>
			<p>Subtract: {formatPerformance(jsTimes.subtract)}</p>
			<p>Multiply: {formatPerformance(jsTimes.multiply)}</p>
			<p>Divide: {formatPerformance(jsTimes.divide)}</p>
			<p>Sum: {formatPerformance(jsTimes.sum)}</p>
			<p>Average: {formatPerformance(jsTimes.add)}</p>
		</div>

		<div class="w-64 flex flex-col gap-4">
			<button type="button" class="btn" on:click={runWasm}>Execute WASM</button>
			<p>Add: {formatPerformance(wasmTimes.add)}</p>
			<p>Subtract: {formatPerformance(wasmTimes.subtract)}</p>
			<p>Multiply: {formatPerformance(wasmTimes.multiply)}</p>
			<p>Divide: {formatPerformance(wasmTimes.divide)}</p>
			<p>Sum: {formatPerformance(wasmTimes.sum)}</p>
			<p>Average: {formatPerformance(wasmTimes.add)}</p>
		</div>
	</div>
	<div class="mt-8">
		<img src="/images/math.svg" alt="math" />
	</div>
</div>
