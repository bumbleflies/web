import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Integration test: Verify German pages render German content and English pages render English.
 * Dynamically discovers pages and spot-checks one piece of content per page.
 */

interface PageTest {
  deUrl: string;
  enUrl: string;
  deName: string;
  enName: string;
  deContent: string;
  enContent: string;
}

// Extract content from Astro file for spot-checking
// Returns a language-specific string that distinguishes this page
function extractSpotCheckContent(filePath: string, lang: 'DE' | 'EN'): string | null {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');

  // Find the content object - DE files have "DE: {" inside Record, EN files start with "const content:"
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // For DE files, look for "DE: {" marker
    // For EN files, look for "const content:" that is NOT a Record type
    const isDEMarker = lang === 'DE' && line.includes('DE: {');
    const isENMarker = lang === 'EN' && line.includes('const content:') && !line.includes('Record');

    if (isDEMarker || isENMarker) {
      // Look for first substantial string in this block
      for (let j = i + 1; j < Math.min(i + 50, lines.length); j++) {
        const contentLine = lines[j];

        // Stop if we reach the end of this block
        if (contentLine.trim() === '},' || contentLine.trim() === '};') {
          break;
        }

        // Extract string values - grab first meaningful one (>15 chars)
        const match = contentLine.match(/['""]([^'"]+)['"]/);
        if (match) {
          const extractedText = match[1].trim();
          if (extractedText.length > 15) {
            return extractedText;
          }
        }
      }
    }
  }

  return null;
}

// Discover all page files and create test pairs
function discoverPagePairs(): PageTest[] {
  const pagesDir = path.join(__dirname, '../src/pages');
  const pairs: PageTest[] = [];
  const processed = new Set<string>();

  // Find all German pages first
  const germanPages = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.astro') && !f.includes('['))
    .map(f => ({ name: f, path: path.join(pagesDir, f) }));

  for (const germanPage of germanPages) {
    const pageName = germanPage.name.replace('.astro', '');
    if (processed.has(pageName)) continue;
    processed.add(pageName);

    // Find corresponding English page
    const enPagePath = path.join(pagesDir, 'en', germanPage.name);

    if (fs.existsSync(enPagePath)) {
      const deContent = extractSpotCheckContent(germanPage.path, 'DE');
      const enContent = extractSpotCheckContent(enPagePath, 'EN');

      if (deContent && enContent) {
        // Map file names to URLs
        let deUrl = `/${pageName === 'index' ? '' : pageName}`;
        let enUrl = `/en/${pageName === 'index' ? '' : pageName}`;

        pairs.push({
          deUrl,
          enUrl,
          deName: pageName,
          enName: `en/${pageName}`,
          deContent,
          enContent
        });
      }
    }
  }

  return pairs;
}

// Get all page pairs
const pagePairs = discoverPagePairs();

test.describe('Bilingual Page Rendering', () => {
  test.beforeAll(() => {
    console.log(`\n📄 Discovered ${pagePairs.length} bilingual page pairs for testing`);
    pagePairs.forEach(p => {
      console.log(`   DE: ${p.deUrl} | EN: ${p.enUrl}`);
    });
  });

  // Create a test for each discovered page pair
  pagePairs.forEach(({ deUrl, enUrl, deName, enName, deContent, enContent }) => {
    test(`${deName}: German page renders German content`, async ({ page }) => {
      await page.goto(`http://localhost:3000${deUrl}`);

      // Check that German content is visible
      const bodyText = await page.textContent('body');
      expect(bodyText).toContain(deContent);
    });

    test(`${enName}: English page renders English content`, async ({ page }) => {
      await page.goto(`http://localhost:3000${enUrl}`);

      // Check that English content is visible
      const bodyText = await page.textContent('body');
      expect(bodyText).toContain(enContent);
    });
  });
});
