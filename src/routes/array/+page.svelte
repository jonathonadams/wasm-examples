<script lang="ts">
	import { array } from '$lib/examples';
	import { array as assemblyArray } from '$lib/wasm/examples.js';
	import { formatPerformance, perf } from '$lib/utils';

	const arr = perf(array);
	const wasmArr = perf(assemblyArray);

	let time = 0;
	let result: number = 0;

	let wasmTime = 0;
	let wasmResult: number = 0;

	const createVectors = (length: number) => {
		const array: number[] = [];
		for (let i = 0; i < length; i++) {
			array.push(1);
		}
		return array;
	};

	let range = 10;
	$: arrayLength = range * 1000;

	$: arrayArg = createVectors(arrayLength);

	const runJs = () => {
		[result, time] = arr(arrayArg);
	};

	const runWasm = () => {
		[wasmResult, wasmTime] = wasmArr(arrayArg);
	};
</script>

<div class="flex flex-col gap-4">
	<div>
		<label for="length">Array length: {arrayLength}</label>
		<input id="length" type="range" min="1" max="10000" bind:value={range} />
	</div>

	<div class="flex flex-row gap-4 items-center">
		<button type="button" class="btn" on:click={runJs}>Execute JavaScript</button>
		<p>{formatPerformance(time)}</p>
	</div>

	<div class="flex flex-row gap-4 items-center">
		<button type="button" class="btn" on:click={runWasm}>Execute WASM</button>
		<p>{formatPerformance(wasmTime)}</p>
	</div>

	<div>
		<img src="/images/array.svg" alt="array" />
	</div>
</div>
