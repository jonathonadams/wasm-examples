import normal, { type Gaussian } from 'gaussian';

const LOWER_PRICE = 500000;
const UPPER_PRICE = 2000000;

const standardDeviations = 4;

const upperVariance = 0.1;
const lowerVariance = 0.01;

export interface Property {
	n: Gaussian;
	median: number;
	xs: number[];
	ys: number[];
	valueDomain: [number, number];
	yDomain: [number, number];
}

function createRandomMedian() {
	return Math.floor(Math.random() * (UPPER_PRICE - LOWER_PRICE) + LOWER_PRICE);
}

function createSigma(mu: number): number {
	return mu * (Math.random() * (upperVariance - lowerVariance) + lowerVariance);
}

export const line = function (a: number, b: number, s: number) {
	const d = (b - a) / (s - 1);
	return Array.from(new Array(s), (_, i) => a + i * d);
};

export function generationProperties(x: number, sampling: number) {
	const properties: Property[] = [];

	for (let i = 0; i < x; i++) {
		const mu = createRandomMedian();
		const sigma = createSigma(mu);

		const n = normal(mu, sigma ** 2);
		const valueDomain = [mu - sigma * standardDeviations, mu + sigma * standardDeviations] as [
			number,
			number
		];

		const xs = line(valueDomain[0], valueDomain[1], sampling);

		const yDomain = [0, n.pdf(mu)] as [number, number];

		const ys = xs.map((x) => n.pdf(x));
		properties.push({ median: mu, xs, ys, yDomain, valueDomain, n });
	}

	return properties;
}
