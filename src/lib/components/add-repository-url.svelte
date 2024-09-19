<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Plus } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

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

<form on:submit|preventDefault={handleSubmit} class="mb-6 mt-4">
	<div class="flex items-center rounded-full bg-white p-4">
		<Input
			type="text"
			bind:value={url}
			placeholder="Paste GitHub repository URL"
			class="w-full flex-grow border-none bg-transparent p-2 shadow-none focus:outline-none focus-visible:ring-transparent"
		/>
		<Button type="submit" variant="default" class="rounded-full" disabled={!isValidGitHubUrl(url)} data-umami-event="Add GitHub Repository URL">
			<Plus class="mr-2 h-5 w-5" />
			Add
		</Button>
	</div>
</form>
