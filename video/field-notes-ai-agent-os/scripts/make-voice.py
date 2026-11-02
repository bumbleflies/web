"""Synthesize narration with Kokoro ONNX, one file per scene.

Splitting by scene is the point: it lets the scene lengths in your Remotion
composition come from measured audio instead of a guess.

Usage:
    python make-voice.py --plan plan.json --out public/content/<project>/audio
    python make-voice.py --line earth "July 1969. Apollo 11 leaves Earth." --out ./audio

plan.json:
    [{ "scene": "earth", "text": "July 1969.", "speed": 0.92 }]
"""
from __future__ import annotations

import argparse
import json
import wave
from pathlib import Path

import numpy as np

FPS = 30


def write_wav(path: Path, samples: np.ndarray, sr: int) -> None:
    pcm = (np.clip(samples, -1.0, 1.0) * 32767).astype(np.int16)
    with wave.open(str(path), "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())


def load_kokoro(model: str, voices: str):
    from kokoro_onnx import Kokoro

    return Kokoro(model, voices)


def synthesize(kokoro, text: str, voice: str, speed: float, lang: str):
    samples, sr = kokoro.create(text, voice=voice, speed=speed, lang=lang)
    return np.asarray(samples, dtype=np.float32), sr


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--model", default="kokoro.onnx")
    ap.add_argument("--voices", default="voices.bin")
    ap.add_argument("--voice", default="af_heart")
    ap.add_argument("--lang", default="en-us")
    ap.add_argument("--speed", type=float, default=0.92)
    ap.add_argument("--plan", help="JSON list of {scene, text, speed?}")
    ap.add_argument("--line", nargs=2, metavar=("SCENE", "TEXT"), action="append")
    ap.add_argument("--out", required=True, help="output directory")
    args = ap.parse_args()

    lines = []
    if args.plan:
        lines = json.loads(Path(args.plan).read_text())
    elif args.line:
        lines = [{"scene": s, "text": t} for s, t in args.line]
    else:
        ap.error("provide --plan or at least one --line")

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    kokoro = load_kokoro(args.model, args.voices)

    durations: dict[str, int] = {}
    for item in lines:
        scene = item["scene"]
        speed = float(item.get("speed", args.speed))
        samples, sr = synthesize(kokoro, item["text"], args.voice, speed, args.lang)

        write_wav(out / f"vo-{scene}.wav", samples, sr)

        frames = int(round(len(samples) / sr * FPS))
        durations[scene] = frames
        print(f"{scene:12s} {len(samples) / sr:6.2f}s  {frames:5d} frames")

    # Scene lengths for your composition, plus a concatenated track if you want one.
    (out / "durations.json").write_text(json.dumps(durations, indent=2))
    print(f"\nwrote {out / 'durations.json'}")
    print("Set each scene's durationInFrames from this file, not by hand.")


if __name__ == "__main__":
    main()
