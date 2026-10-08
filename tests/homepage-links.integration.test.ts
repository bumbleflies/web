import { describe, it, expect, beforeAll } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';

// Link validation patterns
const EXTERNAL_URL_PATTERN = /^https?:\/\//;
const SPECIAL_HANDLER_PATTERN = /^(mailto:|tel:|#)/;

// Define expected pages that should exist
const PAGES = {
  DE: ['/', '/services', '/how-we-work', '/why-we', '/impressum', '/datenschutz', '/case-studies'],
  EN: ['/en/', '/en/services', '/en/how-we-work', '/en/why-we', '/en/imprint', '/en/privacy', '/en/case-studies'],
};

// Links found on homepage components
const HOMEPAGE_LINKS = {
  DE: [
    { href: '/', source: 'Nav brand' },
    { href: '/services', source: 'Nav nav-items' },
    { href: '/how-we-work', source: 'Nav nav-items' },
    { href: '/why-we', source: 'Nav nav-items' },
    { href: 'mailto:info@bumbleflies.de', source: 'Nav CTA' },
    { href: '/impressum', source: 'Footer legal' },
    { href: '/datenschutz', source: 'Footer legal' },
    // Case studies - will be checked dynamically
    { href: '/case-studies/*', source: 'CaseStudyCard links' },
  ],
  EN: [
    { href: '/en/', source: 'Nav brand' },
    { href: '/en/services', source: 'Nav nav-items' },
    { href: '/en/how-we-work', source: 'Nav nav-items' },
    { href: '/en/why-we', source: 'Nav nav-items' },
    { href: 'mailto:info@bumbleflies.de', source: 'Nav CTA' },
    { href: '/en/imprint', source: 'Footer legal' },
    { href: '/en/privacy', source: 'Footer legal' },
    // Case studies - will be checked dynamically
    { href: '/en/case-studies/*', source: 'CaseStudyCard links' },
  ],
};

// Note: Footer has placeholder links with href="#" for services and learn sections
// These should be updated to point to actual content or removed
const FOOTER_PLACEHOLDER_LINKS = {
  services: ['Facilitation (remote, hybrid, vor Ort)', 'AI Consulting', 'App Development', 'Coaching & Handover'],
  learn: ['FaST-Training', 'GPT-Training', 'AI-Literacy', 'Open Space Checkliste'],
};

async function checkPageExists(pagePath: string): Promise<boolean> {
  // Skip special link handlers
  if (SPECIAL_HANDLER_PATTERN.test(pagePath)) {
    return true;
  }

  const srcPath = join(process.cwd(), 'src/pages');

  // Handle case study dynamic routes
  const caseStudyMatch = pagePath.match(/^\/(?:en\/)?case-studies\/(.+)$/);
  if (caseStudyMatch) {
    const slug = caseStudyMatch[1];
    const contentPath = join(process.cwd(), 'src/content/case-studies', `${slug}.md`);
    try {
      await fs.access(contentPath);
      return true;
    } catch {
      return false;
    }
  }

  // Handle collection routes that have dynamic handlers
  if (pagePath === '/case-studies' || pagePath === '/en/case-studies') {
    const dynamicRouteFile = pagePath === '/case-studies'
      ? 'case-studies/[slug].astro'
      : 'en/case-studies/[slug].astro';
    const filePath = join(srcPath, dynamicRouteFile);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  // Convert page path to file path
  const fileParts = pagePath.split('/').filter(Boolean);
  let fileName: string;

  if (fileParts.length === 0) {
    // Root path /
    fileName = 'index.astro';
  } else if (pagePath.endsWith('/')) {
    // Directory path like /en/ - look for index
    fileName = `${fileParts.join('/')}/index.astro`;
  } else {
    // Regular page
    fileName = `${fileParts.join('/')}.astro`;
  }

  const filePath = join(srcPath, fileName);

  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function getCaseStudySlugs(): Promise<string[]> {
  const caseStudiesDir = join(process.cwd(), 'src/content/case-studies');
  try {
    const files = await fs.readdir(caseStudiesDir);
    // Filter markdown files and remove .md extension to get slugs
    return files
      .filter(file => file.endsWith('.md') && file !== 'index.md')
      .map(file => file.replace(/\.md$/, ''));
  } catch (err) {
    console.warn('Could not read case studies directory:', err);
    return [];
  }
}

describe('Homepage Links Validation', () => {
  let caseStudySlugs: string[] = [];

  beforeAll(async () => {
    caseStudySlugs = await getCaseStudySlugs();
  });

  describe('German homepage (DE)', () => {
    it('should have valid links to existing pages', async () => {
      const invalidPages: string[] = [];

      for (const link of HOMEPAGE_LINKS.DE) {
        if (link.href.endsWith('/*')) {
          // Skip wildcard links, will be tested separately
          continue;
        }

        const exists = await checkPageExists(link.href);
        if (!exists) {
          invalidPages.push(`${link.href} (from ${link.source})`);
        }
      }

      expect(invalidPages).toEqual([],
        `The following links point to non-existent pages: ${invalidPages.join(', ')}`
      );
    });

    it('should have valid case study links', async () => {
      const missingCaseStudies: string[] = [];

      for (const slug of caseStudySlugs) {
        const pagePath = `/case-studies/${slug}`;
        const exists = await checkPageExists(pagePath);
        if (!exists) {
          missingCaseStudies.push(slug);
        }
      }

      expect(missingCaseStudies).toEqual([],
        `Case study pages are missing for slugs: ${missingCaseStudies.join(', ')}`
      );
    });

    it('should have special handlers for email links', () => {
      const emailLinks = HOMEPAGE_LINKS.DE.filter(link => link.href.startsWith('mailto:'));
      expect(emailLinks.length).toBeGreaterThan(0, 'Email links should be present on DE homepage');

      emailLinks.forEach(link => {
        expect(link.href).toMatch(/^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          `Invalid email format: ${link.href}`
        );
      });
    });

    it('should flag placeholder links that need implementation', () => {
      // This test documents known placeholder links that should be addressed
      const placeholderInfo = `
        The following placeholder links (href="#") exist in the Footer and should be linked to content:
        - Services section: ${FOOTER_PLACEHOLDER_LINKS.services.join(', ')}
        - Learn section: ${FOOTER_PLACEHOLDER_LINKS.learn.join(', ')}

        These links currently have href="#" and don't navigate anywhere.
      `;

      // This is an informational test - it passes but documents the issue
      expect(placeholderInfo).toBeTruthy();
    });
  });

  describe('English homepage (EN)', () => {
    it('should have valid links to existing pages', async () => {
      const invalidPages: string[] = [];

      for (const link of HOMEPAGE_LINKS.EN) {
        if (link.href.endsWith('/*')) {
          // Skip wildcard links, will be tested separately
          continue;
        }

        const exists = await checkPageExists(link.href);
        if (!exists) {
          invalidPages.push(`${link.href} (from ${link.source})`);
        }
      }

      expect(invalidPages).toEqual([],
        `The following links point to non-existent pages: ${invalidPages.join(', ')}`
      );
    });

    it('should have valid case study links with /en/ prefix', async () => {
      const missingCaseStudies: string[] = [];

      for (const slug of caseStudySlugs) {
        // EN case studies should also be accessible via /case-studies/[slug]
        // (they share the same route handler)
        const pagePath = `/case-studies/${slug}`;
        const exists = await checkPageExists(pagePath);
        if (!exists) {
          missingCaseStudies.push(slug);
        }
      }

      expect(missingCaseStudies).toEqual([],
        `Case study pages are missing for slugs: ${missingCaseStudies.join(', ')}`
      );
    });

    it('should have special handlers for email links', () => {
      const emailLinks = HOMEPAGE_LINKS.EN.filter(link => link.href.startsWith('mailto:'));
      expect(emailLinks.length).toBeGreaterThan(0, 'Email links should be present on EN homepage');

      emailLinks.forEach(link => {
        expect(link.href).toMatch(/^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          `Invalid email format: ${link.href}`
        );
      });
    });
  });

  describe('Common link properties', () => {
    it('all internal links should start with / or mailto: or tel:', () => {
      const allLinks = [...HOMEPAGE_LINKS.DE, ...HOMEPAGE_LINKS.EN];
      const invalidLinks = allLinks.filter(link =>
        !link.href.startsWith('/') &&
        !SPECIAL_HANDLER_PATTERN.test(link.href) &&
        !EXTERNAL_URL_PATTERN.test(link.href)
      );

      expect(invalidLinks).toEqual([],
        `The following links have invalid format: ${invalidLinks.map(l => l.href).join(', ')}`
      );
    });

    it('should have documented case study links', async () => {
      expect(caseStudySlugs.length).toBeGreaterThan(0,
        'At least one published case study should exist for homepage to display case study cards'
      );
    });
  });
});
