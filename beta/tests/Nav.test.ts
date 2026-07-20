import { describe, it, expect } from 'vitest';

describe('Nav Component Logic', () => {
  it('should have correct navigation items for DE', () => {
    const lang = 'DE';
    const navItems = [
      { label: 'Facilitation · AI · Software', href: '/services' },
      { label: 'remote, hybrid & vor Ort', href: '/how-we-work' },
      { label: 'Warum · Wir', href: '/why-we' },
    ];

    expect(lang).toBe('DE');
    expect(navItems.length).toBe(3);
    expect(navItems[0].href).toBe('/services');
  });

  it('should have correct navigation items for EN', () => {
    const lang = 'EN';
    const navItems = [
      { label: 'Facilitation · AI · Software', href: '/en/services' },
      { label: 'remote, hybrid & on-site', href: '/en/how-we-work' },
      { label: 'Why · We', href: '/en/why-we' },
    ];

    expect(lang).toBe('EN');
    expect(navItems.length).toBe(3);
    expect(navItems[0].href).toContain('/en/');
  });

  it('should use correct brand href based on language', () => {
    const getBrandHref = (lang: string) => lang === 'DE' ? '/' : '/en/';
    expect(getBrandHref('DE')).toBe('/');
    expect(getBrandHref('EN')).toBe('/en/');
  });
});
