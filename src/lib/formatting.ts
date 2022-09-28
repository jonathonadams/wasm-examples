const audFormatterMill = new Intl.NumberFormat('en-AU', {
	style: 'currency',
	currency: 'AUD',
	notation: 'compact',
	compactDisplay: 'short',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});
const audFormatterThousand = new Intl.NumberFormat('en-AU', {
	style: 'currency',
	currency: 'AUD',
	notation: 'compact',
	compactDisplay: 'short'
});

export const currencyFormatter = (x: number) =>
	x >= 1000000 ? audFormatterMill.format(x) : audFormatterThousand.format(x);
