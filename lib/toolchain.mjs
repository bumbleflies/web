#!/usr/bin/env node
/**
 * Guard for the type-check toolchain.
 *
 * `npm run typecheck` runs plain `tsc` with `--runExternalCode`, because
 * @astrojs/ts-content-mapper type-checks .astro files through TypeScript's
 * content-mapper API. That flag (and the API) exist from TypeScript 7.1 on —
 * `astro check` is not an alternative, it refuses TypeScript 7 altogether.
 *
 * A stale node_modules therefore fails with a cryptic
 *   error TS5023: Unknown compiler option '--runExternalCode'
 * that looks like a code problem but is an install problem. Fail loudly
 * instead, with the fix.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const MIN_MAJOR = 7;
export const MIN_MINOR = 1;

/** True when a TypeScript version string supports content mappers. */
export function supportsContentMappers(version) {
  // "7.1.0-beta", "7.1.0-dev.20261030.1", "8.0.0" -> [major, minor]
  const match = /^(\d+)\.(\d+)\./.exec(String(version).trim());
  if (!match) return false;
  const major = Number(match[1]);
  const minor = Number(match[2]);
  return major > MIN_MAJOR || (major === MIN_MAJOR && minor >= MIN_MINOR);
}

function installedTypeScriptVersion() {
  const here = dirname(fileURLToPath(import.meta.url));
  const pkgPath = join(here, '..', 'node_modules', 'typescript', 'package.json');
  try {
    return JSON.parse(readFileSync(pkgPath, 'utf-8')).version;
  } catch {
    return null;
  }
}

function main() {
  const version = installedTypeScriptVersion();
  if (version && supportsContentMappers(version)) return;

  const found = version ? `TypeScript ${version}` : 'no TypeScript in node_modules';
  console.error(
    [
      '',
      `✖ Type check needs TypeScript >= ${MIN_MAJOR}.${MIN_MINOR} (found: ${found}).`,
      '  The installed tree does not match package-lock.json.',
      '',
      '  Fix: npm ci',
      '',
      '  CI always runs `npm ci`, so a green CI with a red local typecheck',
      '  means a stale node_modules, not a code problem.',
      '',
    ].join('\n'),
  );
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
