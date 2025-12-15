<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Field from '$lib/components/ui/field/index';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { globalState, type Definition } from '$lib/state.svelte';
	import { InfoIcon } from '@lucide/svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import { getJishoData } from '../../routes/data.remote';
	import { toast } from 'svelte-sonner';
	import { SvelteMap } from 'svelte/reactivity';

	let message = $state('');
	const getMeaningsMutation = createMutation(() => ({
		mutationFn: async () => {
			const words = globalState.wordList.split('\n').filter((word) => !!word);

			if (!words.length) throw new Error('No words found in word list');

			const definitions = new SvelteMap<string, Definition>();

			for (const word of words) {
				message = `Fetching meaning for ${word} from Jisho.org`;
				const { data, error } = await getJishoData(word);

				if (error || !data) {
					const message = error ?? 'Something went wrong';
					toast.error(message);
					definitions.set(word, {
						data: message,
						type: 'error'
					});
					continue;
				}

				const results = data.data;

				const found = results.find(
					(r) => !!r.japanese?.find((j) => j.word === word || j.reading === word)
				);

				if (!found) {
					const message = `${word} returned no results from Jisho`;
					toast.error(message);
					definitions.set(word, {
						data: message,
						type: 'error'
					});
					continue;
				}

				if (!found.japanese?.length) {
					const message = `${word} contains no japanese reading`;
					toast.error(message);
					definitions.set(word, {
						data: message,
						type: 'error'
					});
					continue;
				}

				message = `Found ${found.senses.length} sense(s)`;
				let content = '';
				for (const sense of found.senses) {
					if (sense.parts_of_speech.includes('Wikipedia definition')) {
						message = 'Wikipedia definition detected, skipping...';
						continue;
					}

					const definition = `${sense.english_definitions.join('; ')}`;

					message = `Found definition: ${definition}`;
					content += definition + '\n';
				}

				// if has word, means that the word is a kanji, so append the furigana reading
				if (found.japanese[0].word) content += `\n${found.japanese[0].reading}`;

				definitions.set(word, { data: content, type: 'definition' });

				message = 'Waiting 2 seconds';
				await new Promise((resolve) => setTimeout(resolve, 2000));
			}

			return definitions;
		},
		onSuccess: (data) => {
			toast.success('Get meanings complete.');
			globalState.definitions = data;
		},
		onSettled: () => {
			message = '';
		}
	}));
</script>

{#if message}
	<Alert.Root>
		<InfoIcon />
		<Alert.Title>{message}</Alert.Title>
	</Alert.Root>
{/if}
<Field.Field>
	<Field.Label for="word-list">Word List</Field.Label>
	<Textarea class="h-32 resize-y" id="word-list" bind:value={globalState.wordList} />
	<Field.Description>
		Each line should be its own word ({globalState.wordList.split('\n').filter((word) => !!word)
			.length} entries found)
	</Field.Description>
</Field.Field>
<Button onclick={() => getMeaningsMutation.mutate()} loading={getMeaningsMutation.isPending}>
	Get Meanings
</Button>
