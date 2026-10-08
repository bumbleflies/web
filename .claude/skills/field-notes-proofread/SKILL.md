---
name: field-notes-proofread
description: "Use before publishing or updating a Field Notes blog series post (src/content/blog/*.md) to proofread it for AI-generated rhetoric ('AI slop'), tone/voice consistency, and house style. Apply the same edits to both the DE and EN language files."
---

# Field Notes Proof-Read

A line-by-line editorial pass for the "Field Notes" blog series (the KI-Agenten-Betriebssystem / AI-agent-operating-system posts and their siblings). Distilled from an actual editing pass on `ki-agenten-betriebssystem.md` / `ai-agent-operating-system.md`.

## Process

1. Read the **published** post top to bottom (not just the diff) and classify every sentence:
   - **KEEP** — leave it.
   - **TIGHTEN** — right idea, sharpen the wording.
   - **REWRITE** — the idea's fine, the phrasing isn't.
   - **CUT** — generic filler or AI-slop, adds nothing.
   - **WATCH** — technically or rhetorically questionable; flag rather than silently fix (see Escalate below).
2. Apply edits to the language file you're proofreading.
3. **Mirror every edit to the other language file.** DE and EN posts are paired by `order` (see `src/content/blog/AGENTS.md`); a fix in one that isn't ported to the other creates drift a reader or the next editor won't expect.
4. Do a **final fresh read** of the whole post after all edits — not just the touched lines. Coordinated multi-step edits routinely produce new problems the line-level view can't see (see Cross-cutting checks below).
5. Run `npm run build` (or `astro check`) before calling it done — a frontmatter quote fix can silently break YAML parsing (see Gotcha below).

## Red flags — cut or rewrite on sight

- **Throat-clearing openers**: "The most important sentence first, because it explains everything else." State the sentence; don't announce it.
- **Empty value-signaling**: "They are the real value, and the thread running through this series." Says nothing concrete — cut.
- **Generic thought-leadership closers**: "None of this is a blueprint to copy." Consulting-speak — cut, let the next (concrete, self-doubting) sentence stand alone.
- **Generic marketing CTAs**: "Sounds like a topic that moves you too?" Reads like a different, worse author took over — cut.
- **Stacked metaphors**: this series already runs on "foundations / pillars / nervous system / cockpit." Don't add another metaphor system on top ("connective tissue," "a network with load-bearing seams," "two perpendicular foundations"). One metaphor family per post; describe mechanism in plain language everywhere else.
- **Unfalsifiable absolutes**: "It improvises, and improvises a little differently every time" invites an easy technical objection. Prefer a specific, defensible claim ("it doesn't automatically know your deployment pipeline; it has to infer it from context").
- **Vague growth metaphors**: "From this one idea grew a multi-layered operating system." Say what actually happened in concrete terms instead.

## Comma-before-"und"/"and": fix vs. leave alone

Not every comma call is a style preference — some are real errors, and it's worth telling the two apart before touching one:

- **A genuine error**: a comma before "und"/"and" joining just **two items** of a list or two objects of the same verb, with no third item and no second clause. E.g. "Er liest beide Fundamente, und sogar die eigene Gesprächshistorie" (one verb, two objects) or "the protective measures behind it, and the concrete incident" (two items, not three). German doesn't take a comma there, and neither does English absent a third list item to justify an Oxford comma. Fix these.
- **Not an error, don't touch**: a comma before "und"/"and" joining **two full predicates sharing a subject** ("Jeder Skill ist X, und funktioniert Y") or **two independent clauses** ("der Filter prüft erneut, und blockiert im Zweifel"). German's *Kann-Komma* rule makes this comma optional for clarity; removing it isn't wrong, but it isn't a fix either — leave it as the author had it unless something else about the sentence needs work.
- A genuine 3+-item enumeration ("implements code, opens pull requests, ..., and reports back") keeps its comma before the final "and" in English (Oxford comma, this site's convention) and drops it in German (no Oxford-comma equivalent) — don't cross the conventions between languages.

## Don't trade precision for length

A "readability" rewrite that makes a sentence longer without making it clearer is a regression, not an improvement. Concretely:
- **Don't unpack a precise compound term into a wordier relative clause** unless the original was actually unclear. "trifft die Urteilsentscheidungen" (makes the judgment calls) → "trifft die Entscheidungen, bei denen Urteil gefragt ist" (makes the decisions where judgment is called for) is strictly worse: more words, same information, softer verb.
- **Don't swap a clean native verb for an anglicism-flavored noun phrase** to dodge a repeated word elsewhere in the post. "rollt der Agent aus" → "führt der Agent den Rollout aus" trades a normal separable verb for a clunkier "execute the rollout" construction. If a word is repeated too often, cut the repetition some other way (or leave it — repetition of a plain technical verb is rarely the reader's actual problem).
- If a rewrite like this appears without a mirrored edit in the other language file, that's itself a signal it's a taste call rather than a real fix — a real fix (fixing an actual error, a real inconsistency) is worth making in both languages; a marginal wording preference usually isn't worth the asymmetry.

## Reviewing someone else's proofread PR

Rate every hunk individually before approving or merging, the same way you'd proofread a post from scratch:
- **Verify "mirrored to English" claims** — don't take a PR description's word for it. Diff both files and check whether a fix applied to one was actually ported to the other (a frontmatter-description inconsistency fixed in DE but left unfixed in EN is a common miss).
- **Classify each hunk** as a genuine fix (grammar error, real inconsistency), a lateral taste call (optional comma, either wording works), or a regression (wordier, less precise, or introduces an asymmetry between languages) before deciding whether to keep it.
- It's fine to keep only a subset of a PR. Strip it down to the hunks that are unambiguous wins and revert the rest, rather than accepting or rejecting the whole thing wholesale.

## Always preserve

- Concrete specifics: a named tool, a real code comment, a quoted system message, a dated regression — these are the strongest anti-slop signal in the piece.
- Real quotes and slightly imperfect human phrasing (a customer's actual words, a self-deprecating aside) — don't polish the humanity out of them.
- Short, punchy declarative sentences that land the thesis.
- Self-aware or vulnerable admissions ("there are decisions in here I'm still not sure about").

## House style (see also `beta/CLAUDE.md`)

- **No em dashes.** Use a period, comma, colon, semicolon, or parentheses instead.
- **German quotes**: „ for the opening mark, a plain straight `"` for the closing mark, matching this series' existing body-text convention (not the typographically "correct" „…" pair).
- **German CTAs use `du`**, not `Sie`.

## Gotcha: frontmatter quotes break YAML

`description` (and other frontmatter strings) are YAML double-quoted scalars. If a rewritten description embeds a literal ASCII `"` as a closing quote mark (matching the body-text convention above), it **collides with the YAML delimiter** and breaks content sync with an opaque error ("bad indentation of a mapping entry"). Either:
- escape it as `\"`, or
- keep the frontmatter convention of plain `'single quotes'` for embedded quotes (avoids the whole class of bug).

Always run `npm run build` after touching frontmatter to catch this — `astro check`'s content-sync step will fail loudly if it's broken, silently succeed if it isn't.

## Cross-cutting checks (do these on the final read, not per-line)

- **Pronoun/credit consistency.** If a rewrite adds team credit ("we built this, my colleagues and I"), it must not immediately collide with an adjacent sentence re-claiming solo authorship of the *same* act ("I built this system..."). One acknowledgment near the top is enough; the rest of the post can stay first-person-singular *if* it's framed as personal account/decisions, not a repeated build claim.
- **Duplicate content across adjacent paragraphs.** Edits made independently (e.g., moving a phrase into paragraph A, then separately rewording paragraph B) can leave two paragraphs asserting the same fact back to back. Merge them; don't let both survive.
- **Repeated words in adjacent sentences.** E.g. "...design principles appear. These principles run through..." reads clumsy — combine into one sentence.
- **Deliberate callbacks are good, keep them.** E.g. this series intentionally echoes "traces back to a concrete/dated incident" in both the intro and the principles section — that repetition is a feature, not a bug. Don't flatten intentional echoes while hunting for accidental ones.

## Escalate instead of guessing

Some review items are bigger than a wording fix and should go back to the user as a question, not get applied unilaterally:
- **Structural reordering** (e.g., moving a concrete example earlier than the architecture explanation).
- **Shared template copy** (CTA text, AI-disclosure note) that lives outside the content file, in `src/pages/blog/[slug].astro`, and therefore affects every post in the series, not just the one being proofread.
