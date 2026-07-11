import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { nestedTextLoader, pagesSchemaCoerced } from '../lib/astro-loaders';

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    service: z.enum(['Talk', 'Decide', 'Build & Embed', 'Full Journey']),
    company: z.string(),
    duration: z.string().optional(),
    outcome: z.string(),
    quote: z.string(),
    image: z.string().optional(),
    whyItWorked: z.string().optional(),
    realOutcome: z.string().optional(),
    whatWeDid: z.string().optional(),
    results: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    excerpt: z.string(),
    category: z.string(),
    // Teaser/cover image (concrete-scene SVG in /public/images/blog/<slug>.svg).
    image: z.string().optional(),
    // Series order — controls the reading sequence in the listing.
    order: z.number(),
    date: z.coerce.date(),
    author: z.string().default('bumbleflies'),
    readingTime: z.string().optional(),
    // The per-article live switch: false = drafted & ready but not built/listed.
    published: z.boolean().default(false),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    author: z.string(),
    role: z.string(),
    company: z.string(),
    quote: z.string(),
    image: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    image: z.string(),
    order: z.number().optional(),
  }),
});

const pages = defineCollection({
  loader: nestedTextLoader(),
  schema: pagesSchemaCoerced,
});

export const collections = { 'case-studies': caseStudies, blog, testimonials, team, pages };
