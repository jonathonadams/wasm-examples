<script lang="ts">
	import { convolve } from '$lib/convolution';
	import { convolve as convolveAssembly } from '$lib/wasm/examples.js';
	import { perf } from '$lib/utils';

	const con = perf<number[]>(convolve);
	const conAssembly = perf<number[]>(convolveAssembly);

	let time = 0;
	let answer = [];

	let assemblyTime = 0;
	let assemblyAnswer = [];

	const vecA = [2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2];

	const createVectors = (length: number) => {
		const vectors: number[][] = [];
		for (let i = 0; i < length; i++) {
			vectors.push([...vecA]);
		}
		return vectors;
	};

	let vectorLength = 2000;

	$: vectors = createVectors(vectorLength);

	const clickHandler = () => {
		[assemblyAnswer, assemblyTime] = conAssembly(vectors);
		[answer, time] = con(vectors);
	};
</script>

<h1 class="text-3xl font-bold underline">Convolutions</h1>

<label for="convolutions">Number of convolutions</label>
<input id="convolutions" type="number" bind:value={vectorLength} />

<button type="button" on:click={clickHandler}>Convolution</button>

<p>Execution time (milliseconds)</p>
<p>JS: {time}</p>
<p>Assembly: {assemblyTime}</p>
