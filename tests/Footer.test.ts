import { describe, it, expect } from 'vitest';
import { getFooterContent } from '../src/lib/footerContent';

describe('Footer Component Logic', () => {
  it('should render the correct current year', () => {
    const year = new Date().getFullYear();
    expect(year).toBeGreaterThanOrEqual(2025);
  });

  it('should provide DE content when lang is DE', () => {
    const content = getFooterContent('DE');
    expect(content.legal[0]).toBe('Impressum');
  });

  it('should provide EN content when lang is EN', () => {
    const content = getFooterContent('EN');
    expect(content.legal[0]).toBe('Imprint');
  });

  describe('Contact Links', () => {
    it('should have valid contact link URLs', () => {
      const items = getFooterContent('DE').contact.items;
      const byLabel = (label: string) => items.find((i) => i.label === label)!;

      // Validate email format
      expect(byLabel('info@bumbleflies.de').href).toMatch(
        /^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      );

      // Validate HTTPS URLs and their specific destinations
      expect(byLabel('LinkedIn').href).toBe('https://de.linkedin.com/company/bumbleflies');
      expect(byLabel('Mastodon').href).toBe('https://social.bumbleflies.de');
      expect(byLabel('GitHub').href).toBe('https://github.com/bumbleflies');

      for (const label of ['LinkedIn', 'Mastodon', 'GitHub']) {
        expect(byLabel(label).href).toMatch(/^https:\/\//);
      }
    });

    it('should expose the same contact items for both DE and EN', () => {
      const expected = [
        { label: 'info@bumbleflies.de', href: 'mailto:info@bumbleflies.de' },
        { label: 'LinkedIn', href: 'https://de.linkedin.com/company/bumbleflies' },
        { label: 'Mastodon', href: 'https://social.bumbleflies.de' },
        { label: 'GitHub', href: 'https://github.com/bumbleflies' },
      ];

      expect(getFooterContent('DE').contact.items).toEqual(expected);
      expect(getFooterContent('EN').contact.items).toEqual(expected);
    });
  });

  describe('Learn Links', () => {
    it('should link to the Open Space principles page (DE)', () => {
      const item = getFooterContent('DE').learn.items.find(
        (i) => i.label === 'Open Space Prinzipien',
      );
      expect(item?.href).toBe('/open-space');
    });

    it('should link to the Open Space principles page (EN)', () => {
      const item = getFooterContent('EN').learn.items.find(
        (i) => i.label === 'Open Space Principles',
      );
      expect(item?.href).toBe('/en/open-space');
    });

    it('should link to bumble:education for kids courses (DE)', () => {
      const item = getFooterContent('DE').learn.items.find(
        (i) => i.label === 'Kurse für Kinder',
      );
      expect(item?.href).toBe('https://edu.bumbleflies.de/');
    });

    it('should link to bumble:education for kids courses (EN)', () => {
      const item = getFooterContent('EN').learn.items.find(
        (i) => i.label === 'Coding for Kids',
      );
      expect(item?.href).toBe('https://edu.bumbleflies.de/');
    });
  });
});
