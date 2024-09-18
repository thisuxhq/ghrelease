<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getReleaseNotes } from '$lib/utils/github';
	import { repositories } from '$lib/stores/repositories';
	import { marked } from 'marked';
	import { clsx } from '$lib';

	let releaseNotes = '';
	let summarisedReleaseNotes = '';
	let loading = true;

	$: owner = $page.params.owner;
	$: repo = $page.params.repo;
	$: repository = $repositories.find((r) => r.owner === owner && r.repo === repo);

	onMount(async () => {
		if (repository) {
			releaseNotes = await getReleaseNotes(owner, repo, repository.latestRelease);

			const res = await fetch('/api/ai/summarise', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text: releaseNotes
				})
			});

			const data = await res.text();
			summarisedReleaseNotes = data;
		}

		loading = false;
	});
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-3xl font-bold">Release Summary: {owner}/{repo}</h1>
	{#if loading}
		<p>Loading...</p>
	{:else if repository}
		<div class="rounded bg-white p-4 shadow">
			<div
				class={clsx(
					'prose prose-lg my-3 w-full items-center justify-center dark:prose-invert  prose-p:font-medium prose-a:underline',
					'prose-a:bg-red-50 prose-a:decoration-red-500 dark:prose-a:bg-red-950 dark:prose-a:underline dark:prose-a:decoration-red-400',
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
	<a
		href="/"
		class="mt-4 inline-block rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
	>
		Back to Watchlist
	</a>
</div>
