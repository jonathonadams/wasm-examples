<script lang="ts">
	import { formatPerformance } from '$lib/utils';
	import { calcFib } from '$lib/examples';
	import { calcFib as wasmCalcFib } from '$lib/wasm/examples.js';
	import { perf } from '$lib/utils';

	const fib = perf(calcFib);
	const wasmFib = perf(wasmCalcFib);

	let time = 0;
	let result: number[] = [];

	let wasmTime = 0;
	let wasmResult: number[] = [];

	let maxValues = 30;

	const runJs = () => {
		[result, time] = fib(maxValues);
	};

	const runWasm = () => {
		[wasmResult, wasmTime] = wasmFib(maxValues);
	};
</script>

<div class="flex flex-col gap-4">
	<div>
		<label for="fib">Values: {maxValues}</label>
		<input id="fib" type="range" min="1" max="50" bind:value={maxValues} />
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

	<pre><code>{wasmResult}</code></pre>
</div>
