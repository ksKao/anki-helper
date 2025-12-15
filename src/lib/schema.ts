import { z } from 'zod/v4';

function createAnkiResponseSchema<T extends z.ZodTypeAny>(schema: T) {
	return z.union([
		z.object({
			error: z.string(),
			result: z.null()
		}),
		z.object({
			error: z.null(),
			result: schema
		})
	]);
}

export const getDecksSchema = createAnkiResponseSchema(z.array(z.string()));

export const addNotesSchema = createAnkiResponseSchema(z.unknown());

export const jishoResponseSchema = z.object({
	meta: z.object({
		status: z.number()
	}),
	data: z.array(
		z.object({
			slug: z.string(),
			is_common: z.boolean(),
			tags: z.array(z.string()),
			jlpt: z.array(z.string()),
			japanese: z
				.array(
					z.object({
						word: z.string().optional(),
						reading: z.string()
					})
				)
				.optional(),
			senses: z.array(
				z.object({
					english_definitions: z.array(z.string()),
					parts_of_speech: z.array(z.string()),
					links: z.array(
						z.object({
							text: z.string(),
							url: z.string()
						})
					),
					tags: z.array(z.string()),
					restrictions: z.array(z.unknown()),
					see_also: z.array(z.string()),
					antonyms: z.array(z.string()),
					source: z.array(z.unknown()),
					info: z.array(z.unknown())
				})
			),
			attribution: z.object({
				jmdict: z.union([z.boolean(), z.string()]),
				jmnedict: z.union([z.boolean(), z.string()]),
				dbpedia: z.union([z.boolean(), z.string()])
			})
		})
	)
});
