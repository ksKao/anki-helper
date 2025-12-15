import { SvelteMap } from 'svelte/reactivity';

export type Definition = {
	data: string;
	type: 'error' | 'definition';
};

export const globalState = $state({
	ankiUrl: 'http://localhost:8765',
	decks: [] as string[],
	selectedDeck: undefined as string | undefined,
	wordList: '',
	definitions: new SvelteMap<string, Definition>()
});
