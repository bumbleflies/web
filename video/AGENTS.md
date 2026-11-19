# video/

Self-contained Remotion projects that render Field Notes teasers for blog posts.
Nothing here is imported by the Astro site and nothing here ships to production.

- `video/` is listed in `.dockerignore`, so it never enters the image build.
- Each project has its **own** `package.json` (Remotion is pinned per project). Run
  `npm ci` inside the project, not at the repo root.
- The pipeline is the [`remoguh`](../../AGENTS.md) skill: local Kokoro narration,
  whisper.cpp captions derived from that audio, SVG scenes, Remotion render.
- Rendered output lives in `<project>/out/` and is **not** committed — regenerate it with
  `npm run render`. Publishing (YouTube/LinkedIn/tube) consumes the local file.
- Kokoro models (~340 MB) and the `whisper.cpp` build are **not** committed; each
  project's README documents how to recreate them.
- CI: `video-ci.yml` runs `npm ci` + `npx tsc --noEmit` for every project here on
  PRs that touch `video/**`. Nothing is rendered in CI. Because `video/` cannot
  affect the Astro app, `astro-build-deploy.yml` skips its Docker jobs for
  video-only PRs while still reporting the required contexts.

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
4. Commit source only — `out/` is generated, so it stays untracked.
