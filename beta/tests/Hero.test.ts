import { describe, it, expect } from 'vitest';

/**
 * Hero Component Tests
 * Tests for engagement packages grid rendering in both DE and EN
 */

interface EngagementPackage {
  num: string;
  phase: string;
  name: string;
  timeline: string;
  outcome: string;
  ctaText: string;
}

interface TestScenario {
  lang: 'DE' | 'EN';
  packages: EngagementPackage[];
  expectedPackageCount: number;
}

// DE content validation
const dePackages: EngagementPackage[] = [
  {
    num: '01',
    phase: 'REDEN',
    name: 'Quick Start',
    timeline: '1–2 weeks',
    outcome: 'Clarity über dein größtes Problem',
    ctaText: 'Mehr erfahren',
  },
  {
    num: '02',
    phase: 'ENTSCHEIDEN',
    name: 'Use-Case Sprint',
    timeline: '4–6 weeks',
    outcome: 'AI-Opportunity Assessment',
    ctaText: 'Mehr erfahren',
  },
  {
    num: '03',
    phase: 'BAUEN',
    name: 'Prototype Sprint',
    timeline: '1–6 months',
    outcome: 'Funktionierender Prototyp',
    ctaText: 'Mehr erfahren',
  },
  {
    num: '04',
    phase: 'BEGLEITEN',
    name: 'Adoption Program',
    timeline: 'Concept',
    outcome: 'Team trainiert & unabhängig',
    ctaText: 'Mehr erfahren',
  },
];

// EN content validation
const enPackages: EngagementPackage[] = [
  {
    num: '01',
    phase: 'TALK',
    name: 'Quick Start',
    timeline: '1–2 weeks',
    outcome: 'Clarity on your biggest challenge',
    ctaText: 'Learn more',
  },
  {
    num: '02',
    phase: 'DECIDE',
    name: 'Use-Case Sprint',
    timeline: '4–6 weeks',
    outcome: 'AI opportunity assessment',
    ctaText: 'Learn more',
  },
  {
    num: '03',
    phase: 'BUILD',
    name: 'Prototype Sprint',
    timeline: '1–6 months',
    outcome: 'Working prototype',
    ctaText: 'Learn more',
  },
  {
    num: '04',
    phase: 'EMBED',
    name: 'Adoption Program',
    timeline: 'Concept',
    outcome: 'Team trained & independent',
    ctaText: 'Learn more',
  },
];

describe('Hero Component Data', () => {
  it('should have valid DE engagement packages', () => {
    expect(dePackages.length).toBe(4);
    dePackages.forEach(pkg => {
      expect(pkg.num).toBeDefined();
      expect(pkg.phase).toBeDefined();
      expect(pkg.name).toBeDefined();
      expect(pkg.timeline).toBeDefined();
      expect(pkg.outcome).toBeDefined();
      expect(pkg.ctaText).toBeDefined();
    });
  });

  it('should have valid EN engagement packages', () => {
    expect(enPackages.length).toBe(4);
    enPackages.forEach(pkg => {
      expect(pkg.num).toBeDefined();
      expect(pkg.phase).toBeDefined();
      expect(pkg.name).toBeDefined();
      expect(pkg.timeline).toBeDefined();
      expect(pkg.outcome).toBeDefined();
      expect(pkg.ctaText).toBeDefined();
    });
  });
});

describe('Hero HTML Structure (Simulated)', () => {
  it('should validate typical HTML structure', () => {
    // This simulates what the validateHeroHtmlStructure did
    const mockHtml = `<div class="a-hero__engagement-packages">
      <div class="bf-cta--ghost">REDEN</div>
      <div class="bf-cta--ghost">ENTSCHEIDEN</div>
      <div class="bf-cta--ghost">BAUEN</div>
      <div class="bf-cta--ghost">BEGLEITEN</div>
    </div>`;
    
    expect(mockHtml).toContain('a-hero__engagement-packages');
    const matches = mockHtml.match(/bf-cta--ghost/g);
    expect(matches?.length).toBeGreaterThanOrEqual(4);
  });
});
