import { describe, expect, it } from 'vitest';
import { getLanguageTogglePath } from '../src/lib/language-toggle';

describe('language toggle paths', () => {
  const dePath = '/blog/ki-agenten-betriebssystem';
  const enPath = '/en/blog/ai-agent-operating-system';

  it('uses the explicit English translation when slugs differ', () => {
    expect(getLanguageTogglePath({
      clickedLanguage: 'EN',
      currentPath: dePath,
      dePath,
      enPath,
    })).toBe(enPath);
  });

  it('uses the explicit German translation when slugs differ', () => {
    expect(getLanguageTogglePath({
      clickedLanguage: 'DE',
      currentPath: enPath,
      dePath,
      enPath,
    })).toBe(dePath);
  });

  it('keeps working for pages with matching slugs', () => {
    expect(getLanguageTogglePath({
      clickedLanguage: 'EN',
      currentPath: '/services',
      dePath: '/services',
      enPath: '/en/services',
    })).toBe('/en/services');
  });

  it('falls back to the legacy path rule when no translation is declared', () => {
    expect(getLanguageTogglePath({
      clickedLanguage: 'EN',
      currentPath: '/case-studies/example',
    })).toBe('/en/case-studies/example');
  });
});
