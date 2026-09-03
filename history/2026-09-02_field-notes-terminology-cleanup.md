# Field Notes Terminology & Voice Cleanup (2026-09-02)

Closed [GitHub #176](https://github.com/bumbleflies/web/issues/176) — external
editorial feedback on Field Notes "Teil 01" — by fixing the flagged post and then
applying the same fixes series-wide, since investigation showed the complaints
were structural, not a one-off wording slip: all 6 posts (12 files, DE/EN) shared
the same terminology and voice inconsistencies.

---

## Problem

Issue #176 flagged, on Teil 01 (`ki-agenten-betriebssystem.md`):

- "Ebene" (2 foundation levels) vs. "Schicht" (4 agent layers) read as
  near-synonyms and confused the reviewer.
- "Bot" and "Agent" used interchangeably with no definition.
- Formal "Sie"/"Ihr" address broke the series' otherwise informal voice.
- AI-buzzword "fundamental", over-technical "dedupliziert" (inconsistently
  spelled "entdupliziert" in the same file), an under-explained motif ("Eine
  Definition, viele Laufzeiten."), and a 5-step process description where the
  link between "support ticket" and "pull request" was never stated.
- Reviewer requested a branded visual for the "two areas / four building
  blocks" architecture.

A pre-fix audit (word counts across all 12 files) confirmed the terminology
and voice issues were series-wide: "Ebene"/"Schicht" appeared in Teil 01, 02,
03, 05, 06; "Bot" in all 6 posts (heaviest in Teil 05, ~89 occurrences total);
formal "Sie"/"Ihr" leaked into 3 of 6 German posts (Teil 01, 03, 04).

## What was changed

All 12 files under `beta/src/content/blog/`:

- **"Ebene"/"Schicht" → "Fundament"/"Säule"** (EN: "level"/"layer" →
  "foundation"/"pillar"). Reuses the numbered-label pattern the article
  already had for the 4 layers ("Fundament 1, der Zustand." / "Säule 1, das
  Nervensystem."). Ripples through Teil 01, 02 (including its title), 03
  (including a stray English-loanword "Automatisierungslayer" in the
  frontmatter `description` that the initial word-count audit missed), 05, 06.
- **"Bot" dropped, unified on "Agent"/"Agenten"** everywhere, including Teil
  05's title (DE: "Bots, die arbeiten, während du schläfst" → "Agenten, die
  arbeiten, während du schläfst"; EN: "Bots That Work While You Sleep" →
  "Agents That Work While You Sleep"). One clarifying sentence added in Teil
  01 stating the series uses "Agent" for any AI process filling a role,
  including autonomous ones.
- **Formal "Sie"/"Ihr" → "du"** in the specific direct-address sentences that
  had it (Teil 01, 03, 04) — not a full voice rewrite, since the series
  otherwise never addresses the reader directly.
- **"fundamental" and "dedupliziert"/"entdupliziert"** replaced with plain
  language in Teil 01 (DE + EN).
- **"Eine Definition, viele Laufzeiten."** in Teil 01 expanded with the
  concrete example that was originally only given later, in Teil 04.
- **The 5-step process description** in Teil 01 rewritten to explicitly link
  the support ticket to the pull request that addresses it — flagged to the
  author as a best-guess rewrite needing confirmation against the real system
  mechanics.
- **Light jargon-glossing pass**: inline parenthetical glosses added for
  "Kommentar-Befehlsbus", "Few-Shot-Prompt", "wortgleich dupliziert",
  "auslieferungs-agnostisch", "Headless-Modus" on first use (German posts
  only — the English equivalents were already plain English).
- **New architecture diagram** for Teil 01 (DE + EN): hand-authored inline
  SVG, dark + light variants, illustrating "zwei Fundamente, vier Säulen" as
  two foundation blocks supporting four pillars. Generated via a one-off
  Python script (not committed — same throwaway-script convention used for
  the cover art), using the existing brand palette (honey-amber on
  near-black / warm honey ink on cream) but plain
  `ui-monospace` labels instead of the covers' embedded/subsetted webfont,
  since the diagram's label text wasn't part of that font's original subset.

## Files changed

- 12× `beta/src/content/blog/*.md` — terminology, voice, jargon fixes
- `beta/public/images/blog/{ki-agenten-betriebssystem,ai-agent-operating-system}-architecture{,-light}.svg` — new
- `beta/src/styles/design-system.css` — new `.a-arch-diagram` class (global
  theme-swap, same technique as `BlogCover.astro`'s scoped version, needed
  global here since it's used via raw HTML inside markdown, not a component)
- `beta/docs/superpowers/plans/2026-08-25-field-notes-launch-campaign.md` —
  added a "Correction (terminology & voice)" note documenting the decisions
  for future posts in the series

## Verification done

- Full-repo `grep` sweep after every file's edits, and again at the end,
  confirming zero remaining `Bot`/`Ebene`/`Schicht`/`fundamental`/`dedupli`
  matches outside of intentionally-unchanged file slugs (e.g.
  `bots-die-nachts-arbeiten.svg`, left as-is to avoid URL churn on unpublished
  drafts) and one deliberately-kept generic idiom ("DRY-Prinzip auf
  Agenten-Ebene" / "at the agent level", consistent in both languages).
- `npm run build` — 43 pages built clean with `PUBLIC_PREVIEW_KEY` set
  (drafts included); all 12 post routes generated without errors.
- Rendered-HTML check: stripped all tags from the built `bots-*` pages and
  confirmed zero visible-text matches for "Bot" (only URL slugs remain, as
  intended).
- Browser check via `npm run preview`: Teil 01 loads correctly in both dark
  and light themes; the new diagram renders inline right after the
  architecture heading and theme-swaps correctly alongside the existing cover
  art.
- `astro check` fails with a pre-existing, unrelated language-server/tsconfig
  crash in this environment (same caveat noted in the original Field Notes
  build log) — `npm run build` is the authoritative gate here.

## Known issues / follow-ups

- The Teil 01 process-description rewrite (ticket ↔ pull-request linkage) is
  a best guess — needs the author's confirmation against the real system
  mechanics before this is considered fully resolved.
- Issue #176 should be replied to / closed referencing this change once the
  above is confirmed.
