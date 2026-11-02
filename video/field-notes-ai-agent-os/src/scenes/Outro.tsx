import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Headline } from "../components/Card";
import { ArchDiagram } from "../components/ArchDiagram";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const note = interpolate(frame, [80, 104], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Headline lines={["Still running."]} top={300} size={112} />

      <ArchDiagram x={236} y={470} scale={0.78} delay={14} stagger={4} pulse />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1216,
          textAlign: "center",
          fontFamily: "'Geist Mono', monospace",
          fontSize: 21,
          letterSpacing: 3,
          color: "#6b6154",
          opacity: note,
        }}
      >
        AUTONOMY · WITH A HAND ON THE BRAKE
      </div>
    </AbsoluteFill>
  );
};
