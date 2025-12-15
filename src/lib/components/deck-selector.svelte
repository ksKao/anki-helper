<script lang="ts">
	import * as Field from '$lib/components/ui/field/index';
	import * as Select from '$lib/components/ui/select/index';
	import { globalState } from '$lib/state.svelte';
</script>

{#if globalState.decks.length}
	<Field.Field>
		<Field.Label for="deck">Deck</Field.Label>
		<Select.Root type="single" bind:value={globalState.selectedDeck}>
			<Select.Trigger id="deck">
				<span>
					{globalState.selectedDeck || 'Select a deck'}
				</span>
			</Select.Trigger>
			<Select.Content>
				{#each globalState.decks as deck (deck)}
					<Select.Item value={deck}>
						{deck}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</Field.Field>
{/if}
