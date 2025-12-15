<script>
	import DeckSelector from '$lib/components/deck-selector.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Field from '$lib/components/ui/field/index';
	import { Input } from '$lib/components/ui/input';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import WordListInput from '$lib/components/word-list-input.svelte';
	import WordList from '$lib/components/word-list.svelte';
	import { getDecksSchema } from '$lib/schema';
	import { globalState } from '$lib/state.svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';

	const getDeckMutation = createMutation(() => ({
		mutationFn: async () => {
			const response = await fetch(`${globalState.ankiUrl}`, {
				method: 'POST',
				body: JSON.stringify({
					action: 'deckNames',
					version: 6
				})
			});

			if (!response.ok) {
				throw new Error(await response.text());
			}

			const json = await response.json();

			const parsed = getDecksSchema.parse(json);

			if (parsed.error) {
				throw new Error(parsed.error);
			}

			return parsed.result ?? [];
		},
		onSuccess: (data) => {
			if (!data.length) {
				toast.error('No decks found');
				return;
			}

			globalState.decks = data;
		}
	}));
</script>

<Field.Field>
	<Field.Label for="anki-url">Anki URL</Field.Label>
	<div class="flex gap-2">
		<Input
			id="anki-url"
			placeholder="http://localhost:8765"
			required
			bind:value={globalState.ankiUrl}
		/>
		<Button loading={getDeckMutation.isPending} onclick={() => getDeckMutation.mutate()}>
			Get Decks
		</Button>
	</div>
	<DeckSelector />
	<Separator />
	<WordListInput />
	<Separator />
	<WordList />
</Field.Field>
