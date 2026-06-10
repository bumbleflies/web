import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { spawn, ChildProcess } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PageTest {
  deUrl: string;
  enUrl: string;
  deName: string;
  enName: string;
  deContent: string;
  enContent: string;
}

const BASE_URL = 'http://localhost:3000';
const DEV_SERVER_PORT = 3000;
let devServer: ChildProcess | null = null;
let serverReady = false;

// Extract content from Astro file for spot-checking
function extractSpotCheckContent(filePath: string, lang: 'DE' | 'EN'): string | null {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');

  // Find the content object - DE files have "DE: {" inside Record, EN files start with "const content:"
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

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

      if (deContent && enContent && deContent !== enContent) {
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

// Start dev server
async function startDevServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    devServer = spawn('npx', ['astro', 'dev'], {
      cwd: path.join(__dirname, '..'),
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const handleOutput = (data: Buffer) => {
      const output = data.toString();
      // Watch for "ready in" message indicating server is ready
      if (output.includes('ready in') || output.includes('Local')) {
        if (!serverReady) {
          serverReady = true;
          resolve();
        }
      }
    };

    devServer!.stdout?.on('data', handleOutput);
    devServer!.stderr?.on('data', handleOutput);

    // Timeout after 60 seconds
    setTimeout(() => {
      if (!serverReady) {
        reject(new Error('Dev server failed to start within 60 seconds'));
      }
    }, 60000);
  });
}

// Check if server is responsive
async function waitForServer(): Promise<void> {
  const maxAttempts = 20;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`${BASE_URL}/`);
      if (response.ok) {
        return;
      }
    } catch {
      // Server not ready yet
    }
    attempts++;
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  throw new Error('Server did not become responsive within 10 seconds');
}

// Fetch page content
async function fetchPageContent(url: string): Promise<string> {
  const response = await fetch(`${BASE_URL}${url}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

describe('Bilingual Content Rendering', () => {
  beforeAll(async () => {
    console.log(`\n📄 Testing ${pagePairs.length} bilingual page pairs\n`);
    pagePairs.forEach(p => {
      console.log(`   DE: ${p.deUrl} | EN: ${p.enUrl}`);
    });
    console.log('');

    await startDevServer();
    await waitForServer();
  });

  afterAll(() => {
    if (devServer) {
      devServer.kill();
    }
  });

  // Create a test for each discovered page pair
  pagePairs.forEach(({ deUrl, enUrl, deName, enName, deContent, enContent }) => {
    it(`${deName}: German page renders German content`, async () => {
      const html = await fetchPageContent(deUrl);
      expect(html).toContain(deContent);
    });

    it(`${enName}: English page renders English content`, async () => {
      const html = await fetchPageContent(enUrl);
      expect(html).toContain(enContent);
    });
  });
});
