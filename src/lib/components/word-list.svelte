<script lang="ts">
	import { globalState } from '$lib/state.svelte';
	import * as Field from '$lib/components/ui/field/index';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from './ui/button/button.svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import { addNotesSchema } from '$lib/schema';
	import { toast } from 'svelte-sonner';
	import { Trash2Icon } from '@lucide/svelte';

	const validDefinitions = $derived(
		[...globalState.definitions.entries()].filter((d) => d[1].type === 'definition')
	);

	const importMutation = createMutation(() => ({
		mutationFn: async () => {
			if (!globalState.ankiUrl) {
				throw new Error('Anki URL is not set!');
			}

			if (!globalState.selectedDeck) {
				throw new Error('Please select a deck to import to');
			}

			if (!validDefinitions.length) {
				throw new Error('No new valid definitions found');
			}

			const response = await fetch(globalState.ankiUrl, {
				method: 'POST',
				body: JSON.stringify({
					action: 'addNotes',
					version: 6,
					params: {
						notes: validDefinitions.map((d) => ({
							deckName: globalState.selectedDeck,
							modelName: 'Basic',
							fields: {
								Front: d[0],
								Back: d[1].data.replaceAll('\n', '<br>')
							},
							options: {
								allowDuplicate: false,
								duplicateScope: 'deck'
							}
						}))
					}
				})
			});

			if (!response.ok) throw new Error(await response.text());

			const parsed = addNotesSchema.parse(await response.json());

			if (parsed.error) {
				throw new Error(parsed.error);
			}

			return parsed.result;
		},
		onSuccess: () => {
			toast.success('All cards imported successfully!');
			globalState.definitions.clear();
		}
	}));
</script>

{#if globalState.definitions.size}
	<h1 class="text-2xl font-bold">Definitions</h1>
	<Button onclick={() => importMutation.mutate()} loading={importMutation.isPending}>
		Import {validDefinitions.length} entries
	</Button>
	{#each globalState.definitions as [front, back]}
		<div class="space-y-2 rounded-md border border-border p-4">
			<div class="flex items-center justify-between">
				<p class="font-semi-bold text-xl">{front}</p>
				<Button
					size="icon"
					variant="destructive"
					onclick={() => globalState.definitions.delete(front)}
				>
					<Trash2Icon />
				</Button>
			</div>
			{#if back.type === 'definition'}
				<Field.Field>
					<Textarea class="h-32 resize-y" id={`word-${front}`} bind:value={back.data} />
				</Field.Field>
			{:else}
				<p class="text-destructive">{back.data}</p>
			{/if}
		</div>
	{/each}
{/if}
