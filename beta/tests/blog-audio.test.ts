import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getBlogAudioPath } from '../src/lib/blog-audio';

const germanBlogPage = readFileSync(join(process.cwd(), 'src/pages/blog/[slug].astro'), 'utf8');
const englishBlogPage = readFileSync(join(process.cwd(), 'src/pages/en/blog/[slug].astro'), 'utf8');
const blogCard = readFileSync(join(process.cwd(), 'src/components/BlogCard.astro'), 'utf8');
const audioToggle = readFileSync(join(process.cwd(), 'src/components/AudioToggle.astro'), 'utf8');

describe('blog audio', () => {
  it('exposes the German recording for the first blog article', () => {
    expect(getBlogAudioPath('DE', 'ki-agenten-betriebssystem'))
      .toBe('/audio/blog/de_ki-agenten-betriebssystem.m4a');
  });

  it('exposes the English recording for the translated article', () => {
    expect(getBlogAudioPath('EN', 'ai-agent-operating-system'))
      .toBe('/audio/blog/en_ai-agent-operating-system.m4a');
  });

  it('does not expose an audio control when no recording exists', () => {
    expect(getBlogAudioPath('EN', 'bots-working-at-night')).toBeUndefined();
  });

  it.each([
    ['German', germanBlogPage, 'Audio-Zusammenfassung', 'Wiedergabe pausieren'],
    ['English', englishBlogPage, 'Audio-Summary', 'Pause playback'],
  ])('renders the shared %s audio toggle with localised labels', (_, page, playLabel, pauseLabel) => {
    expect(page).toContain('<AudioToggle');
    expect(page).toContain(`playLabel="${playLabel}"`);
    expect(page).toContain(`pauseLabel="${pauseLabel}"`);
    expect(page).toContain('{audioSrc && (');
  });

  it('renders the audio summary control on cards only when an audio file exists', () => {
    expect(blogCard).toContain("const audioSrc = getBlogAudioPath(lang, slug)");
    expect(blogCard).toContain('<AudioToggle');
    expect(blogCard).toContain('variant="card"');
    expect(blogCard).toContain('{audioSrc && (');
    expect(blogCard).toContain("lang === 'EN' ? 'Audio-Summary' : 'Audio-Zusammenfassung'");
    expect(blogCard).toContain("lang === 'EN' ? 'Pause playback' : 'Wiedergabe pausieren'");
  });

  it('keeps a single accessible player implementation in the shared component', () => {
    expect(audioToggle).toContain('data-audio-toggle');
    expect(audioToggle).toContain('data-audio-target');
    expect(audioToggle).toContain('data-play-label');
    expect(audioToggle).toContain('data-pause-label');
    expect(audioToggle).toContain('audio.play()');
    expect(audioToggle).toContain('border-radius: var(--radius-full)');
  });

  it('guards the shared toggle against double-binding', () => {
    expect(audioToggle).toContain("button.dataset.audioInit === 'true'");
  });

  it('pauses other recordings when a new one starts', () => {
    expect(audioToggle).toContain('data-audio-player');
    expect(audioToggle).toContain('other.pause()');
  });
});
