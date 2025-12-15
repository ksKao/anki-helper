import { query } from '$app/server';
import { getDecksSchema, jishoResponseSchema } from '$lib/schema';
import z from 'zod/v4';

type AnkiResponse =
	| {
			error: string;
			data: null;
	  }
	| {
			error: null;
			data: z.infer<typeof getDecksSchema>['result'];
	  };

type JishoResponse =
	| {
			error: string;
			data: null;
	  }
	| {
			error: null;
			data: z.infer<typeof jishoResponseSchema>;
	  };

export const getDecks = query(z.string(), async (ankiUrl: string): Promise<AnkiResponse> => {
	try {
		const response = await fetch(ankiUrl, {
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

		return {
			data: parsed.result,
			error: null
		};
	} catch (e) {
		if (e instanceof Error) {
			return {
				error: e.message,
				data: null
			};
		}

		return {
			error: 'Unable to get decks',
			data: null
		};
	}
});

export const getJishoData = query(z.string(), async (word): Promise<JishoResponse> => {
	try {
		const response = await fetch(
			`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(word)}`
		);

		if (!response.ok) {
			throw new Error(await response.text());
		}

		const json = await response.json();

		const parsed = jishoResponseSchema.parse(json);

		return { data: parsed, error: null };
	} catch (e) {
		if (e instanceof Error) {
			return { error: e.message, data: null };
		}

		return { error: 'Something went wrong.', data: null };
	}
});
