import React from "react";
import { AbsoluteFill } from "remotion";
import { Card, Connector, Headline } from "../components/Card";

export const Skills: React.FC = () => (
  <AbsoluteFill>
    <Headline lines={["One script.", "Three runtimes."]} top={310} size={108} />

    <Card x={290} y={790} w={500} h={200} icon="cube" label="Skill" sub="v1.4.0" row variant="amber" iconSize={64} labelSize={44} delay={6} />

    <Card x={70} y={1120} w={280} h={170} icon="person" label="Person" labelSize={29} iconSize={52} delay={26} />
    <Card x={400} y={1120} w={280} h={170} icon="terminal" label="Agent" labelSize={29} iconSize={52} delay={34} />
    <Card x={730} y={1120} w={280} h={170} icon="check" label="Pipeline" labelSize={29} iconSize={52} delay={42} />

    <Connector d="M 210 1112 C 210 1010, 330 1010, 390 994" delay={30} dashed />
    <Connector d="M 540 1112 V 994" delay={36} dashed />
    <Connector d="M 870 1112 C 870 1010, 750 1010, 690 994" delay={44} dashed />
  </AbsoluteFill>
);
