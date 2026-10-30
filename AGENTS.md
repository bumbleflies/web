# AGENTS.md

Active site is the repo root (Astro, static output). The legacy Jekyll tree was removed from `master` (recoverable via tag `archive/jekyll-final`). Details live in `CLAUDE.md`; this file is only the non-obvious parts.

## Commands (run from repo root)

```bash
npm ci                  # CI uses this, not `npm install`
npm run dev             # port 3000 (not Astro's default 4321)
npm run build           # outputs `dist/`
npm run typecheck       # tsc (TS 7.1) + @astrojs/ts-content-mapper for .astro; run before committing
npx vitest run tests/<name>.test.ts   # single test; suite is `npm run test`
npm run test:integration               # only `bilingual-content.integration.test.ts`
```

## Gotchas

- `package.json` says Astro `^7`. Trust the manifest.
- Type checking is `npm run typecheck` (`astro sync` + `tsc --noEmit --runExternalCode`). It relies on TypeScript 7.1 and `@astrojs/ts-content-mapper` because `astro check` refuses TypeScript 7; keep both pinned and update them together. The mapper runs code from `node_modules`, hence the explicit flag.
- If typecheck dies with `error TS5023: Unknown compiler option '--runExternalCode'`, your `node_modules` predates the TS 7.1 pin — run `npm ci` (CI always does, so a red typecheck locally and green in CI means a stale tree, not a code problem). `lib/toolchain.mjs` now runs first and says exactly that instead of letting tsc fail cryptically.
- Content config is `src/content.config.ts`.
- Dockerfile builder must stay a **glibc** image (`node:26-slim` since #259). Don't switch to Alpine: Astro 7's `satteri` markdown engine ships only `linux-x64-gnu` bindings, so a musl base breaks the build.
- `/health` is served by `nginx.conf` only — no source route exists, so don't add or test one in Astro.
- **URLs are trailing-slash.** Astro builds `dir/index.html`, so `/services/` is the served address and `/services` is a 301. Every internal `href` must end in `/` (literal, `href`-prop and template string alike) — otherwise each click costs a redirect. `tests/dead-links.test.ts` accepts both forms, so it will not catch a missing slash: check the built HTML (`grep -o 'href="/[^"]*"' dist/**/index.html`).
- `nginx.conf` has `absolute_redirect off`. Traefik terminates TLS and proxies over http, so without it every trailing-slash redirect advertises `Location: http://…` and costs an extra hop.
- There is no SPA fallback: `try_files $uri $uri/ =404` plus `src/pages/404.astro` → `dist/404.html`. Never reintroduce `/index.html` as the fallback; it makes every unknown URL answer 200 with the homepage (Google indexes it as duplicates).
- `www.bumbleflies.de` is a separate `server` block that 301s to the apex; the Traefik router sends both hosts here.
- Cache: HTML `max-age=0, must-revalidate`; `_astro/*` immutable for a year; other images a week; `/fonts/` a year (rename a font file if it ever changes). `add_header` does not inherit — a `location` that sets one drops the server-level ones.
- Validate `nginx.conf` before committing (docker is not installed on every host): `sudo apt-get install -y nginx-core` once, then
  `sed -e 's/listen 80;/listen 8080;/' -e "s|root /usr/share/nginx/html;|root $PWD/dist;|" nginx.conf > /tmp/local.conf` wrapped in an `http{}` and `nginx -t -c`.
- Style is fully inlined (`build.inlineStylesheets: 'always'`) — there are no `_astro/*.css` requests. Don't "optimize" that back; two blocking CSS files delayed first render by ~420 ms.
- Fonts ship as `woff2` with the `.ttf` kept as fallback; regenerate with `fonttools` (`TTFont(...).flavor='woff2'`) if a face is replaced.
- Long editorial titles use `seoTitle` / `seoDescription` in blog frontmatter (SERP-only overrides, ≤60 / ≤160 chars) and `formatPageTitle()` from `src/lib/seo.ts`. The visible `<h1>` keeps using `title`.
- `public/.well-known/ard.json` and `ai-catalog.json` are the same ARD manifest (canonical path + predecessor path); `tests/agent-discovery-manifest.test.ts` fails if they drift.
- The accent colour comes in two tokens: `--accent` for graphics (fills, rules, borders) and `--accent-text` for small text (`#856034`, ≥5:1 on both backgrounds). Don't use `--accent` as a text colour.
- Production branch is `master`, not `main`. Deploy workflow (`.github/workflows/astro-build-deploy.yml`) is path-filtered on `src/**`, `public/**`, packaging and Docker files; docs-only edits don't trigger a site build.
- i18n: German pages in `src/pages/`, English mirrors in `src/pages/en/`; language state is still hardcoded per page (`currentLang`), not a shared store.
- After any page/content-collection/nav change, run the `sync-agent-content` skill (`.claude/skills/`) to regenerate `public/llms.txt`, `public/llms-full.txt`, `public/agents.txt`, `public/robots.txt`.
- Publishing a blog post? Follow `src/content/blog/AGENTS.md` (frontmatter, DE↔EN `order` pairing, audio, verify, PR).
- Playwright e2e (`tests/*.e2e.spec.ts`) expects Chrome at `/usr/bin/google-chrome` and auto-starts `npm run dev`; CI `test.yml` runs only Vitest, not Playwright.
