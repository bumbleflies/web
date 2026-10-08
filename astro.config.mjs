import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// Draft blog posts (published: false) are built when PUBLIC_PREVIEW_KEY is
// set, so the preview link resolves, but they must not be advertised in the
// sitemap. Filename = slug; DE posts live at /blog/, EN posts at /en/blog/.
const blogDir = new URL('./src/content/blog/', import.meta.url);
const draftPaths = new Set(
  readdirSync(blogDir)
    .filter((f) => f.endsWith('.md') && f !== 'AGENTS.md')
    .map((f) => [f.slice(0, -3), readFileSync(new URL(f, blogDir), 'utf-8')])
    .filter(([, src]) => !/^published:\s*true\s*$/m.test(src))
    .map(([slug, src]) =>
      /^lang:\s*"?EN"?\s*$/m.test(src) ? `/en/blog/${slug}/` : `/blog/${slug}/`,
    ),
);

export default defineConfig({
  site: 'https://bumbleflies.de',
  output: 'static',
  outDir: 'dist',
  server: {
    port: 3000,
    host: true,
  },
  integrations: [
    sitemap({
      filter: (page) => !draftPaths.has(new URL(page).pathname),
    }),
  ],
  vite: {
    ssr: {
      external: []
    }
  }
});
