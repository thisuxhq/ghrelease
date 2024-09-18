<script lang="ts">
	import { onMount } from 'svelte';
	import {
		repositories,
		addRepository,
		removeRepository,
		updateLatestRelease,
		updateRepositoryDetails
	} from '$lib/stores/repositories';
	import { getLatestRelease } from '$lib/utils/github';
	import AddRepositoryModal from '$lib/components/add-repository-modal.svelte';
	import AddRepositoryUrl from '$lib/components/add-repository-url.svelte';
	import RepositoryList from '$lib/components/repository-list.svelte';

	let showAddModal = false;
	let showUrlModal = false;
	let urlToAdd = '';

	onMount(async () => {
		$repositories.forEach(async (repo) => {
			const latestRelease = await getLatestRelease(repo.owner, repo.repo);
			updateLatestRelease(repo.owner, repo.repo, latestRelease);
			updateRepositoryDetails(repo.owner, repo.repo);
		});
	});

	async function handleAddRepository(event: CustomEvent<{ owner: string; repo: string }>) {
		await addRepository(event.detail.owner, event.detail.repo);
		showAddModal = false;
	}

	function handleRemoveRepository(event: CustomEvent<{ owner: string; repo: string }>) {
		removeRepository(event.detail.owner, event.detail.repo);
	}

	function handleUrlSubmit(event: CustomEvent<{ url: string }>) {
		urlToAdd = event.detail.url;
		showUrlModal = true;
	}

	async function handleUrlConfirm(event: CustomEvent<{ owner: string; repo: string }>) {
		await addRepository(event.detail.owner, event.detail.repo);
		showUrlModal = false;
		urlToAdd = '';
	}
</script>

<main class="container mx-auto p-4">
	<h1 class="mb-4 text-3xl font-bold">GitHub Release Tracker</h1>

	<div class="mb-4">
		<AddRepositoryUrl on:submit={handleUrlSubmit} />
	</div>

	<button
		class="mb-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
		on:click={() => (showAddModal = true)}
	>
		Add Repository Manually
	</button>

	<RepositoryList repositories={$repositories} on:remove={handleRemoveRepository} />

	{#if showAddModal}
		<AddRepositoryModal on:add={handleAddRepository} on:close={() => (showAddModal = false)} />
	{/if}

	{#if showUrlModal}
		<AddRepositoryModal
			on:add={handleUrlConfirm}
			on:close={() => (showUrlModal = false)}
			{urlToAdd}
		/>
	{/if}
</main>
