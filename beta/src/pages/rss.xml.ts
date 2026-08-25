import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getBlogPosts } from '../lib/blog';

export async function GET(context: APIContext) {
  const posts = await getBlogPosts('DE');
  return rss({
    title: 'bumbleflies Field Notes',
    description: 'Feldnotizen aus einem produktiven KI-Agenten-System — Architektur, Automatisierung, Autonomie.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: [post.data.category],
    })),
    customData: '<language>de-de</language>',
  });
}
