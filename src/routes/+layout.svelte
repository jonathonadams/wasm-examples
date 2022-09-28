<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	const links = [
		{ href: '/', name: 'Math' },
		{ href: '/array', name: 'Array' },
		{ href: '/fibonacci', name: 'Fibonacci' },
		{ href: '/convolution', name: 'Convolution' }
	];

	$: ({ pathname } = $page.url);
</script>

<header>
	<nav class="bg-white shadow">
		<div class="px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 justify-between">
				<div class="flex">
					<div class="flex ml-2 space-x-8">
						{#each links as { name, href }}
							<a
								{href}
								class="inline-flex items-center border-b-2  px-1 pt-1 text-sm font-medium {pathname ===
								href
									? 'border-indigo-500 text-gray-900'
									: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
								>{name}</a
							>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</nav>
</header>

<main class="m-4">
	<slot />
</main>
