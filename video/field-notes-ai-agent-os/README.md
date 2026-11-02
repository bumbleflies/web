# Field Notes — "What I actually built instead of adding AI"

A 57-second vertical (1080×1920) teaser for
`bumbleflies.de/en/blog/ai-agent-operating-system`, built entirely locally with the
`remoguh` skill pipeline: Kokoro narration, whisper.cpp captions, hand-drawn SVG scenes,
Remotion.

Output: `out/ai-agent-os.mp4`

## Regenerate

```bash
# 1. narration — one wav per scene, measured frames in durations.json
npm run voice
npm run timing          # durations.json -> src/timing.ts + scenes.json
npm run voice:16k       # 16 kHz mono for whisper (+0.5 s pad so the last word isn't clipped)
npm run captions        # whisper.cpp tokens -> src/caption-tokens.ts

# 2. look at exact frames, never ffmpeg -ss
npx remotion still AiOsSample /tmp/f.png --frame=1350

# 3. render
npm run render
```

Edit `plan.json` to change the script; edit `src/scenes/*.tsx` to change the visuals.
Everything that is timed (scene starts, caption cues) is generated — never hand-edit
`src/timing.ts` or `src/caption-tokens.ts`.

## Layout

- `src/Video.tsx` — scene timeline, captions, end card
- `src/scenes/*.tsx` — one scene per narration line, composed from cards
- `src/components/Background.tsx` — cream paper, amber blobs, dot grid, header, progress
- `src/components/Card.tsx` — the rounded icon card, serif `Headline`, `Connector` arrows
- `src/components/Icons.tsx` — line icon set (chat, ticket, cube, shield, …)
- `src/components/ArchDiagram.tsx` — the full architecture diagram (outro + end card)
- `src/components/Captions.tsx` — word-by-word captions from the audio
- `scripts/` — voice/caption/timing tooling copied from the skill

## Visual language

Cream `#fbf4e6`, amber `#f7b93e`, ink `#1f1b16`, Instrument Serif for the scene
headline, Geist for card labels, Geist Mono for kickers and micro-copy. One card per
idea, and the single most important card in a beat is filled amber. Arrows are ink;
dashed arrows mean "async / fires later". The diagram is the recurring motif and the
poster is the end card.

## Gotchas found while building this

- `make-captions.mjs` must live inside the project: Node resolves `@remotion/*` from the
  script's own directory, so running it straight out of `~/.claude/skills/remoguh/templates`
  fails with `ERR_MODULE_NOT_FOUND`.
- Pass `--audio-dir` as an **absolute** path. `transcribe()` runs whisper with a different
  cwd, so relative paths report "input file not found".
- Every `interpolate()` that drives a position needs `extrapolateLeft: "clamp"`, not just
  `extrapolateRight`. Without it, before an animation starts the value runs *negative* and
  the element flies off-screen (the "deploy prod" chip did exactly that at first).
- Add `-af apad=pad_dur=0.5` before the 16 kHz conversion. whisper.cpp dropped the final
  words ("and a cockpit") on a hard-cut wav; padding the silence recovered them.
- Kokoro v1.0 ships no German voice (`de_*`), so this is narrated from the English post.
