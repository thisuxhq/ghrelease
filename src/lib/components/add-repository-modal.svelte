<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let dialogOpen = false; // New state for dialog visibility
	export let urlToAdd = '';

	let owner = '';
	let repo = '';

	$: if (urlToAdd) {
		const parts = urlToAdd.split('/');
		owner = parts[parts.length - 2] || '';
		repo = parts[parts.length - 1] || '';
		dialogOpen = true; // Open dialog when URL is pasted
	}

	function handleSubmit() {
		dispatch('add', { owner, repo });
		owner = '';
		repo = '';
		dialogOpen = false; // Close dialog after submission
	}

	function handleClose() {
		dispatch('close');
		dialogOpen = false; // Close dialog on cancel
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{urlToAdd ? 'Confirm Repository' : 'Add Repository'}</Dialog.Title>
			<Dialog.Description>
				{urlToAdd ? 'Confirm the details below.' : 'Please enter the repository details.'}
			</Dialog.Description>
		</Dialog.Header>
		<form on:submit|preventDefault={handleSubmit}>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="owner" class="text-right">Owner</Label>
					<Input id="owner" bind:value={owner} class="col-span-3" required readonly={!!urlToAdd} />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="repo" class="text-right">Repository</Label>
					<Input id="repo" bind:value={repo} class="col-span-3" required readonly={!!urlToAdd} />
				</div>
			</div>
			<Dialog.Footer>
				<Button variant="ghost" type="button" on:click={handleClose} data-umami-event="Cancel Add Repository">Cancel</Button>
				<Button type="submit" data-umami-event={urlToAdd ? 'Confirm Repository' : 'Add Repository'}>
					{urlToAdd ? 'Confirm' : 'Add'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
