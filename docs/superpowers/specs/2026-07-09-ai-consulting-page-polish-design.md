# AI Consulting Page — Fix, Polish & Linking

**Date:** 2026-07-09
**Status:** Approved
**Context:** Follow-up to PR #94 (SEO overhaul + AI consulting page). The live page at
`/ai-consulting` renders a broken intro section (a lone `|`), feels thin/redundant against
the closing quote, and is under-emphasised in the site's internal linking.

## Problem

1. **Broken intro (`|`).** `beta/src/content/pages/ai-consulting.nt` writes `intro:` as a
   YAML-style block scalar (`intro: |` + indented lines). The site's custom NestedText parser
   (`beta/lib/nestedtext.ts`) has **no `|` block-scalar support** — it reads the value as the
   literal string `|` and drops the indented lines. The `pages` collection loads only `.nt`
   files, so the correct-but-unused `.md` twin never renders. Same bug in `en/ai-consulting.nt`.
2. **"Looks smaller / strange."** The intro is its own `<section>` on `--bg`, wedged between
   two `--paper` sections. Even with content it reads as an afterthought; empty, it looks like
   dead space. The page is also the only one with a standalone intro band and uses hardcoded
   `rem` values instead of the site's design tokens.
3. **Redundancy.** The intro and the closing manifesto quote both open with "Die meisten…" and
   make the same conversation-to-code point.
4. **Weak linking.** The homepage StationFlow station 02 and the services-page card both link
   to `/ai-consulting`, but only via hover — no persistent affordance signals they're clickable.

## Decision

Scope (user-approved): **fix + polish + linking**. Fix the bug at the **content level** (not
by hardening the parser). Keep copy genuine and match the site-wide structure.

### A. Structure — match the site-wide hero pattern
- **Remove** the standalone `.a-ai-intro` section from `ai-consulting.astro` and
  `en/ai-consulting.astro`. No other page has a lone intro band.
- Hero becomes **eyebrow + heading + one intro paragraph** on `--paper`, mirroring
  `how-we-work.astro`. The intro paragraph replaces the thinner subheading.
- Restore clean `--paper` / `--bg` alternation across the remaining sections
  (hero `paper` → steps `bg` → services `paper` → quote `bg`) so none look collapsed.
- **Keep** the hero's hardcoded `4rem` / `3rem` / `1.25rem` values: the sibling
  `how-we-work.astro` uses the identical hardcoded values in its scoped styles, so these
  already match the site. Converting to tokens would make the page *less* consistent, not more.

### B. Copy — genuine, distinct from the quote
Two-sentence hero intro (matches the terse editorial voice; drops the "Die meisten…" echo):

- **DE:** „Vom ersten Gespräch zur laufenden KI-Lösung. Andere liefern eine PowerPoint — wir
  liefern funktionierende Software."
- **EN:** "From the first conversation to a running AI solution. Others hand you a slide deck —
  we hand you working software."

The manifesto quote strip stays as the closing flourish.

**Field mapping:** the new copy lives in the `.nt` `subheading` field as a **single inline
line** (no `|` block scalar). The hero renders `subheading` as its intro paragraph. The
`intro:` field and the `.a-ai-intro` section are removed entirely. The `.nt` files must
contain no `|` block scalars.

### C. Linking — persistent affordance, using the site's own arrow vocabulary
The site already assigns meaning to its arrows: `→` (horizontal) is for **list bullets**;
`↗` (diagonal) is the **navigation / "go somewhere"** mark (nav CTA "Schreib uns ↗",
`CTAStrip` button). Therefore use **`↗`**:
- **`StationFlow.astro`:** append a persistent `↗` to a station's linked title (only when
  `href` is set), so homepage station 02 reads as clickable without hovering.
- **`ServiceCard.astro`:** when `href` is set, add a persistent "Mehr erfahren ↗" /
  "Learn more ↗" cue at the card foot. The whole card already links via an overlay anchor;
  this only makes the affordance visible.

## Files touched
- `beta/src/content/pages/ai-consulting.nt` — fix intro, remove block scalar
- `beta/src/content/pages/en/ai-consulting.nt` — same (EN)
- `beta/src/pages/ai-consulting.astro` — fold intro into hero, drop standalone section, tokens, bg alternation
- `beta/src/pages/en/ai-consulting.astro` — same (EN)
- `beta/src/components/StationFlow.astro` — `↗` on linked titles
- `beta/src/components/ServiceCard.astro` — "Mehr erfahren ↗" / "Learn more ↗" when `href` set

## Out of scope
- Hardening the NestedText parser to support `|` block scalars (deliberately deferred).
- Removing the unused `.md` page twins (pre-existing site-wide pattern, not this page's problem).

## Verification
- `astro check` (types), `npm run test` (Vitest — includes `Nav.test.ts`), `npm run build`.
- Visual check of `/ai-consulting` and `/en/ai-consulting`: no `|`, full hero, clean
  alternation; homepage station 02 and services card 02 show a visible `↗`.
