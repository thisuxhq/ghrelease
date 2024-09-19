<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getReleaseNotes } from '$lib/utils/github';
	import { repositories } from '$lib/stores/repositories';
	import { marked } from 'marked';
	import { clsx } from '$lib';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { fade } from 'svelte/transition';

	type ReleaseNotes = {
		notes: string;
		date: string;
		owner?: string;
		repo?: string;
	};

	let releaseNotes: ReleaseNotes = { notes: '', date: '' };
	let summarisedReleaseNotes = '';
	let loading = true;

	$: owner = $page.params.owner;
	$: repo = $page.params.repo;
	$: repository = $repositories.find((r) => r.owner === owner && r.repo === repo);

	onMount(async () => {
		if (repository) {
			releaseNotes = await getReleaseNotes(owner, repo, repository.latestRelease);
			const cacheKey = `${owner}/${repo}/summary/${repository.latestRelease}`;

			// Check if summary is already cached
			const cachedSummary = localStorage.getItem(cacheKey);
			if (cachedSummary) {
				summarisedReleaseNotes = cachedSummary; // Use cached summary
			} else {
				const res = await fetch('/api/ai/summarise', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(releaseNotes)
				});

				const data = await res.text();
				summarisedReleaseNotes = data;

				// Store the summary in local storage
				localStorage.setItem(cacheKey, data);
			}
		}

		loading = false;
	});
</script>

<div class="container mx-auto max-w-2xl p-4">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-4xl font-medium tracking-tight">Release Highlights of {owner}/{repo}</h1>
		<a
			href="/"
			class="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
		>
			<svg
				class="mr-2 h-5 w-5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				></path>
			</svg>
			Back
		</a>
	</div>

	{#if loading}
		<div class="flex items-center space-x-4" transition:fade>
			<Skeleton class="h-12 w-12 rounded-full" />
			<div class="space-y-2">
				<Skeleton class="h-4 w-[250px]" />
				<Skeleton class="h-4 w-[200px]" />
			</div>
		</div>
	{:else if repository}
		<div class="w-full rounded-3xl bg-white p-6">
			<div
				class={clsx(
					'prose prose-lg my-3 w-full items-center justify-center dark:prose-invert  prose-p:font-medium prose-a:underline',
					'prose-a:bg-yellow-50 prose-a:decoration-yellow-500 dark:prose-a:bg-yellow-950 dark:prose-a:underline dark:prose-a:decoration-yellow-400',
					'prose-h1:font-medium prose-h2:font-medium prose-h3:font-medium prose-h4:font-medium prose-h5:font-medium prose-h6:font-medium',
					'prose-h1:tracking-tight prose-h2:tracking-tight prose-h3:tracking-tight prose-h4:tracking-tight prose-h5:tracking-tight prose-h6:tracking-tight',
					'prose-ol:font-medium prose-ul:font-medium prose-li:font-medium',
					'prose-ol:space-y-3 prose-ul:space-y-3 prose-li:space-y-3'
				)}
			>
				{@html marked(summarisedReleaseNotes)}
			</div>
		</div>
	{:else}
		<p>Repository not found in watchlist.</p>
	{/if}
</div>
