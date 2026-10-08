/**
 * Astro content loaders for bumbleflies.de redesign.
 *
 * Provides a custom NestedText loader that reads `.nt` files from the
 * content directory and loads them into Astro's Content Layer.
 *
 * Requires Astro 5.0+ (Content Layer API).
 * See: https://docs.astro.build/en/reference/content-loader-reference/
 */

import fs from 'fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';
import { parseNestedText } from './nestedtext.js';

// ── Boolean coercion helper ───────────────────────────────────────────────────

/**
 * Wraps a Zod schema with a preprocessor that coerces string "true"/"false"
 * to boolean. NestedText stores all values as strings; Zod schemas expect
 * typed booleans.
 */
function boolCoerce<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess(
    (v) => (v === 'true' ? true : v === 'false' ? false : v),
    schema,
  );
}

// ── Coerced pages schema ──────────────────────────────────────────────────────

/**
 * Mirrors the `pages` collection schema from `src/content/config.ts` with
 * added string-to-boolean coercion for boolean fields.
 *
 * Arrays of objects (services, steps, comparisonRows) contain only string
 * leaf values in NestedText format and require no coercion — they pass
 * through z.string() validators unchanged.
 *
 * Field parity with config.ts pages schema (lines 38–89).
 */
export const pagesSchemaCoerced = z.object({
  title: z.string(),
  published: boolCoerce(z.boolean().default(true)),

  // Flexible fields for different page types
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  intro: z.string().optional(),

  // For homepage services/formats
  services: z
    .array(
      z.object({
        number: z.string(),
        title: z.string(),
        tag: z.string(),
        description: z.string(),
        bullets: z.array(z.string()),
        formats: z.array(
          z.object({
            kind: z.string(),
            label: z.string(),
          }),
        ),
      }),
    )
    .optional(),

  // For process/steps pages
  steps: z
    .array(
      z.object({
        number: z.string(),
        title: z.string(),
        description: z.string(),
      }),
    )
    .optional(),

  // For the Open Space principles sequence page
  principles: z
    .array(
      z.object({
        number: z.string(),
        title: z.string(),
        quote: z.string(),
        image: z.string(),
      }),
    )
    .optional(),

  // For comparison/why pages
  comparisonRows: z
    .array(
      z.object({
        label: z.string(),
        fragmented: z.string(),
        integrated: z.string(),
      }),
    )
    .optional(),

  // For how-we-work pages
  problemTitle: z.string().optional(),
  problemBullets: z.array(z.string()).optional(),
  solutionTitle: z.string().optional(),
  solutionBullets: z.array(z.string()).optional(),

  // For CTAs
  ctaHeading: z.string().optional(),
  ctaHeading_em: z.string().optional(),
  ctaBody: z.string().optional(),
  ctaText: z.string().optional(),
  cta: z
    .object({
      text: z.string(),
      link: z.string(),
    })
    .optional(),

  // For quotes
  quote: z.string().optional(),
  quoteCite: z.string().optional(),

  // Legal page language indicator
  lang: z.string().optional(),
});

// ── Loader options ────────────────────────────────────────────────────────────

export interface NestedTextLoaderOptions {
  /**
   * Directory to scan for `.nt` files, relative to the Astro project root.
   * @default 'src/content/pages'
   */
  directory?: string;
  /**
   * Glob pattern for file matching (informational; filtering is by extension).
   * @default '**\/*.nt'
   */
  pattern?: string;
}

// ── Loader factory ────────────────────────────────────────────────────────────

/**
 * Creates an Astro Content Layer loader that reads `.nt` (NestedText) files.
 *
 * Each file becomes one collection entry. The entry ID is the file path
 * relative to the content directory with the `.nt` extension removed and
 * path separators normalised to forward slashes.
 *
 * Example: `src/content/pages/en/home.nt` → id `"en/home"`
 *
 * @param options - Optional directory and pattern configuration.
 * @returns An Astro `Loader` object (plain object literal, no defineLoader).
 */
export function nestedTextLoader(options: NestedTextLoaderOptions = {}): Loader {
  const {
    directory = 'src/content/pages',
    pattern = '**/*.nt',
  } = options;

  // Suppress unused-variable warning for pattern (reserved for future glob filtering)
  void pattern;

  return {
    name: 'nestedtext-loader',

    async load(context): Promise<void> {
      // context.config.root is a URL object — convert to filesystem path
      const projectRoot = fileURLToPath(context.config.root);
      const resolvedDir = path.join(projectRoot, directory);

      // Read all entries in the directory tree
      let allEntries: string[];
      try {
        allEntries = await fs.readdir(resolvedDir, { recursive: true });
      } catch (err) {
        context.logger.error(
          `[nestedtext-loader] Cannot read directory "${resolvedDir}": ${String(err)}`,
        );
        return;
      }

      // Filter to .nt files only
      const ntFiles = allEntries.filter((entry) => entry.endsWith('.nt'));

      for (const relativeEntry of ntFiles) {
        const absPath = path.join(resolvedDir, relativeEntry);

        try {
          // Derive entry ID: path relative to content dir, no extension,
          // forward slashes for cross-platform consistency (e.g., "en/home")
          const id = relativeEntry
            .replace(/\.nt$/, '')
            .replace(/\\/g, '/');

          // Read file and parse NestedText format
          const rawContent = await fs.readFile(absPath, 'utf-8');
          const { data, body } = parseNestedText(rawContent);

          // Validate and coerce data through the collection's Zod schema
          const validated = await context.parseData({ id, data });

          // Store entry in the content layer
          context.store.set({
            id,
            data: validated,
            body,
            filePath: path.relative(projectRoot, absPath).replace(/\\/g, '/'),
          });

          // Register file watcher in dev mode for HMR
          context.watcher?.add(absPath);
        } catch (err) {
          context.logger.error(
            `[nestedtext-loader] Failed to load "${absPath}": ${String(err)}`,
          );
          // Per-file errors are logged and skipped; processing continues
        }
      }
    },
  };
}
