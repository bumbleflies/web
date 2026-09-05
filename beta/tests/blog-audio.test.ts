import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getBlogAudioPath } from '../src/lib/blog-audio';

const germanBlogPage = readFileSync(join(process.cwd(), 'src/pages/blog/[slug].astro'), 'utf8');
const englishBlogPage = readFileSync(join(process.cwd(), 'src/pages/en/blog/[slug].astro'), 'utf8');
const blogCard = readFileSync(join(process.cwd(), 'src/components/BlogCard.astro'), 'utf8');

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
    ['German', germanBlogPage, 'Audio-Zusammenfassung'],
    ['English', englishBlogPage, 'Audio-Summary'],
  ])('renders an accessible %s audio button with its label and play control', (_, page, label) => {
    expect(page).toContain('data-audio-toggle');
    expect(page).toContain('data-audio-target');
    expect(page).toContain(`<span>${label}</span>`);
    expect(page).toContain('audio.play()');
    expect(page).toContain('border-radius: var(--radius-full)');
  });

  it('renders the audio summary control on cards only when an audio file exists', () => {
    expect(blogCard).toContain("const audioSrc = getBlogAudioPath(lang, slug)");
    expect(blogCard).toContain('{audioSrc && (');
    expect(blogCard).toContain("lang === 'EN' ? 'Audio-Summary' : 'Audio-Zusammenfassung'");
  });

  it('localises the card pause label instead of hardcoding English', () => {
    expect(blogCard).toContain("lang === 'EN' ? 'Pause playback' : 'Wiedergabe pausieren'");
    expect(blogCard).toContain('data-play-label');
    expect(blogCard).toContain('data-pause-label');
    expect(blogCard).not.toContain("playing ? 'Pause playback' : button.title");
  });

  it('guards card audio buttons against double-binding', () => {
    expect(blogCard).toContain("button.dataset.audioInit === 'true'");
  });
});
