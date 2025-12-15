import { query } from '$app/server';
import { jishoResponseSchema } from '$lib/schema';
import z from 'zod/v4';

type Response =
	| {
			error: string;
			data: null;
	  }
	| {
			error: null;
			data: z.infer<typeof jishoResponseSchema>;
	  };

export const getJishoData = query(z.string(), async (word): Promise<Response> => {
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
