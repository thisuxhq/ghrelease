<script lang="ts">
	import type { Repository } from '$lib/stores/repositories';
	import { createEventDispatcher } from 'svelte';
	import { Star, GitFork, GitCommit } from 'lucide-svelte';

	export let repositories: Repository[];

	const dispatch = createEventDispatcher();

	function handleRemove(owner: string, repo: string) {
		dispatch('remove', { owner, repo });
	}

	function formatNumber(num: number): string {
		return num > 999 ? (num / 1000).toFixed(1) + 'k' : num.toString();
	}
</script>

<div class="mt-4">
	<h2 class="mb-2 text-xl font-semibold">Watched Repositories</h2>
	{#if repositories.length === 0}
		<p>No repositories added yet.</p>
	{:else}
		<ul class="space-y-4">
			{#each repositories as { owner, repo, latestRelease, avatarUrl, stars, forks, recentCommits }}
				<li class="flex items-center justify-between rounded-full bg-white p-4">
					<div class="flex items-center">
						<img src={avatarUrl} alt={`${owner}'s avatar`} class="mr-4 h-12 w-12 rounded-full" />
						<div class="flex-grow">
							<div class="flex items-center justify-between">
								<a
									href={`https://github.com/${owner}/${repo}`}
									target="_blank"
									rel="noopener noreferrer"
									class="text-lg font-medium hover:underline"
								>
									{owner}/{repo}
								</a>
								<div class="flex space-x-4">
									<span class="flex items-center text-gray-600" title="Stars">
										<Star class="mr-1 h-4 w-4" />
										{formatNumber(stars)}
									</span>
									<span class="flex items-center text-gray-600" title="Forks">
										<GitFork class="mr-1 h-4 w-4" />
										{formatNumber(forks)}
									</span>
									<span class="flex items-center text-gray-600" title="Recent Commits">
										<GitCommit class="mr-1 h-4 w-4" />
										{recentCommits}
									</span>
								</div>
							</div>
							<div class="mt-2">
								<span class="text-sm text-gray-600">Latest Release: {latestRelease || 'N/A'}</span>
							</div>
						</div>
					</div>
					<div class="mt-4 flex justify-end">
						<a href="/release/{owner}/{repo}" class="mr-4 text-blue-500 hover:text-blue-700"
							>View Release</a
						>
						<button
							on:click={() => handleRemove(owner, repo)}
							class="text-red-500 hover:text-red-700"
						>
							Remove
						</button>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
