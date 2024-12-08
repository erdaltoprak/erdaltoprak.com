import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		heroImage: z.string(),
		type: z.enum(['articles', 'notes']),
		updatedDate: z.coerce.date().optional(),
	}),
});

export const collections = {
	'blog': blogCollection,
};
