<script lang="ts">
  import type { Repository } from '$lib/stores/repositories';
  import { createEventDispatcher } from 'svelte';

  export let repositories: Repository[];

  const dispatch = createEventDispatcher();

  function handleRemove(owner: string, repo: string) {
    dispatch('remove', { owner, repo });
  }
</script>

<div class="mt-4">
  <h2 class="text-xl font-semibold mb-2">Watched Repositories</h2>
  {#if repositories.length === 0}
    <p>No repositories added yet.</p>
  {:else}
    <ul class="space-y-2">
      {#each repositories as { owner, repo, latestRelease }}
        <li class="bg-white p-4 rounded shadow">
          <div class="flex justify-between items-center">
            <div>
              <span class="font-medium">{owner}/{repo}</span>
              <span class="ml-2 text-sm text-gray-600">Latest: {latestRelease || 'N/A'}</span>
            </div>
            <div>
              <a href="/release/{owner}/{repo}" class="text-blue-500 hover:text-blue-700 mr-2">View</a>
              <button
                on:click={() => handleRemove(owner, repo)}
                class="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>