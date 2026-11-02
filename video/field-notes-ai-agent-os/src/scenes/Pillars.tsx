import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Card, Headline } from "../components/Card";
import { Connector } from "../components/Card";

export const Pillars: React.FC = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [56, 88], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Headline lines={["Four pillars."]} top={318} size={112} />

      <Card x={92} y={744} w={400} h={196} icon="graph" label="Nervous system" sub="n8n" iconSize={52} labelSize={31} delay={4} />
      <Card x={588} y={744} w={400} h={196} icon="cube" label="Skill market" sub="plugins" iconSize={52} labelSize={31} delay={14} />
      <Card x={92} y={1004} w={400} h={196} icon="terminal" label="Agents" sub="daemons" iconSize={52} labelSize={31} delay={24} variant="amber" />
      <Card x={588} y={1004} w={400} h={196} icon="chart" label="Cockpit" sub="the day" iconSize={52} labelSize={31} delay={34} />

      <div
        style={{
          position: "absolute",
          left: 92,
          right: 92,
          top: 1252,
          height: 3,
          background: "#c08a2e",
          transformOrigin: "left center",
          transform: `scaleX(${line})`,
        }}
      />
    </AbsoluteFill>
  );
};
