import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Card, Connector, Headline } from "../components/Card";
import { C, F } from "../theme";

export const Agents: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame, [40, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Headline lines={["One word", "wakes it."]} top={318} size={116} />

      <Card x={92} y={800} w={300} h={230} icon="chat" label="Team Chat" sub="hotfix?" labelSize={33} iconSize={64} delay={6} />
      <Card
        x={688}
        y={800}
        w={300}
        h={230}
        icon="graph"
        label="Pull Request"
        sub="#482 · ready"
        labelSize={30}
        iconSize={60}
        delay={34}
        variant="amber"
      />

      <Connector d="M 404 880 H 676" delay={22} />
      <Connector d="M 676 968 H 416" delay={32} dashed />

      <div
        style={{
          position: "absolute",
          left: 92,
          top: 1120,
          fontFamily: F.mono,
          fontSize: 23,
          letterSpacing: 3,
          color: C.soft,
          opacity: pulse,
        }}
      >
        IMPLEMENTS · OPENS PR · REPORTS BACK
      </div>
    </AbsoluteFill>
  );
};
