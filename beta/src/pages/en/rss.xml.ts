import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getBlogPosts } from '../../lib/blog';

export async function GET(context: APIContext) {
  const posts = await getBlogPosts('EN');
  return rss({
    title: 'bumbleflies Field Notes',
    description: 'Field notes from a production AI agent system — architecture, automation, autonomy.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/en/blog/${post.id}/`,
      categories: [post.data.category],
    })),
    customData: '<language>en-us</language>',
  });
}
