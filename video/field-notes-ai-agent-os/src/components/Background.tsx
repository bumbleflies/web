import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C, W, H, F, G } from "../theme";

/** Cream paper, amber blobs and a dot grid — the Field Notes card language. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 300], [0, 26], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${C.paper} 0%, #fdf8ee 55%, ${C.paperDeep} 100%)`, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          right: -320,
          top: -300 + drift * 0.4,
          width: 900,
          height: 900,
          borderRadius: 999,
          background: C.blob,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -380,
          top: 620 - drift * 0.5,
          width: 720,
          height: 720,
          borderRadius: 999,
          background: C.blob,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -280,
          bottom: -260,
          width: 760,
          height: 760,
          borderRadius: 999,
          background: C.blob,
          opacity: 0.42,
        }}
      />
      <DotField x={70} y={880} cols={5} rows={5} />
    </AbsoluteFill>
  );
};

const DotField: React.FC<{ x: number; y: number; cols: number; rows: number }> = ({ x, y, cols, rows }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: 0.5 }}>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} style={{ display: "flex", gap: 26, marginBottom: 26 }}>
        {Array.from({ length: cols }).map((_, c) => (
          <span key={c} style={{ width: 7, height: 7, borderRadius: 99, background: C.amber }} />
        ))}
      </div>
    ))}
  </div>
);

export const Header: React.FC<{ index: string }> = ({ index }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: G.header,
        left: G.left,
        right: G.right,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: a,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ width: 56, height: 4, background: C.amber }} />
        <span style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: 4, color: C.amberText }}>FIELD NOTES</span>
      </div>
      <span style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: 3, color: "rgba(107,97,84,0.75)" }}>{index}</span>
    </div>
  );
};

export const Progress: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: G.left, right: G.right, bottom: 92, height: 3, background: C.rule }}>
      <div style={{ width: `${p * 100}%`, height: "100%", background: C.amber, borderRadius: 2 }} />
    </div>
  );
};

/** One row of the shared left-aligned grid. */
export const headlineWidth = W - G.left - G.right;
export const canvas = { w: W - G.left - G.right, h: H };
