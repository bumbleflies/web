import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Card, Connector, Headline } from "../components/Card";
import { C, F } from "../theme";

export const Foundations: React.FC = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [56, 84], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Headline lines={["Two foundations."]} top={318} size={112} />

      <Card x={92} y={780} w={310} h={240} icon="ticket" label="Ticket" sub="state" labelSize={36} iconSize={68} delay={6} />
      <Card x={678} y={780} w={310} h={240} icon="chat" label="Team Chat" sub="interaction" labelSize={36} iconSize={68} delay={16} />

      <Connector d="M 414 900 H 666" delay={34} both />

      <div
        style={{
          position: "absolute",
          left: 92,
          right: 92,
          top: 1110,
          height: 2,
          background: C.rule,
          transformOrigin: "left center",
          transform: `scaleX(${line})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 92,
          top: 1136,
          fontFamily: F.mono,
          fontSize: 23,
          letterSpacing: 3,
          color: C.soft,
          opacity: line,
        }}
      >
        EVERYTHING ELSE STANDS HERE
      </div>
    </AbsoluteFill>
  );
};
