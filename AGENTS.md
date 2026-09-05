# AGENTS.md

Active site is `beta/` (Astro, static output). Root Jekyll tree (`_pages/`, `_data/`, `_i18n/`) is archived — don't touch it. Details live in `CLAUDE.md` (root) and `beta/CLAUDE.md`; this file is only the non-obvious parts.

## Commands (run from `beta/`, not repo root)

Root `package-lock.json` is an empty stub; the real manifest is `beta/package.json` (+ `beta/.npmrc` for install flags).

```bash
cd beta
npm ci                  # CI uses this, not `npm install`
npm run dev             # port 3000 (not Astro's default 4321)
npm run build           # outputs `beta/dist/`
npx astro check         # typecheck (tsconfig extends `astro/tsconfigs/strict`); run before committing
npx vitest run tests/<name>.test.ts   # single test; suite is `npm run test`
npm run test:integration               # only `bilingual-content.integration.test.ts`
```

## Gotchas

- `package.json` says Astro `^7`, not 6.x as `CLAUDE.md` claims. Trust the manifest.
- Content config is `beta/src/content.config.ts` — `beta/CLAUDE.md` still says `src/content/config.ts` (stale).
- Dockerfile builder must stay `node:24-slim` (glibc). Don't switch to Alpine: Astro 7's `satteri` markdown engine ships only `linux-x64-gnu` bindings.
- `/health` is served by `nginx.conf` only — no source route exists, so don't add or test one in Astro.
- Production branch is `master`, not `main`. Deploy workflows (`.github/workflows/`) are path-filtered on `beta/`; root-only edits don't trigger a site build.
- i18n: German pages in `src/pages/`, English mirrors in `src/pages/en/`; language state is still hardcoded per page (`currentLang`), not a shared store.
- After any page/content-collection/nav change, run the `sync-agent-content` skill (`beta/.claude/skills/`) to regenerate `public/llms.txt`, `public/llms-full.txt`, `public/agents.txt`, `public/robots.txt`.
- Playwright e2e (`tests/*.e2e.spec.ts`) expects Chrome at `/usr/bin/google-chrome` and auto-starts `npm run dev`; CI `test.yml` runs only Vitest, not Playwright.
