import React from "react";
import { AbsoluteFill } from "remotion";
import { Card, Connector, Headline } from "../components/Card";

export const Answer: React.FC = () => (
  <AbsoluteFill>
    <Headline lines={["Not bought.", "Compiled."]} top={318} size={116} />

    <Card x={92} y={820} w={300} h={230} icon="sparkle" label="Purchased" iconSize={64} labelSize={32} dim strike delay={8} />
    <Card x={688} y={820} w={300} h={230} icon="code" label="Compiled" iconSize={64} labelSize={32} delay={20} />

    <Connector d="M 402 935 H 676" delay={38} />
  </AbsoluteFill>
);
