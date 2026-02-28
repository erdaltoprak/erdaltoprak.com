import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().trim().min(1).max(120),
    pubDate: z.coerce.date().refine((date) => date <= new Date(), {
      message: 'pubDate cannot be in the future',
    }),
    description: z.string().trim().min(1).max(300),
    author: z.string().trim().min(1).max(80).default('Erdal Toprak'),
    heroImage: z
      .string()
      .trim()
      .min(1)
      .regex(/^\.\/.+\.(png|jpe?g|webp|avif|gif)$/i, {
        message: 'heroImage must be a relative image path like ./banner.jpg',
      }),
    type: z.enum(['article', 'note']),
    draft: z.boolean().default(false),
  }).strict(),
});

export const collections = { blog };
