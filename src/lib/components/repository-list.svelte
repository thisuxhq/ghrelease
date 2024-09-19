<script lang="ts">
	import type { Repository } from '$lib/stores/repositories';
	import { createEventDispatcher } from 'svelte';
	import { Star, GitFork, Trash2 } from 'lucide-svelte';

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
	<h2 class="mb-6 text-xl font-semibold">Watched Repositories</h2>
	{#if repositories.length === 0}
		<p>No repositories added yet.</p>
	{:else}
		<ul class="space-y-4">
			{#each repositories as { owner, repo, latestRelease, avatarUrl, stars, forks, recentCommits }}
				<a href="/release/{owner}/{repo}" class="block">
					<li class="flex w-full flex-row items-center justify-between rounded-full bg-white p-4">
						<div class="flex w-full items-center">
							<img src={avatarUrl} alt={`${owner}'s avatar`} class="mr-4 h-12 w-12 rounded-full" />
							<div class="flex-grow">
								<span class="cursor-pointer text-lg font-medium hover:underline">
									{owner}/{repo}
								</span>

								<div class="flex space-x-4 font-medium">
									<span class="flex items-center text-gray-600" title="Stars">
										<Star class="mr-1 h-4 w-4" />
										{formatNumber(stars)}
									</span>
									<span class="flex items-center text-gray-600" title="Forks">
										<GitFork class="mr-1 h-4 w-4" />
										{formatNumber(forks)}
									</span>
								</div>

								<div class="mt-1 text-sm font-medium text-gray-600">
									Latest Release: {latestRelease || 'N/A'}
								</div>
							</div>
						</div>
						<div class="flex w-full items-center justify-end space-x-4">
							<button
								on:click|preventDefault={() => handleRemove(owner, repo)}
								class="mr-6 text-gray-300 hover:text-red-500"
							>
								<Trash2 />
							</button>
						</div>
					</li>
				</a>
			{/each}
		</ul>
	{/if}
</div>
