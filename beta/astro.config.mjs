import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  outDir: 'dist',
  server: {
    port: 3000,
    host: true,
  },
  vite: {
    ssr: {
      external: []
    }
  }
});
