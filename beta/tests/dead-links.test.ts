import { describe, it, expect } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';

const SRC_DIR = join(process.cwd(), 'src');
const PAGES_DIR = join(SRC_DIR, 'pages');
const PUBLIC_DIR = join(process.cwd(), 'public');

// Hrefs that never point to an internal route and should not be flagged.
const EXTERNAL_OR_SPECIAL = /^(mailto:|tel:|https?:\/\/|#)/;

// Recursively list files with a given extension under a directory.
async function listFiles(dir: string, ext: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(d: string) {
    let entries: import('fs').Dirent[];
    try {
      entries = await fs.readdir(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = join(d, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.name.endsWith(ext)) {
        out.push(full);
      }
    }
  }
  await walk(dir);
  return out;
}

// Resolve an internal path (e.g. "/services", "/en/", "/case-studies/foo")
// to the source file that would serve it, and report whether it exists.
async function routeExists(path: string): Promise<boolean> {
  if (EXTERNAL_OR_SPECIAL.test(path)) return true;

  const parts = path.split('/').filter(Boolean);

  let file: string;
  if (parts.length === 0) {
    file = 'index.astro'; // "/"
  } else if (path.endsWith('/')) {
    file = `${parts.join('/')}/index.astro`; // "/en/"
  } else {
    file = `${parts.join('/')}.astro`;
  }

  try {
    await fs.access(join(PAGES_DIR, file));
    return true;
  } catch {
    // Static assets live in public/ (e.g. /favicon.ico, /images/...).
    try {
      await fs.access(join(PUBLIC_DIR, path.replace(/^\/+/, '')));
      return true;
    } catch {
      return false;
    }
  }
}

// Collect every href literal found in a source file.
// Returns the literal path strings that should be validated as internal links.
function extractHrefs(content: string): string[] {
  const hrefs: string[] = [];

  // 1. Static quoted hrefs: href="/services" or href="#"
  const quoted = /href=(["'])([^"']*)\1/g;
  let m: RegExpExecArray | null;
  while ((m = quoted.exec(content)) !== null) {
    hrefs.push(m[2]);
  }

  // 2. Expression hrefs: href={...} (may wrap a backtick template or a variable)
  const expression = /href=\{([^}]*)\}/g;
  while ((m = expression.exec(content)) !== null) {
    hrefs.push(...parseExpression(m[1]));
  }

  return hrefs;
}

// Pull candidate internal paths out of an Astro/TS expression.
function parseExpression(expr: string): string[] {
  const candidates: string[] = [];

  // Quoted string literals inside the expression.
  const quotedLit = /['"]([^'"]*)['"]/g;
  let q: RegExpExecArray | null;
  while ((q = quotedLit.exec(expr)) !== null) {
    candidates.push(q[1]);
  }

  // Unquoted path literals, e.g. the `/programs/` left after stripping ${...}
  // and backticks: href={`/programs/${slug}`} -> /programs/
  let unquoted = expr.replace(/`/g, '').replace(/\$\{[^}]*\}/g, '');
  const pathLike = unquoted.match(/\/[A-Za-z0-9/_-]+/g);
  if (pathLike) candidates.push(...pathLike);

  return candidates;
}

describe('Dead link detection', () => {
  it('should not contain any placeholder (href="#") links', async () => {
    const files = await listFiles(SRC_DIR, '.astro');
    const dead: string[] = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      if (content.includes('href="#"')) {
        dead.push(file.replace(SRC_DIR, 'src'));
      }
    }

    expect(dead).toEqual([], `Placeholder links (href="#") found in: ${dead.join(', ')}`);
  });

  it('should have no internal links pointing to non-existent routes', async () => {
    const files = [...(await listFiles(SRC_DIR, '.astro')), ...(await listFiles(SRC_DIR, '.ts'))];
    const dead: string[] = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const hrefs = extractHrefs(content);

      for (const href of hrefs) {
        // Normalize: strip trailing slash for route resolution, keep "/" as-is.
        const normalized = href === '/' ? '/' : href.replace(/\/+$/, '');
        if (!normalized.startsWith('/')) continue; // skip external/special/relative
        if (normalized === '#') {
          dead.push(`${file.replace(SRC_DIR, 'src')}: "${href}"`);
          continue;
        }
        const exists = await routeExists(normalized);
        if (!exists) {
          dead.push(`${file.replace(SRC_DIR, 'src')}: "${href}"`);
        }
      }
    }

    expect(dead).toEqual([], `Dead internal links found:\n${dead.join('\n')}`);
  });
});
