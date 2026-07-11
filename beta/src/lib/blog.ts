import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Magic preview key. Append `?preview=<key>` to any /blog URL in production to
 * reveal drafted articles for the rest of the browser session. Override at
 * build time with the PUBLIC_PREVIEW_KEY env var.
 */
export const PREVIEW_KEY = import.meta.env.PUBLIC_PREVIEW_KEY || 'feldnotizen-vorschau';

const byOrder = (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) =>
  a.data.order - b.data.order;

/**
 * A blog article is publicly visible when it is published, OR whenever we are
 * running the dev server. Drafts (`published: false`) stay out of the public
 * listing/teaser in production but remain browsable in dev.
 */
export const isBlogVisible = ({ data }: CollectionEntry<'blog'>) =>
  data.published || import.meta.env.DEV;

/** Publicly visible blog posts, ordered by series `order`. */
export async function getBlogPosts(): Promise<CollectionEntry<'blog'>[]> {
  return (await getCollection('blog', isBlogVisible)).sort(byOrder);
}

/**
 * Every blog post, drafts included, ordered by series `order`. Used to build
 * the (unlisted, gated) draft pages in production so the magic preview link
 * has a real URL to resolve.
 */
export async function getAllBlogPosts(): Promise<CollectionEntry<'blog'>[]> {
  return (await getCollection('blog')).sort(byOrder);
}
