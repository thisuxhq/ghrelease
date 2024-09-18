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
</script>

<main class="container mx-auto p-4">
	<h1 class="mb-4 text-3xl font-bold">GitHub Release Tracker</h1>

	{#if !isTokenSet}
		<div class="mb-4">
			<h2 class="mb-2 text-xl font-semibold">Set GitHub Token</h2>
			<input
				type="password"
				bind:value={githubToken}
				placeholder="Enter your GitHub Personal Access Token"
				class="mr-2 rounded border p-2"
			/>
			<button
				on:click={handleSetToken}
				class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
			>
				Set Token
			</button>
			<p class="mt-2 text-sm">
				To track public repo releases, you'll need a fine-grained personal access token.
				<br />
				1. Go to
				<a
					href="https://github.com/settings/tokens"
					target="_blank"
					class="text-blue-500 hover:underline">GitHub Tokens</a
				>.
				<br />
				2. Click "Generate new token" and select "Fine-grained" tokens.
				<br />
				3. In the repository access section, select the public repos you want to track.
				<br />
				4. Grant "read" permissions under "Contents" to access releases.
				<br />
				<a
					href="https://docs.github.com/en/rest/releases/releases"
					target="_blank"
					class="text-blue-500 hover:underline"
				>
					Learn more about GitHub release tokens
				</a>.
			</p>
		</div>
	{:else}
		<div class="mb-4">
			<AddRepositoryUrl on:submit={handleUrlSubmit} />
		</div>

		<button
			class="mb-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
			on:click={() => (showAddModal = true)}
		>
			Add Repository Manually
		</button>

		{#if isLoading}
			<div class="py-4 text-center">
				<p>Loading...</p>
			</div>
		{:else}
			<RepositoryList repositories={$repositories} on:remove={handleRemoveRepository} />
		{/if}

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
	{/if}
</main>
