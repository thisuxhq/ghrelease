<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let url = '';

  function handleSubmit() {
    dispatch('submit', { url });
    url = '';
  }

  function isValidGitHubUrl(url: string): boolean {
    const githubUrlRegex = /^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;
    return githubUrlRegex.test(url);
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="flex items-center">
  <input
    type="text"
    bind:value={url}
    placeholder="Paste GitHub repository URL"
    class="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <button
    type="submit"
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md"
    disabled={!isValidGitHubUrl(url)}
  >
    Add
  </button>
</form>