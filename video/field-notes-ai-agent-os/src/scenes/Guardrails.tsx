import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Card, Connector, Headline } from "../components/Card";
import { C, F } from "../theme";

export const Guardrails: React.FC = () => {
  const frame = useCurrentFrame();
  const note = interpolate(frame, [60, 84], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Headline lines={["Verify with code."]} top={318} size={112} />

      <Card x={92} y={830} w={280} h={220} icon="sparkle" label="Model" sub="judgement" labelSize={34} iconSize={64} delay={6} />
      <Card x={600} y={800} w={390} h={280} icon="shield" label="Guardrails" sub="regex · block if in doubt" labelSize={38} iconSize={76} delay={22} variant="amber" />

      <Connector d="M 384 940 H 588" delay={18} />

      <div
        style={{
          position: "absolute",
          left: 92,
          right: 92,
          top: 1150,
          fontFamily: F.mono,
          fontSize: 22,
          letterSpacing: 2.5,
          color: C.soft,
          opacity: note,
        }}
      >
        EVERY GUARDRAIL CAME FROM A MISTAKE
      </div>
    </AbsoluteFill>
  );
};
