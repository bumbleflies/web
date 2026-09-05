# Blog — Field Notes publishing guide

Posts live here as Markdown, one file per language. Schema: `beta/src/content.config.ts` (`blog` collection).

## Frontmatter

Required: `title`, `description`, `excerpt`, `category`, `order`, `date`, `lang` (`DE`|`EN`). Optional: `image`, `author` (defaults to `bumbleflies`), `readingTime`. Draft switch: `published` (defaults to `false`).

Conventions:

- **Filename = URL slug.** `/blog/<slug>`, `/en/blog/<slug>`. Slugs may differ per language (e.g. `ki-agenten-betriebssystem` ↔ `ai-agent-operating-system`).
- **DE↔EN pairing is by `order`, not by slug.** The language toggle resolves the translation via matching `order` values (`translationSlug` in `src/pages/blog/[slug].astro`). Both language files must share the same `order`, or the toggle falls back to a guessed URL (404 for differing slugs).
- **Cover:** `/images/blog/<slug>.svg` (+ rasterized OG twin `/images/blog/og/<slug>.png` — social crawlers don't render SVG).
- **Audio (optional):** drop `beta/public/audio/blog/<de|en>_<slug>.m4a` next to the post; the `<AudioToggle>` player renders automatically via `getBlogAudioPath` (`beta/src/lib/blog-audio.ts`). No frontmatter needed. Keep files small — they ship in git, no LFS.

## Publishing checklist

1. Set `published: true` in **both** language files.
2. Preview a draft without publishing: dev server shows drafts; in production append `?preview=<key>` (`PUBLIC_PREVIEW_KEY` env, default `bumble-field-notes` — see `PREVIEW_KEY` in `beta/src/lib/blog.ts`).
3. Run the `sync-agent-content` skill (`beta/.claude/skills/`): add the post to the Blog section of `public/llms.txt` / `public/llms-full.txt` (published posts only) and `public/agents.txt`.
4. Verify: `npx vitest run --exclude tests/bilingual-content.integration.test.ts`, `npm run build`, then `grep` `dist/sitemap-0.xml` for both slugs and check `dist/rss.xml` + `dist/en/rss.xml`.
5. PR to `master` — deploy is path-filtered on `beta/`.

Publishing effects: post appears in the blog listing, both RSS feeds, the sitemap, and — once at least one post is live — the `FieldNotesTeaser` on the AI Consulting pages.
