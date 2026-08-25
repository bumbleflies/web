# Field Notes launch campaign: strategy + site build

> **Implementation status:** Part B (site build) shipped in this PR — per-post OG images, RSS feeds, per-post JSON-LD, and share links. One correction found during implementation: `_tests/test_rich_results.py` (referenced under Part B item 3) covers the legacy Jekyll site, not this Astro app, so it does not provide regression coverage for the new JSON-LD — verified manually instead by inspecting build output. The Part C publish runbook (weekly `published`/`date` flips from 2026-09-01) and the optional `PUBLIC_PREVIEW_KEY` CI wiring are **not** part of this PR — those are launch-week actions to run against the runbook below.

## Context

The "Field Notes" series — 6 posts × DE/EN (12 files in `beta/src/content/blog/`) — is fully written: a real B2B case study about building a production AI-agent system for a legal-tech client (agent OS → state/interaction architecture → n8n event automation → skill marketplace → autonomous Claude Code daemon → a personal "cockpit" orchestrating ten agents). It has strong narrative arc and credibility (it's a built system, not a pitch deck), but right now it has **zero reach**: all 12 posts are `published: false`, there's no way to share a post that looks good on LinkedIn (no per-post social image), no RSS feed for anyone to subscribe to, and no share affordances on the post pages themselves. The goal is to fix both halves of that problem — give the series a real distribution push, and make the site capable of supporting that push — timed to a launch starting **2026-09-01**.

Scope, per your answers: strategy + site build, together; publish schedule included; channel choice is my recommendation (below), not preset.

---

## Part A — Distribution strategy

**Primary channel: LinkedIn.** Audience fit is exact — B2B buyers evaluating whether AI agents survive contact with production. The company page already exists (`de.linkedin.com/company/bumbleflies`). Bigger lever than the page itself: LinkedIn's algorithm favors personal profiles over company pages, so the highest-leverage move is having the founder/team post each article natively (not just a link-share) with a short personal takeaway, then have the company page reshare it. Company-page-only posting will underperform.

**Secondary channel: technical communities, for reach + backlinks.** This series is unusually credible for its genre (named real components: n8n, Claude Code, working code) — that's exactly what plays well on Hacker News and topic-relevant subreddits. This traffic mostly isn't the buyer, but it drives SEO backlinks, credibility signal, and secondary LinkedIn reshares from people who found it there.

**Tertiary: Mastodon.** Instance already exists (`social.bumbleflies.de`). Reach is small but posting there is nearly free once the LinkedIn copy exists — do it, don't lead with it.

**Deferred: email newsletter.** No signup infra exists today, and building an ESP integration is a real infra decision (which provider, account setup) that's out of scope for this campaign push — flagged as a phase-2 follow-up once RSS exists as the backbone, not a blocker to launch.

**Deferred: analytics/attribution.** No analytics of any kind is installed and adding a platform is out of scope here — but it's zero-cost to tag every shared link with UTM params (`?utm_source=linkedin&utm_medium=social&utm_campaign=field-notes`) from day one so referrer data isn't lost even before a dashboard exists.

### Per-post cadence and channel angle (weekly, Tuesdays)

| # | Date | Post (DE title shortened) | Primary push | Angle / hook |
|---|------|---------------------------|---------------|----|
| 1 | 2026-09-01 | Agenten-Betriebssystem (Overview) | LinkedIn (founder + company reshare), Mastodon | Series pillar: "We didn't build a demo, we built an operating system for AI agents." Frame the whole arc, link nothing else yet. |
| 2 | 2026-09-08 | Zwei Ebenen: Zustand & Interaktion (Architecture) | LinkedIn + r/AI_Agents or similar | Technical depth entry point — good for a HN/subreddit crowd that wants substance, not another agent demo. |
| 3 | 2026-09-15 | Nervensystem: n8n-Automatisierung (Automation) | LinkedIn + r/n8n / n8n community | Most niche-community-relevant post — "keeping an LLM honest" is a real pain point that community searches for. |
| 4 | 2026-09-22 | Skills als Apps: Plugin-Marktplatz (Platform) | LinkedIn only | Broadest business appeal — "plugin marketplace for company knowledge" resonates with platform/product people, not a technical-community post. |
| 5 | 2026-09-29 | Bots, die nachts arbeiten (Autonomy) | LinkedIn + Show HN | Most provocative/shareable title in the series — best HN submission of the six. |
| 6 | 2026-10-06 | Cockpit: ein Tag mit zehn Agenten (Productivity) | LinkedIn + Mastodon, series recap | Closing post — relatable "one human, ten agents" framing, tie back to post 1, CTA to book a call. Good moment for a recap carousel linking all six. |

After post 6: one recap LinkedIn post rounding up the series, and (given the legal-tech angle specifically) worth a direct pitch to legal-tech trade press/newsletters (e.g. Legal IT Insider, Artificial Lawyer) using the finished series as the pitch asset.

---

## Part B — Site build (prerequisites for the push above)

Confirmed by reading `beta/src/components/Layout.astro` and `beta/src/pages/blog/[slug].astro` directly: `Layout` already accepts `ogImage` and `jsonLd` props and renders full OG/Twitter/JSON-LD markup — but `[slug].astro` doesn't pass either yet, so every shared post link currently falls back to the sitewide default image/schema. Layout already has the comment *"PNG, not SVG: Facebook/LinkedIn/X do not render SVG social images"* — confirming the existing teaser SVGs cannot be used as `ogImage` directly.

1. **Per-post social preview images (S).** Rasterize the 6 dark-variant teaser SVGs (`beta/public/images/blog/{slug}.svg`) to 1200×630 PNGs. No SVG→PNG generator exists in the repo to reuse (checked git history — none ever existed). Recommended: one-off local rasterization via `inkscape` (already on the dev machine, renders the embedded-woff2 fonts more reliably than `sharp`/librsvg) into `beta/public/images/blog/og/{slug}.png`, committed as static assets — not part of the build pipeline. Wire `post.data.image` → derived PNG path into the `ogImage` prop in `beta/src/pages/blog/[slug].astro` and `beta/src/pages/en/blog/[slug].astro`. Missing PNGs simply fall back to the existing site default (`Layout`'s `ogImage` prop is already optional) — so this can be done incrementally per post if needed.
   - **Decision needed:** do real per-post covers now (recommended — every LinkedIn/HN preview otherwise looks identical across all 12 posts), or ship v1 with the default image and defer.

2. **RSS feed (S).** Add `@astrojs/rss`; two per-language routes — `beta/src/pages/rss.xml.ts` and `beta/src/pages/en/rss.xml.ts` — matching the existing `/blog` + `/en/blog` split (nothing else in the codebase mixes DE/EN in one artifact). Feed data comes straight from the existing `getBlogPosts('DE'|'EN')` helper in `beta/src/lib/blog.ts`, which already filters to `published: true` and sorts by `order` — no new logic. Add `<link rel="alternate" type="application/rss+xml">` to `Layout.astro`'s `<head>`.

3. **Per-post JSON-LD (S).** Build a `BlogPosting` object (headline, description, `datePublished`, image, `author`/`publisher` as `Organization`, `mainEntityOfPage`) and pass it through the `jsonLd` prop `Layout.astro` already supports — zero `Layout.astro` changes needed, just additions in the two `[slug].astro` files. `beta/_tests/test_rich_results.py` already validates any `application/ld+json` block on every crawled page, so this gets free regression coverage.

4. **Share affordances (S–M).** New component `beta/src/components/ShareLinks.astro`, rendered in the post header of both `[slug].astro` pages:
   - LinkedIn share-intent link (plain `<a href>`, no JS).
   - Mastodon: **no share button** — federation means there's no universal share-intent URL. Show "copy link" + a short line pointing at `social.bumbleflies.de` instead of shipping a broken button.
   - Copy-link button via `navigator.clipboard`, in the same inline-script style Layout already uses for its theme toggle.
   - A distinct share-oriented `mailto:` link, separate from the existing "book a conversation" CTA mailto already on the page.

5. **Publish schedule mechanism (S, process not code).** No new automation — `isBlogVisible` in `beta/src/lib/blog.ts` is a plain boolean check, and this is a static Docker/nginx site, so nothing can "auto-publish" without a rebuild+deploy regardless. Runbook: on each date in the Part A table, edit that week's DE+EN post pair — flip `published: false → true` and correct `date:` from its current placeholder (e.g. `2026-07-10`) to the real go-live date (it feeds the byline, RSS `pubDate`, and the new JSON-LD `datePublished`) — then commit to `master` to trigger the existing deploy pipeline.
   - **Flag (found while verifying #5):** `PUBLIC_PREVIEW_KEY` is not set anywhere in `beta/Dockerfile` or the GitHub Actions workflows, so `getStaticPaths()` in `[slug].astro` never generates draft routes in the real production build today — the `?preview=bumble-field-notes` magic link has no page to unlock. If you want a working stakeholder-preview link before 2026-09-01, that env var needs to be wired into the build (small, separate decision — not required for the public launch itself, only for pre-launch internal review).

### Files touched
- `beta/src/pages/blog/[slug].astro`, `beta/src/pages/en/blog/[slug].astro` — ogImage, jsonLd, ShareLinks
- `beta/src/components/ShareLinks.astro` — new
- `beta/src/components/Layout.astro` — RSS `<link>` tag only
- `beta/src/pages/rss.xml.ts`, `beta/src/pages/en/rss.xml.ts` — new
- `beta/package.json` — add `@astrojs/rss`
- `beta/public/images/blog/og/*.png` — new, generated once via Inkscape
- 12× `beta/src/content/blog/*.md` — `published`/`date` flips, one pair per launch week
- (optional, if you want the pre-launch preview fixed) `beta/Dockerfile` / relevant `.github/workflows/*.yml` — wire `PUBLIC_PREVIEW_KEY`

---

## Verification

- `cd beta && npm run dev` — open a post at `/blog/ki-agenten-betriebssystem`, confirm cover image renders and share links appear.
- View page source / use browser devtools to confirm `<meta property="og:image">` points at the new PNG (not the SVG or default) and `application/ld+json` includes the `BlogPosting` block.
- `npm run build && npm run preview`, then check `/rss.xml` and `/en/rss.xml` return valid XML with only `published: true` posts.
- Paste a built post URL into a social-preview debugger (e.g. LinkedIn Post Inspector, opengraph.xyz) to confirm the image/title/description render correctly — SVG-as-og:image is exactly the kind of failure that only shows up in an actual crawler, not visually in-browser.
- Run the existing `beta/_tests/test_rich_results.py` to confirm the new per-post JSON-LD parses as valid structured data.
- `npm run test` and `astro check` per `beta/CLAUDE.md`'s standard pre-deploy checklist.
