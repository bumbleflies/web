# AGENTS.md

Active site is the repo root (Astro, static output). The legacy Jekyll tree was removed from `master` (recoverable via tag `archive/jekyll-final`). Details live in `CLAUDE.md`; this file is only the non-obvious parts.

## Commands (run from repo root)

```bash
npm ci                  # CI uses this, not `npm install`
npm run dev             # port 3000 (not Astro's default 4321)
npm run build           # outputs `dist/`
npx astro check         # typecheck (tsconfig extends `astro/tsconfigs/strict`); run before committing
npx vitest run tests/<name>.test.ts   # single test; suite is `npm run test`
npm run test:integration               # only `bilingual-content.integration.test.ts`
```

## Gotchas

- `package.json` says Astro `^7`. Trust the manifest.
- Content config is `src/content.config.ts`.
- Dockerfile builder must stay `node:24-slim` (glibc). Don't switch to Alpine: Astro 7's `satteri` markdown engine ships only `linux-x64-gnu` bindings.
- `/health` is served by `nginx.conf` only — no source route exists, so don't add or test one in Astro.
- Production branch is `master`, not `main`. Deploy workflow (`.github/workflows/astro-build-deploy.yml`) is path-filtered on `src/**`, `public/**`, packaging and Docker files; docs-only edits don't trigger a site build.
- i18n: German pages in `src/pages/`, English mirrors in `src/pages/en/`; language state is still hardcoded per page (`currentLang`), not a shared store.
- After any page/content-collection/nav change, run the `sync-agent-content` skill (`.claude/skills/`) to regenerate `public/llms.txt`, `public/llms-full.txt`, `public/agents.txt`, `public/robots.txt`.
- Publishing a blog post? Follow `src/content/blog/AGENTS.md` (frontmatter, DE↔EN `order` pairing, audio, verify, PR).
- Playwright e2e (`tests/*.e2e.spec.ts`) expects Chrome at `/usr/bin/google-chrome` and auto-starts `npm run dev`; CI `test.yml` runs only Vitest, not Playwright.
