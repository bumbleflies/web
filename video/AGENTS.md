# video/

Self-contained Remotion projects that render Field Notes teasers for blog posts.
Nothing here is imported by the Astro site and nothing here ships to production.

- `video/` is listed in `.dockerignore`, so it never enters the image build.
- Each project has its **own** `package.json` (Remotion is pinned per project). Run
  `npm ci` inside the project, not at the repo root.
- The pipeline is the [`remoguh`](../../AGENTS.md) skill: local Kokoro narration,
  whisper.cpp captions derived from that audio, SVG scenes, Remotion render.
- Rendered output lives in `<project>/out/` and is committed — it is the deliverable
  that gets published (YouTube/LinkedIn/tube), not a build artifact of the site.
- Kokoro models (~340 MB) and the `whisper.cpp` build are **not** committed; each
  project's README documents how to recreate them.

## Projects

| Directory | Post | Length |
|---|---|---|
| `field-notes-ai-agent-os/` | `/en/blog/ai-agent-operating-system` | 57 s · 1080×1920 |

## Conventions for a new teaser

1. Copy an existing project directory, rename it, point `plan.json` at the new script.
2. Reuse `src/components/` (cards, connectors, background, diagram) — the visual
   language is shared; only `src/scenes/*` should differ.
3. Keep narration at ~150 words/min and let measured audio drive scene length:
   `npm run voice` → `npm run timing` → `npm run captions`.
4. Commit source plus the rendered `out/*.mp4`, `out/poster.png` and `out/*.srt`.
