import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
      filter: (page) => !page.includes('bzzzz'),
    }),
  ],
  vite: {
    ssr: {
      external: []
    }
  }
});
