<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let urlToAdd = '';

  let owner = '';
  let repo = '';

  $: if (urlToAdd) {
    const parts = urlToAdd.split('/');
    owner = parts[parts.length - 2] || '';
    repo = parts[parts.length - 1] || '';
  }

  function handleSubmit() {
    dispatch('add', { owner, repo });
    owner = '';
    repo = '';
  }

  function handleClose() {
    dispatch('close');
  }
</script>

<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" on:click={handleClose}>
  <div
    class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
    on:click|stopPropagation
  >
    <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
      {urlToAdd ? 'Confirm Repository' : 'Add Repository'}
    </h3>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="mb-4">
        <label for="owner" class="block text-sm font-medium text-gray-700">Owner</label>
        <input
          type="text"
          id="owner"
          bind:value={owner}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
          readonly={!!urlToAdd}
        />
      </div>
      <div class="mb-4">
        <label for="repo" class="block text-sm font-medium text-gray-700">Repository</label>
        <input
          type="text"
          id="repo"
          bind:value={repo}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
          readonly={!!urlToAdd}
        />
      </div>
      <div class="flex justify-end">
        <button
          type="button"
          on:click={handleClose}
          class="mr-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {urlToAdd ? 'Confirm' : 'Add'}
        </button>
      </div>
    </form>
  </div>
</div>