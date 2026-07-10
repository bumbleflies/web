# AI-Consulting Blog Series — "Field Notes" (2026-07-10)

Anonymized, production-ready blog series that turns our real KI-agent operating
system into proof-of-work marketing for the AI-consulting offering. Everything is
integrated into the site and ships **dark** — each article has its own live switch
so you can flip them on one at a time as you align promotion.

---

## What was built

- A new `blog` **content collection** (`beta/src/content.config.ts`) with a
  `published` boolean per article — the per-article live switch.
- **6 articles** (German, anonymized) under `beta/src/content/blog/`.
- A **listing page** `/blog` (`beta/src/pages/blog.astro`) + **article pages**
  `/blog/<slug>` (`beta/src/pages/blog/[slug].astro`) with prev/next series pager.
- Components `BlogList.astro` + `BlogCard.astro` (mirror the case-studies design).
- A **gated nav link** ("Field Notes") in `Nav.astro` that only appears once at
  least one article is live.

## How the live switch works

Each article's frontmatter carries:

```yaml
published: false   # ← the switch. false = drafted & dark, true = live
```

- `false` — the article is **not built** into a page and **not listed**. Invisible.
- `true`  — the article page builds at `/blog/<slug>`, appears in the `/blog`
  listing, and the "Field Notes" nav link turns on across the whole site.

**Nothing is visible until you flip a switch** — merging this PR to `master`
changes nothing a visitor can see. The `/blog` index exists but is unlinked and
shows a "coming soon" line until the first article goes live.

### To publish an article

1. Open the article file (see table below) and set `published: true`.
2. Commit + push to `master`. The GitHub Actions build (`build-www.yml`) rebuilds
   the Docker image and deploys. The article, the listing entry, and the nav link
   appear together.

To take one back down, set it to `false` again and push. That's the whole flow —
no code changes, no separate CMS.

> Tip for a coordinated launch: flip **Teil 01 (Überblick)** live first (it teases
> the whole series and links onward), then release Teil 02–06 on whatever cadence
> your promotion plan wants. The prev/next pager only links between *published*
> articles, so a partially-released series stays coherent.

## The 6 articles (series order)

| # | Slug (`beta/src/content/blog/…`) | Titel | Thema |
|---|---|---|---|
| 01 | `ki-agenten-betriebssystem.md` | Ein KI-Agenten-Betriebssystem für ein Legal-Tech-Unternehmen | Überblick |
| 02 | `zwei-ebenen-zustand-und-interaktion.md` | Die zwei Ebenen, auf denen alles läuft | Architektur |
| 03 | `nervensystem-n8n-automatisierung.md` | Das Nervensystem: Event-Automatisierung | Automatisierung |
| 04 | `skills-als-apps-plugin-marktplatz.md` | Skills als Apps: ein Plugin-Marktplatz | Plattform |
| 05 | `bots-die-nachts-arbeiten.md` | Bots, die arbeiten, während du schläfst | Autonomie |
| 06 | `cockpit-tag-mit-zehn-agenten.md` | Ein Cockpit für einen Menschen | Produktivität |

Series order is controlled by the `order:` field, not the filename or date.

## Anonymization (important)

The articles are derived from an internal research dossier about a real system.
Before writing, all identifying material was stripped:

- **No client/company name** → "ein deutsches Legal-Tech-Unternehmen".
- **No people, handles, emails, internal IDs, keys, hostnames, product names.**
- Generic tool names are **kept on purpose** (Claude Code, n8n, ClickUp, Microsoft
  Teams, Azure) — common, non-identifying, and good for SEO.
- The framing is first-person ("wir haben gebaut") as the practitioners who built
  it — no invented consulting-client contract is claimed.

A `grep` guard was run to confirm no identifiers leaked. **If you edit or add
articles, re-run an anonymization pass** before publishing.

## Open follow-ups (not in this PR)

- **English versions** — the series is DE-only (matches the site default and the
  ai-consulting page). EN variants under `beta/src/pages/en/blog/` are a clean
  follow-up if the market calls for it.
- **Consent** — confirm with the source company how it may be referenced, even
  anonymized, before broad promotion.
- **Cross-linking** — optionally add a "Field Notes" teaser block to the
  `/ai-consulting` page once the first article is live.
- **OG/social images** per article for LinkedIn promotion.

## Verification done

- `npm run build` green — 28 pages. With all articles draft, only `/blog/`
  (empty state) builds; no article pages, no nav link.
- Flip-test: set one article `published: true` → its `/blog/<slug>/` page builds
  **and** the "Field Notes" nav link renders; reverted to `false` afterward.
- Anonymization `grep` guard: clean.
- (`astro check` currently errors from an unrelated language-server/tsconfig issue
  in this environment; the production build is the authoritative type/schema gate.)
