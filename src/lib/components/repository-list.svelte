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
  <h2 class="text-xl font-semibold mb-2">Watched Repositories</h2>
  {#if repositories.length === 0}
    <p>No repositories added yet.</p>
  {:else}
    <ul class="space-y-4">
      {#each repositories as { owner, repo, latestRelease, avatarUrl, stars, forks, recentCommits }}
        <li class="bg-white p-4 rounded shadow">
          <div class="flex items-center">
            <img src={avatarUrl} alt={`${owner}'s avatar`} class="w-12 h-12 rounded-full mr-4" />
            <div class="flex-grow">
              <div class="flex justify-between items-center">
                <a href={`https://github.com/${owner}/${repo}`} target="_blank" rel="noopener noreferrer" class="font-medium text-lg hover:underline">
                  {owner}/{repo}
                </a>
                <div class="flex space-x-4">
                  <span class="flex items-center text-gray-600" title="Stars">
                    <Star class="w-4 h-4 mr-1" /> {formatNumber(stars)}
                  </span>
                  <span class="flex items-center text-gray-600" title="Forks">
                    <GitFork class="w-4 h-4 mr-1" /> {formatNumber(forks)}
                  </span>
                  <span class="flex items-center text-gray-600" title="Recent Commits">
                    <GitCommit class="w-4 h-4 mr-1" /> {recentCommits}
                  </span>
                </div>
              </div>
              <div class="mt-2">
                <span class="text-sm text-gray-600">Latest Release: {latestRelease || 'N/A'}</span>
              </div>
            </div>
          </div>
          <div class="mt-4 flex justify-end">
            <a href="/release/{owner}/{repo}" class="text-blue-500 hover:text-blue-700 mr-4">View Release</a>
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