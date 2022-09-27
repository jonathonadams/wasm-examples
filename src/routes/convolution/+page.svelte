<script lang="ts">
	import { convolve } from '$lib/convolution';
	import { convolve as convolveAssembly } from '$lib/wasm/examples.js';
	import { formatPerformance, perf } from '$lib/utils';

	import { generationProperties, type Property } from './properties';
	import Distribution from './distribution.svelte';

	const con = perf(convolve);
	const wasmCon = perf(convolveAssembly);

	let time = 0;
	let result: number[] = [];

	let wasmTime = 0;
	let wasmResult: number[] = [];

	let numberOfProps = 100;
	let selectedProp: Property;
	let vectors: number[][] = [];

	const createProperties = () => {
		const properties = generationProperties(numberOfProps);
		selectedProp = properties[0];
		vectors = properties.map((p) => p.ys);
	};

	// const vecA = [2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2];

	// const createVectors = (length: number) => {
	// 	const vectors: number[][] = [];
	// 	for (let i = 0; i < length; i++) {
	// 		vectors.push([...vecA]);
	// 	}
	// 	return vectors;
	// };

	// $: vectors = createVectors(vectorLength);

	const runJs = () => {
		[result, time] = con(vectors);
	};

	const runWasm = () => {
		[wasmResult, wasmTime] = wasmCon(vectors);
	};
</script>

<div class="flex flex-col gap-4">
	<div>
		<label for="props">Number of properties: {numberOfProps}</label>
		<input id="props" type="range" min="1" max="1000" bind:value={numberOfProps} />
		<button type="button" class="btn" on:click={createProperties}>Generate Properties</button>
	</div>

	<div class="flex flex-row gap-4 items-center">
		<button type="button" class="btn" on:click={runJs}>Execute JavaScript</button>
		<p>{formatPerformance(time)}</p>
	</div>

	<div class="flex flex-row gap-4 items-center">
		<button type="button" class="btn" on:click={runWasm}>Execute WASM</button>
		<p>{formatPerformance(wasmTime)}</p>
	</div>
</div>

{#if selectedProp}
	<Distribution prop={selectedProp} />
{/if}
