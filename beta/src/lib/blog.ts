import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * A blog article is visible when it is published, OR whenever we are running
 * the dev server. This keeps drafted articles (`published: false`) fully
 * browsable locally while keeping them out of the production build.
 */
export const isBlogVisible = ({ data }: CollectionEntry<'blog'>) =>
  data.published || import.meta.env.DEV;

/** Visible blog posts, ordered by their series `order`. */
export async function getBlogPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', isBlogVisible);
  return posts.sort((a, b) => a.data.order - b.data.order);
}
