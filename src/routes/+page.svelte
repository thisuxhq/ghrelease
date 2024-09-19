<script lang="ts">
	import { onMount } from 'svelte';
	import {
		repositories,
		addRepository,
		removeRepository,
		updateRepositoryDetails
	} from '$lib/stores/repositories';
	import { initializeGitHubClient } from '$lib/utils/github';
	import AddRepositoryModal from '$lib/components/add-repository-modal.svelte';
	import AddRepositoryUrl from '$lib/components/add-repository-url.svelte';
	import RepositoryList from '$lib/components/repository-list.svelte';
	import { fade, scale } from 'svelte/transition';

	let showAddModal = false;
	let showUrlModal = false;
	let urlToAdd = '';
	let isLoading = false;
	let githubToken = '';
	let isTokenSet = false;

	function handleSetToken() {
		if (githubToken) {
			initializeGitHubClient(githubToken);
			isTokenSet = true;
			localStorage.setItem('githubToken', githubToken);
		}
	}

	onMount(async () => {
		const storedToken = localStorage.getItem('githubToken');
		if (storedToken) {
			githubToken = storedToken;
			handleSetToken();
		}

		if (isTokenSet) {
			isLoading = true;
			await Promise.all(
				$repositories.map((repo) => updateRepositoryDetails(repo.owner, repo.repo))
			);
			isLoading = false;
		}
	});

	async function handleAddRepository(event: CustomEvent<{ owner: string; repo: string }>) {
		if (!isTokenSet) return;
		isLoading = true;
		await addRepository(event.detail.owner, event.detail.repo);
		showAddModal = false;
		isLoading = false;
	}

	function handleRemoveRepository(event: CustomEvent<{ owner: string; repo: string }>) {
		removeRepository(event.detail.owner, event.detail.repo);
	}

	function handleUrlSubmit(event: CustomEvent<{ url: string }>) {
		urlToAdd = event.detail.url;
		showUrlModal = true;
	}

	async function handleUrlConfirm(event: CustomEvent<{ owner: string; repo: string }>) {
		if (!isTokenSet) return;
		isLoading = true;
		await addRepository(event.detail.owner, event.detail.repo);
		showUrlModal = false;
		urlToAdd = '';
		isLoading = false;
	}

	let loadingMessage = 'Loading repositories...';
</script>

<main class="container mx-auto p-6  min-h-screen w-full">
	<h1 class="mb-6 text-5xl font-medium text-center text-gray-900 tracking-tight">GitHub release tracker</h1>

	{#if !isTokenSet}
		<div class="mb-6 p-6 border rounded-lg shadow-lg bg-white">
			<h2 class="mb-4 text-3xl font-semibold">Set Your GitHub Token</h2>
			<input
				type="password"
				bind:value={githubToken}
				placeholder="Enter your GitHub Personal Access Token"
				class="mr-2 rounded border p-3 w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<button
				on:click={handleSetToken}
				class="mt-4 w-full rounded bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700 transition duration-300"
			>
				Submit Token
			</button>
			<p class="mt-3 text-sm text-gray-600">
				To track public repo releases, you'll need a fine-grained personal access token. 
				<a href="https://github.com/settings/tokens" target="_blank" class="text-blue-500 hover:underline">Learn more</a>.
			</p>
		</div>
	{:else}
		<div class="mb-6">
			<AddRepositoryUrl on:submit={handleUrlSubmit} />
		</div>

		<button
			class="mb-6 rounded bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700 transition duration-300"
			on:click={() => (showAddModal = true)}
		>
			Add Repository Manually
		</button>

		{#if isLoading}
			<div class="py-4 text-center" transition:fade>
				<p class="text-lg">{loadingMessage}</p>
				<div class="loader"></div>
			</div>
		{:else}
			<RepositoryList repositories={$repositories} on:remove={handleRemoveRepository} />
		{/if}

		{#if showAddModal}
			<div transition:scale>
				<AddRepositoryModal on:add={handleAddRepository} on:close={() => (showAddModal = false)} />
			</div>
		{/if}

		{#if showUrlModal}
			<div transition:scale>
				<AddRepositoryModal
					on:add={handleUrlConfirm}
					on:close={() => (showUrlModal = false)}
					{urlToAdd}
				/>
			</div>
		{/if}
	{/if}
</main>

<style>
	
	.loader {
		border: 8px solid #e2e8f0; /* Light gray */
		border-top: 8px solid #3182ce; /* Blue */
		border-radius: 50%;
		width: 50px;
		height: 50px;
		animation: spin 1s linear infinite;
		margin: 0 auto;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
</style>
