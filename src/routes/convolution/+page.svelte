<script lang="ts">
	import { convolve } from '$lib/examples';
	import { convolve as convolveAssembly } from '$lib/wasm/examples.js';
	import { formatPerformance, perf } from '$lib/utils';
	import { generationProperties } from './properties';
	import type { Property } from './properties';
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

	// const createVectors = (length: number) => {
	// const vecA = [2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2];
	// 	const len = length * 10;
	// 	const vectors: number[][] = [];
	// 	for (let i = 0; i < len; i++) {
	// 		vectors.push([...vecA]);
	// 	}
	// 	return vectors;
	// };

	// $: vectors = createVectors(numberOfProps);

	const runJs = () => {
		[result, time] = con(vectors);
	};

	const runWasm = () => {
		[wasmResult, wasmTime] = wasmCon(vectors);
	};
</script>

<div class="flex flex-col gap-4">
	<div class="flex align-middle">
		<input
			class="w-48 mr-4"
			id="props"
			type="range"
			min="1"
			max="1000"
			bind:value={numberOfProps}
		/>
		<label for="props">Number of properties: {numberOfProps}</label>
	</div>
	<button type="button" class="btn w-48" on:click={createProperties}>Generate Properties</button>

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
