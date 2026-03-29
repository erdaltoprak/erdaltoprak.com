import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({
    pattern: '**/index.{md,mdx}',
    base: './src/content/blog',
    generateId: ({ entry }) =>
      entry
        .replace(/\\/g, '/')
        .replace(/\/index\.(md|mdx)$/, '')
        .replace(/\.(md|mdx)$/, ''),
  }),
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
