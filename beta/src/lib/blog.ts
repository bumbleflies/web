import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogLang = 'DE' | 'EN';

/**
 * Magic preview key. Append `?preview=<key>` to any /blog URL in production to
 * reveal drafted articles for the rest of the browser session. Override at
 * build time with the PUBLIC_PREVIEW_KEY env var.
 */
export const PREVIEW_KEY = import.meta.env.PUBLIC_PREVIEW_KEY || 'bumble-field-notes';

const byOrder = (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) =>
  a.data.order - b.data.order;

/**
 * A blog article is publicly visible when it is published, OR whenever we are
 * running the dev server. Drafts (`published: false`) stay out of the public
 * listing/teaser in production but remain browsable in dev.
 */
export const isBlogVisible = ({ data }: CollectionEntry<'blog'>) =>
  data.published || import.meta.env.DEV;

/** Publicly visible blog posts for one language, ordered by series `order`. */
export async function getBlogPosts(lang: BlogLang): Promise<CollectionEntry<'blog'>[]> {
  return (await getCollection('blog', (e) => e.data.lang === lang && isBlogVisible(e))).sort(byOrder);
}

/**
 * Every blog post for one language, drafts included, ordered by series
 * `order`. Used to build the (unlisted, gated) draft pages in production so
 * the magic preview link has a real URL to resolve.
 */
export async function getAllBlogPosts(lang: BlogLang): Promise<CollectionEntry<'blog'>[]> {
  return (await getCollection('blog', (e) => e.data.lang === lang)).sort(byOrder);
}
