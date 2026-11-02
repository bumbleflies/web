import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { ArchDiagram } from "../components/ArchDiagram";
import { C, F, G } from "../theme";

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kicker = spring({ frame, fps, config: { damping: 18 } });
  const title = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 90 } });
  const url = interpolate(frame, [26, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const brand = interpolate(frame, [44, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 150, left: G.left, display: "flex", alignItems: "center", gap: 22, opacity: kicker }}>
        <div style={{ width: 56, height: 4, background: C.amber }} />
        <span style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: 4, color: C.amberText }}>FIELD NOTES</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: G.left,
          right: G.left,
          top: 250,
          fontFamily: F.serif,
          fontSize: 96,
          lineHeight: 1.03,
          letterSpacing: -2,
          color: C.ink,
          opacity: title,
          transform: `translateY(${interpolate(title, [0, 1], [26, 0])}px)`,
        }}
      >
        What I actually
        <br />
        built instead of
        <br />
        “adding AI”
      </div>

      <div
        style={{
          position: "absolute",
          left: G.left,
          top: 660,
          fontFamily: F.mono,
          fontSize: 25,
          letterSpacing: 0.5,
          color: C.soft,
          opacity: url,
        }}
      >
        bumbleflies.de/en/blog/ai-agent-operating-system
      </div>

      <ArchDiagram x={254} y={780} scale={0.62} delay={30} stagger={3} />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 150,
          textAlign: "center",
          fontFamily: F.serif,
          fontSize: 52,
          color: "#8a6a3f",
          opacity: brand,
        }}
      >
        bumbleflies
      </div>
    </AbsoluteFill>
  );
};
