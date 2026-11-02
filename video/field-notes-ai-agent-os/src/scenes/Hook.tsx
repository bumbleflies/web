import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Card, Headline } from "../components/Card";
import { C, F } from "../theme";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = [0, 1, 2].map((i) => interpolate(Math.sin((frame - 24) / 6 + i * 0.9), [-1, 1], [0.25, 1]));
  const badge = interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Headline lines={["Do you just", "type it?"]} top={318} size={116} />

      <Card x={214} y={790} w={652} h={272} icon="chat" label="Team Chat" labelSize={40} iconSize={84} delay={6}>
        <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
          {dots.map((d, i) => (
            <span
              key={i}
              style={{
                width: 18,
                height: 18,
                borderRadius: 99,
                background: C.ink,
                opacity: d,
                transform: `translateY(${(1 - d) * -6}px)`,
              }}
            />
          ))}
          <span style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: 2, color: C.soft, marginLeft: 14, alignSelf: "center" }}>
            A CLIENT ASKS
          </span>
        </div>
      </Card>

      <div
        style={{
          position: "absolute",
          left: 268,
          top: 712,
          width: 96,
          height: 96,
          borderRadius: 99,
          background: C.amber,
          border: `2px solid ${C.ink}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: F.serif,
          fontSize: 56,
          color: C.ink,
          opacity: badge,
          transform: `scale(${0.8 + badge * 0.2})`,
        }}
      >
        ?
      </div>
    </AbsoluteFill>
  );
};
