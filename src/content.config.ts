import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

export const collections = {
  articles: defineCollection({
    loader: glob({ base: './src/content/articles', pattern: '**/*.md' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string().min(1)),
      draft: z.boolean().default(false),
    }),
  }),
}
