# Open Space Principles — Immersive Sequence Page

**Date:** 2026-07-19
**Status:** Approved
**Context:** The archived Jekyll site (`_pages/os/os-principles.md`, content in
`_i18n/{de,en}.yml`) had a dedicated gallery page for the "5 principles and 1 law" of Open
Space Technology — a foundational piece of bumbleflies' facilitation philosophy. The current
beta redesign dropped this entirely; Open Space now only appears as a single bullet
("Open Space (8–500 PAX)") on `services.astro`. This spec reintroduces the principles as a
standalone piece of thought-leadership content, redesigned for the new site rather than
ported as-is.

## Problem

- The philosophy behind *why* bumbleflies facilitates the way it does has no home on the
  new site — a credibility gap for prospects evaluating facilitation expertise.
- The old page (`/open-space-prinzipien-uebersicht`) was a static photo gallery with hover
  states; that pattern doesn't fit the new site's design language (Instrument Serif display,
  Geist Mono uppercase labels, honey-amber accent, zero-JS-by-default Astro architecture).
- The footer already has a "Learn" column (`beta/src/lib/footerContent.ts`) anticipating
  resource content (Field Notes, FaST-Training, AI-Literacy, Open Space Checklist) — most of
  those entries are placeholders pointing at `/services`. This page fills one of those slots
  for real.

## Decision

**Scope:** the 5 principles + 1 law only. The separate "Open Space Checklist" (practical
event-planning steps, `_i18n/{de,en}/checklist.md` in the archive) is out of scope — its
footer placeholder stays as-is for a future effort.

### A. Experience — full-viewport slide sequence
A new page presents the 6 items (5 principles + Law of Mobility) as an immersive,
one-at-a-time sequence rather than a card grid or long-form article:

- Each slide: a small mono-uppercase eyebrow (`OPEN SPACE PRINCIPLES`, `01 / 06`), the
  principle's illustration in a **framed card** (bordered, shadowed — not full-bleed), and
  progress dots.
- Navigation: prev/next arrows, keyboard arrows, swipe/click; a ✕ control exits the
  sequence back to wherever the visitor entered from.
- The sequence ends clean after slide 6 (the Law). No CTA is baked into the finale slide.
  Closing (✕) reveals a normal page with the site's standard `CTAStrip` + `Footer` beneath —
  reusing the existing conversion pattern rather than inventing a new one.
- Deep-linking to individual slides (e.g. `/open-space#3`) is **out of scope for v1** — cuts
  build scope; easy to add later if wanted.

### B. Imagery — reuse the existing bumbleflies illustrations
The archive's images (`assets/img/os/{de,en}/OS - Principle {1-5}.jpg` and
`OS - Law.jpg` / `OS - Gesetz.jpg`) are not stock photos — they're the original bumbleflies
mascot illustrations: hand-drawn bees, the "b" logo watermark, hand-lettered principle text
baked into the image. They already exist per-language (DE and EN folders), so no new asset
production or translation work is needed. Because they have white/centered compositions,
they sit inside a framed card (light shadowed panel) rather than full-bleed, which works in
both light and dark mode.

Copy the 6 files per language from `assets/img/os/{de,en}/` into
`beta/public/images/open-space/{de,en}/` (with light filename normalization — e.g.
`principle-1.jpg` … `principle-5.jpg`, `law.jpg`), optimizing file size in the process.

### C. Discovery — thought leadership, not top nav
No top-nav entry, and the content is not embedded into any existing page. Two entry points:

1. **Footer "Learn" column** (`beta/src/lib/footerContent.ts`): add a new entry
   ("Open Space Principles" / same in EN) pointing at the new page — the existing
   "Open Space Checkliste"/"Open Space Checklist" placeholder entry is untouched (still
   points at `/services`, out of scope per above).
2. **Contextual link on `services.astro`**: one small inline link near the existing
   "Open Space (8–500 PAX)" bullet (e.g. "See the philosophy →" / German equivalent) —
   a link only, no content duplicated on that page.

### D. Routing
New pages, matching the site's existing slug convention (DE at root with an English-ish
slug, EN duplicated under `/en/`):
- `beta/src/pages/open-space.astro` → `/open-space` (DE)
- `beta/src/pages/en/open-space.astro` → `/en/open-space` (EN)

### E. Content model — extend the existing `pages` collection
No new content collection. The `pages` NestedText collection (`src/content/pages/*.nt`,
loaded via `beta/lib/astro-loaders.ts`) already models exactly this shape of data (see
`home.nt`'s `services` array of number/title/description/bullets). Add:

- `beta/src/content/pages/open-space.nt` (DE)
- `beta/src/content/pages/en/open-space.nt` (EN)

Each with a `principles` array of 6 objects: `number`, `title`, `quote`, `image` (path under
`/images/open-space/...`). The 6th entry (the Law) is just the last item in the same array —
no separate field needed.

**Clarification (the principle text is baked into the image, not re-rendered as HTML):**
each illustration already has its hand-lettered principle text drawn into the artwork —
there's no separate on-page heading duplicating that text. `quote` is used as the image's
`alt` attribute (accessibility/SEO, since baked-in image text isn't crawlable or
screen-reader visible); `title` is the short label used for the eyebrow and dot
`aria-label`s (e.g. "Principle 1", "Law of Mobility"), not shown as a heading.

**Schema change** in `beta/lib/astro-loaders.ts`: add a `principles` field to
`pagesSchemaCoerced`, mirroring the shape of the existing `steps` field plus an `image`
string:

```ts
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
```

### F. Implementation — vanilla JS, no React island
One new component, e.g. `beta/src/components/PrincipleSequence.astro`, rendering all 6
slides server-side and toggling visibility/position with a plain `<script>` tag (prev/next
click handlers, keyboard arrow listener, swipe detection, dot navigation, ✕ exit). This
matches the existing vanilla-JS pattern used by `ThemeToggle.astro` and `LangToggle.astro`
and keeps the site's zero-JS-by-default philosophy — no new client-side framework or
hydration island needed.

## Files touched / created

- `beta/lib/astro-loaders.ts` — add `principles` field to `pagesSchemaCoerced`
- `beta/src/content/pages/open-space.nt` (new, DE)
- `beta/src/content/pages/en/open-space.nt` (new, EN)
- `beta/src/pages/open-space.astro` (new, DE)
- `beta/src/pages/en/open-space.astro` (new, EN)
- `beta/src/components/PrincipleSequence.astro` (new)
- `beta/src/lib/footerContent.ts` — add "Open Space Principles" entry to the `learn` column
  (both DE and EN)
- `beta/src/pages/services.astro` and `beta/src/pages/en/services.astro` — one contextual
  link near the "Open Space" bullet
- `beta/public/images/open-space/{de,en}/*.jpg` (new, copied + optimized from
  `assets/img/os/{de,en}/`)

## Out of scope

- The "Open Space Checklist" page (practical event-planning steps) — footer placeholder
  stays pointed at `/services`.
- Deep-linking to individual slides.
- Any change to top navigation.
- Re-generating new illustration art (e.g. SVG scenes matching the Field Notes blog series)
  — the existing bee illustrations are reused as-is.

## Appendix: content data (from the archive, `_i18n/{de,en}.yml`)

| # | title (DE) | quote / alt (DE) | title (EN) | quote / alt (EN) | image (both langs) |
|---|---|---|---|---|---|
| 1 | Prinzip 1 | Wer auch immer kommt, es sind die richtigen | Principle 1 | Whoever comes are the right people | `principle-1.jpg` |
| 2 | Prinzip 2 | Was auch immer passiert, ist das einzige was passieren konnte | Principle 2 | Whatever happens is the only thing that could have | `principle-2.jpg` |
| 3 | Prinzip 3 | Es beginnt, wenn die Zeit reif ist | Principle 3 | Whenever it starts is the right time | `principle-3.jpg` |
| 4 | Prinzip 4 | Es ist vorbei, wenn es vorbei ist | Principle 4 | When it is over, it is over | `principle-4.jpg` |
| 5 | Prinzip 5 | Wo auch immer es passiert, ist der richtige Ort | Principle 5 | Wherever it happens is the right place | `principle-5.jpg` |
| 6 | Gesetz der Mobilität | Wann immer du dich an einem Ort befindest, an dem du weder lernst noch etwas beitragen kannst, bewege dich dorthin, wo du das kannst | Law of Mobility | If at any time you find yourself in any situation where you are neither learning nor contributing: go someplace else. | `law.jpg` |

Source images: `assets/img/os/de/OS - Prinzip {1-5}.jpg` + `OS - Gesetz.jpg` (DE);
`assets/img/os/en/OS - Principle {1-5}.jpg` + `OS - Law.jpg` (EN).

**Footer entry copy:** "Open Space Principles" (EN) / "Open Space Prinzipien" (DE) — distinct
from the existing untouched "Open Space Checklist"/"Open Space Checkliste" placeholder entry.

**Services-page contextual link copy:** "See the philosophy →" (EN) / "Die Philosophie
dahinter →" (DE), placed directly after the "Open Space (8–500 PAX)" bullet on the Talk
service card.

## Verification

- `astro check` (types), `npm run test` (Vitest), `npm run build`.
- Manual: visit `/open-space` and `/en/open-space` — all 6 slides render, prev/next/keyboard/
  swipe/dots work, ✕ exits to a normal page with `CTAStrip` + `Footer`, light and dark mode
  both look correct (framed card, not full-bleed).
- Confirm footer "Learn" link and the services-page contextual link both resolve correctly
  in DE and EN.
