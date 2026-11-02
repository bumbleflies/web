import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { CAPTION_TOKENS, type Token } from "../caption-tokens";
import { C, F } from "../theme";

/** Tokens on one page stay on screen together for at most this long. */
const COMBINE_FRAMES = 54;

type Page = { from: number; to: number; tokens: Token[] };

function buildPages(tokens: Token[]): Page[] {
  const pages: Page[] = [];
  for (const token of tokens) {
    const last = pages[pages.length - 1];
    const tooLong = last !== undefined && token.to - last.from > COMBINE_FRAMES;
    if (!last || (token.text.startsWith(" ") && tooLong)) {
      pages.push({ from: token.from, to: token.to, tokens: [token] });
    } else {
      last.tokens.push(token);
      last.to = token.to;
    }
  }
  return pages;
}

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const pages = buildPages(CAPTION_TOKENS);

  const page = pages.find((p) => frame >= p.from && frame <= p.to);
  if (!page) return null;

  const fadeIn = interpolate(frame, [page.from, page.from + 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 300,
        paddingLeft: 82,
        paddingRight: 82,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 18px",
          opacity: fadeIn,
          transform: `translateY(${interpolate(fadeIn, [0, 1], [14, 0])}px)`,
        }}
      >
        {page.tokens.map((token) => {
          const active = frame >= token.from && frame < token.to;
          const spoken = frame >= token.to;
          return (
            <span
              key={`${token.from}-${token.text}`}
              style={{
                fontSize: 58,
                lineHeight: 1.26,
                fontWeight: 600,
                fontFamily: F.sans,
                letterSpacing: -0.6,
                color: active ? C.amberText : spoken ? C.ink : "rgba(31,27,22,0.32)",
                transform: active ? "scale(1.05)" : "scale(1)",
                display: "inline-block",
              }}
            >
              {token.text.trim()}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Softens the lower third toward paper so captions never fight the scene. */
export const CaptionScrim: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(to bottom, rgba(251,244,230,0) 66%, rgba(251,244,230,0.82) 76%, rgba(251,244,230,0.99) 84%)`,
      pointerEvents: "none",
    }}
  />
);
