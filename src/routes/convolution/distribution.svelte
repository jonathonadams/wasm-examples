<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { Gaussian } from 'gaussian';
	import { correction$ } from '$lib/media_queries';
	import { currencyFormatter } from './formatting';
	import type { Property } from './properties';

	import {
		scaleLinear,
		path as pathD3,
		type ScaleLinear,
		curveLinear,
		interpolateNumber
	} from 'd3';

	let confidence: number = 0.7;

	const DEFAULT_CHART_HEIGHT = 300;
	const DEFAULT_DIMENSIONS = {
		width: 800,
		height: DEFAULT_CHART_HEIGHT,
		margin: { top: 40, right: 30, bottom: 30, left: 60 }
	};

	let dimensions: Dimensions;
	$: dimensions = DEFAULT_DIMENSIONS;

	// Used to set the viewBox and clipPath
	$: ({ width, height, margin } = dimensions);
	$: plotWidth = width - margin.left - margin.right;
	$: plotHeight = height - margin.top - margin.bottom;

	// correction to account for pixel density on low res screen
	$: correction = $correction$;

	let container: HTMLDivElement;

	export let prop: Property;

	$: ({ n, valueDomain, yDomain, xs } = prop);

	type Dimensions = {
		width: number;
		height: number;
		margin: {
			top: number;
			bottom: number;
			left: number;
			right: number;
		};
	};

	$: xRange = [height - margin.bottom, margin.top];

	type Scale = ScaleLinear<number, number, never>;

	$: yScale = scaleLinear().domain(yDomain).range(xRange).nice().interpolate(interpolateNumber);
	$: xScale = scaleLinear()
		.domain(valueDomain)
		.range([margin.left, width - margin.right])
		.nice()
		.interpolate(interpolateNumber);

	$: [y1, y2] = yScale.range();

	$: d = (1 - confidence) / 2;
	$: [l, h] = [n.ppf(d), n.ppf(1 - d)];

	const createPath = (xScale: Scale, yScale: Scale, xs: number[], g: Gaussian) => {
		const p = pathD3();
		const curve = curveLinear(p);

		let x: number, y: number, xpx: number, ypx: number;
		for (let i = 0; i <= xs.length - 1; i++) {
			if (i === 0) curve.lineStart();
			x = xs[i];
			y = g.pdf(x);
			xpx = xScale(x);
			ypx = yScale(y);

			curve.point(xpx, ypx);
		}

		curve.lineEnd();

		return p.toString();
	};

	$: path = createPath(xScale, yScale, xs, n);

	// #################
	// Plot Area
	// #################

	$: xm = xScale(n.mean);
	// $: xm =
	// 	selectedDistribution === Distribution.pdf
	// 		? xScale(multiNormal.amean)
	// 		: selectedDistribution === Distribution.cdf
	// 		? xScale(multiNormal.ppf(0.5))
	// 		: xScale(0.5);

	// #################
	// The Legend
	// #################

	// The vertical spacing between each item in the legend
	const legendSpacing = 25;

	// total legend height
	$: legendHeight = legendSpacing * 1 + 8; /* bottom spacing */

	// #################
	//  Tool Tip
	// #################

	const tooltipWidth = 110;
	const tooltipOffset = 5;
	const tooltipHeight = 30;

	let tooltipVisible = false;
	let px = 0;
	let tx = 0;
	let ty = 0;

	const onResizeChange = ([chart]: ResizeObserverEntry[]) => {
		// We are only listening to one element, the chart
		if (chart.contentBoxSize) {
			const contentBoxSize: ResizeObserverSize = Array.isArray(chart.contentBoxSize)
				? chart.contentBoxSize[0]
				: chart.contentBoxSize;

			let width = contentBoxSize.inlineSize;
			let height = contentBoxSize.blockSize;
			dimensions = { ...dimensions, width, height };
		} else {
			let width = chart.contentRect.width;
			let height = chart.contentRect.height;
			dimensions = { ...dimensions, width, height };
		}
	};

	// width will be updated via ResizeObserver on resize
	let resize: ResizeObserver;

	onMount(() => {
		resize = new ResizeObserver(onResizeChange);
		resize.observe(container);
	});

	onDestroy(() => {
		if (resize) resize.disconnect();
	});
</script>

<div bind:this={container}>
	<svg
		class="bg-plot-area select-none"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0, 0, {width}, {height}"
	>
		<defs>
			<!-- clip path for the plot area -->
			<clipPath id="clip">
				<rect x={margin.left} width={plotWidth} y={margin.top} height={plotHeight} />
			</clipPath>
			<!-- box shadow for the legend -->
			<filter id="shadow" height="130%">
				<!-- stdDeviation is how much to blur -->
				<feGaussianBlur in="SourceAlpha" stdDeviation="3" />
				<!-- how much to offset -->
				<feOffset dx="1" dy="1" result="offsetblur" />
				<feComponentTransfer>
					<!-- slope is the opacity of the shadow -->
					<feFuncA type="linear" slope="0.1" />
				</feComponentTransfer>
				<feMerge>
					<!-- this contains the offset blurred image -->
					<feMergeNode />
					<!-- this contains the element that the filter is applied to -->
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>
		</defs>

		<!-- Y - Axis 
		<g transform="translate({margin.left},0)">
			{#each yScale.ticks() as y, i (y)}
				<g transform="translate(0, {yScale(y) + correction})">
					<line x1="-6" />
					<text class="text-xs" x="-50" dy="-3">{densityFormatter(y)}</text>
					{#if i === 0 || y === 1}
						<line x2={plotWidth} />
					{/if}
				</g>
			{/each}
		</g> -->

		<!-- Bottom Axis -->
		<g class="axis-bottom" transform="translate(0,{height - margin.bottom})">
			<!-- left border of chart -->
			<g transform="translate({margin.left + correction},0)">
				<line y2="-{plotHeight}" />
			</g>
			{#each xScale.ticks() as x (x)}
				<g transform="translate({xScale(x) + correction},0)">
					<line y2="6" />
					<text class="text text-xs" y="10" dy="0.71em">{currencyFormatter(x)}</text>
				</g>
			{/each}
			<!-- right border of chart -->
			<g transform="translate({width - margin.right + correction},0)">
				<line y2="-{plotHeight}" />
			</g>
		</g>

		<!-- Plot Area -->
		<g class="plot-area" clip-path="url(#clip)">
			<rect
				class="stroke-none"
				x={margin.left}
				width={plotWidth}
				y={margin.top}
				height={plotHeight}
			/>

			<!-- Path -->
			<g>
				<path class="stroke-3" d={path} />
			</g>

			<!-- The measure lines -->
			<g class="measure stroke-current">
				<line x1={xScale(l)} x2={xScale(l)} {y1} y2={yScale(n.pdf(l))} />
				<line x1={xScale(h)} x2={xScale(h)} {y1} y2={yScale(n.pdf(h))} />
				<line x1={xm} x2={xm} {y1} y2={yScale(n.pdf(n.ppf(0.5)))} />

				{#if tooltipVisible}
					<line x1={px} x2={px} {y1} {y2} />
				{/if}
			</g>
		</g>
	</svg>
</div>

<style>
	.fill-path {
		fill: url('#gradient');
	}
	.stop1,
	.stop5 {
		stop-color: red;
		/* stop-opacity: 1; */
	}
	.stop2,
	.stop4 {
		stop-color: yellow;
		stop-opacity: 0.7;
	}
	.stop3 {
		stop-color: green;
		/* stop-opacity: 1; */
	}

	.plot-area {
		pointer-events: all;
	}

	.axis-bottom {
		text-anchor: middle;
	}

	.measure {
		stroke-dasharray: 4, 6;
	}
</style>
