import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Returns the public audio URL for a post when its language-specific recording
 * has been added to public/audio/blog. The existence check keeps posts without
 * a recording free of an audio control.
 */
export function getBlogAudioPath(lang: 'DE' | 'EN', slug: string): string | undefined {
  const filename = `${lang.toLowerCase()}_${slug}.m4a`;
  const publicPath = `/audio/blog/${filename}`;
  const filePath = join(process.cwd(), 'public', 'audio', 'blog', filename);

  return existsSync(filePath) ? publicPath : undefined;
}
