import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parseNestedText } from '../lib/nestedtext';
import { pagesSchemaCoerced } from '../lib/astro-loaders';

const ROOT = process.cwd();

function loadPrinciples(relPath: string) {
  const raw = readFileSync(join(ROOT, relPath), 'utf-8');
  const { data } = parseNestedText(raw);
  const parsed = pagesSchemaCoerced.parse(data);
  if (!parsed.principles) {
    throw new Error(`${relPath}: parsed data has no "principles" field`);
  }
  return parsed.principles;
}

describe('Open Space principles content', () => {
  it('DE content has 6 principles with all required fields', () => {
    const principles = loadPrinciples('src/content/pages/open-space.nt');
    expect(principles).toHaveLength(6);
    principles.forEach((p) => {
      expect(p.number).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.quote).toBeTruthy();
      expect(p.image).toMatch(/^\/images\/open-space\/de\//);
    });
  });

  it('EN content has 6 principles with all required fields', () => {
    const principles = loadPrinciples('src/content/pages/en/open-space.nt');
    expect(principles).toHaveLength(6);
    principles.forEach((p) => {
      expect(p.number).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.quote).toBeTruthy();
      expect(p.image).toMatch(/^\/images\/open-space\/en\//);
    });
  });

  it('DE and EN list the same 6 principle numbers in the same order', () => {
    const de = loadPrinciples('src/content/pages/open-space.nt');
    const en = loadPrinciples('src/content/pages/en/open-space.nt');
    expect(de.map((p) => p.number)).toEqual(en.map((p) => p.number));
  });

  it('every referenced image file exists in public/', () => {
    const all = [
      ...loadPrinciples('src/content/pages/open-space.nt'),
      ...loadPrinciples('src/content/pages/en/open-space.nt'),
    ];
    const missing = all
      .map((p) => p.image)
      .filter((imagePath) => !existsSync(join(ROOT, 'public', imagePath)));
    expect(missing).toEqual([]);
  });
});
