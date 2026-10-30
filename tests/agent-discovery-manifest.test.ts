import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const WELL_KNOWN = join(ROOT, 'public/.well-known');

// Agent Resource Discovery (ARD) manifest.
// Canonical path: /.well-known/ard.json. The predecessor path
// /.well-known/ai-catalog.json must carry the same entries, because a consumer
// MAY consult it — Lighthouse's "agentic browsing" audit validates exactly it.
const PATHS = ['ard.json', 'ai-catalog.json'];

function readManifest(name: string) {
  return JSON.parse(readFileSync(join(WELL_KNOWN, name), 'utf-8'));
}

describe('ARD discovery manifests', () => {
  it.each(PATHS)('%s parses as JSON and carries an entries array', (name) => {
    const manifest = readManifest(name);
    expect(Array.isArray(manifest.entries)).toBe(true);
    expect(manifest.entries.length).toBeGreaterThan(0);
  });

  it.each(PATHS)('%s entries satisfy the ARD required terms', (name) => {
    for (const entry of readManifest(name).entries) {
      // MUST: identifier, displayName, type, and exactly one of url/data.
      expect(entry.identifier, 'identifier').toMatch(/^urn:air:[a-z0-9.-]+\.[a-z]{2,}:/);
      expect(entry.displayName, 'displayName').toBeTruthy();
      expect(entry.type, 'type').toMatch(/^application\/[a-z0-9.+-]+$/);
      expect(Boolean(entry.url) !== Boolean(entry.data), 'exactly one of url/data').toBe(true);
      // SHOULD: 2-5 representative queries — the signal a registry indexes.
      expect(entry.representativeQueries.length).toBeGreaterThanOrEqual(2);
      expect(entry.representativeQueries.length).toBeLessThanOrEqual(5);
      // The URN publisher must be the site's own domain (anti-squatting).
      expect(entry.identifier).toContain(':bumbleflies.de:');
    }
  });

  it('both paths serve the same manifest', () => {
    const [a, b] = PATHS.map(readManifest);
    expect(a).toEqual(b);
  });
});
