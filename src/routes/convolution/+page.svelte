<script lang="ts">
	import { convolve } from '$lib/examples';
	import { convolve as convolveAssembly } from '$lib/wasm/examples.js';
	import { formatPerformance, perf } from '$lib/utils';
	import { generationProperties } from '$lib/properties';
	import type { Property } from '$lib/properties';
	import { currencyFormatter } from '$lib/formatting';
	import Distribution from './distribution.svelte';

	const con = perf(convolve);
	const wasmCon = perf(convolveAssembly);

	let sampling = 201;

	let time = 0;
	let result: number[] = [];

	let wasmTime = 0;
	let wasmResult: number[] = [];

	let numberOfProps = 100;
	let selectedProp: Property | null = null;

	let properties: Property[] = [];
	let vectors: number[][] = [];

	const createProperties = () => {
		properties = generationProperties(numberOfProps, sampling);
		selectedProp = null;
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
	<div class="flex align-middle">
		<input class="w-48 mr-4" id="props" type="range" min="1" max="500" bind:value={sampling} />
		<label for="props">Sampling Rate: {sampling}</label>
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

<div class="max-w-5xl">
	{#if selectedProp}
		<Distribution prop={selectedProp} />
	{/if}

	<div class="h-[40rem] overflow-y-auto mt-8">
		<div class="px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col">
				<div class="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
					<div class="inline-block min-w-full py-2 align-middle">
						<div class="shadow-sm ring-1 ring-black ring-opacity-5">
							<table class="min-w-full border-separate" style="border-spacing: 0">
								<thead class="bg-gray-50">
									<tr>
										<th
											scope="col"
											class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
											>Median</th
										>
										<th
											scope="col"
											class="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
											>Standard Deviation</th
										>
										<th
											scope="col"
											class="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
											>Low</th
										>
										<th
											scope="col"
											class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
											>High</th
										>
									</tr>
								</thead>
								<tbody class="bg-white">
									{#each properties as property}
										<tr class="cursor-pointer" on:click={() => (selectedProp = property)}>
											<td
												class="whitespace-nowrap border-b border-gray-200 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
												>{currencyFormatter(property.median)}</td
											>
											<td
												class="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
												>{currencyFormatter(property.n.standardDeviation)}</td
											>
											<td
												class="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500 hidden lg:table-cell"
												>{currencyFormatter(property.n.ppf(0.15))}</td
											>
											<td
												class="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500"
												>{currencyFormatter(property.n.ppf(0.85))}</td
											>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
