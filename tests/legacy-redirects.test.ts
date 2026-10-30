import { describe, it, expect } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';

// Legacy Jekyll URLs are redirected in nginx.conf. The map has to stay small,
// exact and verified:
//   * every source must be a path the current site does NOT serve,
//   * every target must exist as a route (a typo would 404 the visitor twice),
//   * targets must end in "/" so the redirect does not chain into a second 301.
const CONFIG = join(process.cwd(), 'nginx.conf');
const PAGES = join(process.cwd(), 'src', 'pages');
const SITEMAP_INDICATOR = 'location = /';

async function readRedirects() {
  const conf = await fs.readFile(CONFIG, 'utf8');
  const block = conf.split('# Legacy Jekyll URLs').at(1) ?? '';
  const pairs: { from: string; to: string }[] = [];
  const re = /location = (\/[A-Za-z0-9._-]+) \{\s*\n\s*return 301 (\/[A-Za-z0-9._/-]*);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) pairs.push({ from: m[1], to: m[2] });
  return pairs;
}

async function routeExists(path: string): Promise<boolean> {
  const parts = path.split('/').filter(Boolean);
  // Astro can serve a trailing-slash URL from either `about.astro` or
  // `about/index.astro`; both are valid sources for the same address.
  const candidates =
    parts.length === 0
      ? ['index.astro']
      : [`${parts.join('/')}.astro`, `${parts.join('/')}/index.astro`];
  for (const file of candidates) {
    try {
      await fs.access(join(PAGES, file));
      return true;
    } catch {
      /* next */
    }
  }
  return false;
}

describe('legacy redirect map', () => {
  it('declares redirects at all', async () => {
    const pairs = await readRedirects();
    expect(pairs.length).toBeGreaterThan(0);
  });

  it('only redirects paths the current site does not serve', async () => {
    const clashes: string[] = [];
    for (const { from } of await readRedirects()) {
      if (await routeExists(from)) clashes.push(from);
    }
    expect(clashes, `These sources are current routes: ${clashes.join(', ')}`).toEqual([]);
  });

  it('points every redirect at a route that exists', async () => {
    const broken: string[] = [];
    for (const { from, to } of await readRedirects()) {
      if (!(await routeExists(to))) broken.push(`${from} -> ${to}`);
    }
    expect(broken, `Targets missing a page: ${broken.join(', ')}`).toEqual([]);
  });

  it('never sends a legacy URL to the homepage', async () => {
    // A catch-all to "/" reads as a soft 404 to Google and helps nobody.
    const toHome = (await readRedirects()).filter(({ to }) => to === '/');
    expect(toHome).toEqual([]);
  });

  it('uses trailing-slash targets so the redirect is a single hop', async () => {
    const chained = (await readRedirects()).filter(({ to }) => !to.endsWith('/') && !to.includes('.'));
    expect(chained).toEqual([]);
  });

  it('keeps the block readable — no orphaned marker', async () => {
    const conf = await fs.readFile(CONFIG, 'utf8');
    expect(conf).toContain(SITEMAP_INDICATOR);
    expect(conf).toContain('# Legacy Jekyll URLs');
  });
});
