<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getReleaseNotes } from '$lib/utils/github';
	import { repositories } from '$lib/stores/repositories';

	let releaseNotes = '';
	let loading = true;

	$: owner = $page.params.owner;
	$: repo = $page.params.repo;
	$: repository = $repositories.find((r) => r.owner === owner && r.repo === repo);

	onMount(async () => {
		if (repository) {
			releaseNotes = await getReleaseNotes(owner, repo, repository.latestRelease);
		}
		loading = false;
	});
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-3xl font-bold">Release Summary: {owner}/{repo}</h1>
	{#if loading}
		<p>Loading...</p>
	{:else if repository}
		<h2 class="mb-2 text-2xl font-semibold">Latest Release: {repository.latestRelease}</h2>
		<div class="rounded bg-white p-4 shadow">
			<h3 class="mb-2 text-xl font-medium">Release Notes:</h3>
			<pre class="whitespace-pre-wrap">{releaseNotes}</pre>
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
