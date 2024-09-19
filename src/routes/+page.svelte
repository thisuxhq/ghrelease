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
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

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

<svelte:head>
	<title>GitHub Release Tracker - AI-Powered Repository Monitoring</title>
	<meta
		name="description"
		content="Track your favorite GitHub repositories with our AI-powered release tracker. Add repository URLs to receive instant summaries of the latest releases."
	/>
	<meta
		name="keywords"
		content="GitHub, release tracker, AI, repository monitoring, latest releases, personal access token"
	/>
	<meta name="author" content="ThisUX – Desing led product studio" />
	<meta property="og:title" content="GitHub Release Tracker - AI-Powered Monitoring" />
	<meta
		property="og:description"
		content="Easily monitor your favorite GitHub repositories and get AI-generated summaries of the latest releases."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://ghreleases.thisux.com" />
	<meta property="og:image" content="https://ghreleases.thisux.com/image.png" />

	<!-- Twitter Card Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="GitHub Release Tracker - AI-Powered Repository Monitoring" />
	<meta
		name="twitter:description"
		content="Track your favorite GitHub repositories with our AI-powered release tracker. Get instant summaries of the latest releases."
	/>
	<meta name="twitter:image" content="https://ghreleases.thisux.com/image.png" />
</svelte:head>

<main class="container mx-auto min-h-screen w-full max-w-2xl p-6">
	<h1
		class="mb-6 text-start text-6xl font-medium tracking-tight"
		style="background-clip: text; -webkit-background-clip: text; color: transparent; background-image: linear-gradient(to right, black, gray);"
	>
		Github release tracker
	</h1>

	{#if !isTokenSet}
		<div class="mb-6 flex flex-col gap-3 rounded-3xl bg-white p-6">
			<h2 class="mb-4 text-3xl font-semibold">Set Your GitHub Token</h2>
			<Input
				type="password"
				bind:value={githubToken}
				placeholder="Enter your GitHub Personal Access Token"
				class="mr-2 w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<Button on:click={handleSetToken} class="w-full rounded-full" variant="default"
				>Submit Token</Button
			>
			<p class="mt-3 text-sm text-gray-600">
				To track public repo releases, follow these steps to get a fine-grained personal access
				token:
			</p>
			<ol class="list-disc pl-5">
				<li>
					Go to <a
						href="https://github.com/settings/tokens"
						target="_blank"
						class="text-blue-500 hover:underline">GitHub Settings</a
					>.
				</li>
				<li>Click on "Developer settings" in the left sidebar.</li>
				<li>Select "Personal access tokens" and then "Generate new token".</li>
				<li>Choose "repo" under "Select scopes" to allow access to public repositories.</li>
				<li>Click "Generate token" and copy the token.</li>
			</ol>
			<p class="mt-3 text-sm text-gray-600">
				Note: Your tokens are saved on your browser only and are not stored on our servers.
			</p>
		</div>
	{:else}
		<div class="mb-6">
			<AddRepositoryUrl on:submit={handleUrlSubmit} />
		</div>

		{#if isLoading}
			<div class="flex items-center space-x-4" transition:fade>
				<Skeleton class="h-12 w-12 rounded-full" />
				<div class="space-y-2">
					<Skeleton class="h-4 w-[250px]" />
					<Skeleton class="h-4 w-[200px]" />
				</div>
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
