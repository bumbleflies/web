import { describe, it, expect, beforeAll } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';

const COMPONENT_PATH = join(process.cwd(), 'src', 'components', 'PipelineDemo.astro');

// Mirrors the formatTime() helper in PipelineDemo.astro's client script.
// Kept in sync manually, same convention as ThemeToggle.test.ts.
function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

describe('PipelineDemo timer formatting', () => {
  it('formats zero as 00:00', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('formats sub-minute durations without losing the minute column', () => {
    expect(formatTime(59)).toBe('00:59');
    expect(formatTime(60)).toBe('01:00');
  });

  it('formats the real PR #232 ticket-to-live duration (40m22s) correctly', () => {
    expect(formatTime(40 * 60 + 22)).toBe('40:22');
  });
});

describe('PipelineDemo component source', () => {
  let source: string;

  beforeAll(async () => {
    source = await fs.readFile(COMPONENT_PATH, 'utf8');
  });

  it('encodes the real PR #232 ticket-to-live timing as the animation target', () => {
    expect(source).toContain('const TARGET_SECONDS = 40 * 60 + 22;');
  });

  it('references the real pull request in both languages', () => {
    expect(source).toContain('PR #232');
    expect(source).toContain('pull request #232');
  });

  it('defines exactly four steps for each language', () => {
    const stepBlocks = source.match(/satisfies Step\[\]/g) ?? [];
    expect(stepBlocks).toHaveLength(2);

    // Matches only step data entries (`marker: '...'`), not the `marker: string`
    // field in the Step interface declaration.
    const markerCount = (source.match(/marker: '/g) ?? []).length;
    expect(markerCount).toBe(8); // 4 steps * 2 languages
  });

  it('contains no em dash (house style)', () => {
    expect(source.includes('—')).toBe(false);
  });

  it('respects prefers-reduced-motion in the client script', () => {
    expect(source).toContain('prefers-reduced-motion');
  });

  it('renders as a hidden dialog, not a standalone page section', () => {
    expect(source).toContain('<dialog');
    expect(source).toContain('data-pipeline-dialog');
    expect(source).not.toContain('bf-section');
  });

  it('labels the timer "ticket to live", not "ticket to merge"', () => {
    expect(source).toContain('von Ticket bis Live');
    expect(source).toContain('ticket to live');
    expect(source).not.toContain('bis Merge');
    expect(source).not.toContain('ticket to merge');
  });
});

describe('PipelineDemo modal trigger wiring', () => {
  it('StationFlow renders a button trigger for stations with modalTrigger', async () => {
    const stationFlowSource = await fs.readFile(
      join(process.cwd(), 'src', 'components', 'StationFlow.astro'),
      'utf8'
    );
    expect(stationFlowSource).toContain('modalTrigger');
    expect(stationFlowSource).toContain('data-open-modal={station.modalTrigger}');
  });

  it('both homepages wire the "Bauen"/"Build" station to the pipeline demo dialog', async () => {
    const dePage = await fs.readFile(join(process.cwd(), 'src', 'pages', 'index.astro'), 'utf8');
    const enPage = await fs.readFile(join(process.cwd(), 'src', 'pages', 'en', 'index.astro'), 'utf8');

    for (const page of [dePage, enPage]) {
      expect(page).toContain("modalTrigger: 'pipeline-demo-dialog'");
      expect(page).toContain('<PipelineDemo');
    }
  });
});
