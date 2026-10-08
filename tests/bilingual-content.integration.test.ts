import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { spawn, execSync, ChildProcess } from 'child_process';

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

  let longestString = '';

  // Find the content object - DE files have "DE: {" inside Record, EN files start with "const content:"
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const isDEMarker = lang === 'DE' && line.includes('DE: {');
    const isENMarker = lang === 'EN' && line.includes('const content:') && !line.includes('Record');

    if (isDEMarker || isENMarker) {
      // Extract all strings in this language block and find the longest
      for (let j = i + 1; j < Math.min(i + 50, lines.length); j++) {
        const contentLine = lines[j];

        // Stop if we reach the end of this block
        if (contentLine.trim() === '},' || contentLine.trim() === '};') {
          break;
        }

        // Extract all string values
        const match = contentLine.match(/['""]([^'"]+)['"]/);
        if (match) {
          const extractedText = match[1].trim();
          // Keep track of the longest non-generic string
          if (extractedText.length > longestString.length && extractedText.length > 15) {
            longestString = extractedText;
          }
        }
      }
      break;
    }
  }

  // Normalize for HTML matching
  // Remove trailing ellipsis which might not render exactly the same
  longestString = longestString.replace(/\s*\.\.\.\s*$/g, '');

  // If string contains '&', find a good split point before it
  // since '&' becomes '&amp;' in HTML and breaks substring matching
  const ampIndex = longestString.indexOf('&');
  if (ampIndex > 20) {
    // Use content up to the ampersand (it will be more stable)
    longestString = longestString.substring(0, ampIndex).trim();
  }

  return longestString || null;
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

// Start dev server (Astro 7 runs `astro dev` as a background daemon:
// the spawned process prints "Dev server running at ..." and exits,
// while "ready in" only appears in `astro dev logs`.)
async function startDevServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Astro's dev server skips registering its page-serving middleware when
    // `process.env.VITEST` is set (see astro's vite-plugin-astro-server), which
    // would make every route return 404. Since we run a *real* dev server as a
    // child process here, strip VITEST from its environment so pages render.
    const devServerEnv = { ...process.env };
    delete devServerEnv.VITEST;

    devServer = spawn('npx', ['astro', 'dev', '--port', String(DEV_SERVER_PORT)], {
      cwd: path.join(__dirname, '..'),
      stdio: ['ignore', 'pipe', 'pipe'],
      env: devServerEnv,
    });

    const handleOutput = (data: Buffer) => {
      const output = data.toString();
      // Astro 6: "ready in ... / Local http://...".
      // Astro 7 daemon: "Dev server running at http://localhost:3000 ..." or
      // "Dev server already running at http://localhost:3000 ...".
      if (
        output.includes('ready in') ||
        output.includes('Local') ||
        output.includes('Dev server running') ||
        output.includes('already running') ||
        output.includes(`localhost:${DEV_SERVER_PORT}`)
      ) {
        if (!serverReady) {
          serverReady = true;
          resolve();
        }
      }
    };

    devServer!.stdout?.on('data', handleOutput);
    devServer!.stderr?.on('data', handleOutput);
    devServer!.on('error', (err) => {
      if (!serverReady) {
        reject(err);
      }
    });
    // The daemonizing child may exit(0) right after starting the background
    // server — that is success, not failure. Fall through to HTTP polling.
    devServer!.on('exit', () => {
      pollHttp();
    });

    let pollTimer: NodeJS.Timeout | null = null;
    const pollHttp = () => {
      if (serverReady) return;
      fetch(`${BASE_URL}/`)
        .then((res) => {
          if (res.ok && !serverReady) {
            serverReady = true;
            if (pollTimer) clearInterval(pollTimer);
            resolve();
          }
        })
        .catch(() => {
          // Not up yet — keep polling until timeout below fires.
        });
    };
    pollTimer = setInterval(pollHttp, 500);
    // Kick off one immediate attempt in case the server is already up.
    pollHttp();

    // Timeout after 60 seconds
    setTimeout(() => {
      if (pollTimer) clearInterval(pollTimer);
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
      devServer = null;
    }
    // Astro 7 daemonizes `astro dev` — kill the background server too so
    // subsequent runs (or CI steps) don't hit a stale :3000.
    try {
      execSync('npx astro dev stop', {
        cwd: path.join(__dirname, '..'),
        stdio: 'ignore',
      });
    } catch {
      // Best-effort cleanup — a missing/stopped server is fine.
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
