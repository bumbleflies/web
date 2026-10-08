import { describe, it, expect } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';

const CONTENT_DIR = join(process.cwd(), 'src', 'content');
const EM_DASH = '—';

// House style forbids em dashes (see CLAUDE.md: "No em dashes"). AGENTS.md
// files are contributor docs, not published site content, so they're exempt.
async function listContentFiles(dir: string): Promise<string[]> {
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
      } else if (
        (entry.name.endsWith('.md') || entry.name.endsWith('.nt')) &&
        entry.name !== 'AGENTS.md'
      ) {
        out.push(full);
      }
    }
  }
  await walk(dir);
  return out;
}

describe('Content style: no em dashes', () => {
  it('should not contain any em dash (—) in content files', async () => {
    const files = await listContentFiles(CONTENT_DIR);
    const violations: string[] = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      content.split('\n').forEach((line, idx) => {
        if (line.includes(EM_DASH)) {
          violations.push(`${file.replace(CONTENT_DIR, 'src/content')}:${idx + 1}: ${line.trim()}`);
        }
      });
    }

    expect(
      violations,
      `Em dash (—) found in content files. Use a period, comma, colon, semicolon, or parentheses instead:\n${violations.join('\n')}`
    ).toEqual([]);
  });
});
