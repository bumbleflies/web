import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { C, F, W, H } from "../theme";
import { Icon } from "./Icons";

type IconName = React.ComponentProps<typeof Icon>["name"];

export const Card: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  icon: IconName;
  label: string;
  sub?: string;
  variant?: "default" | "amber" | "ghost";
  row?: boolean;
  delay?: number;
  iconSize?: number;
  labelSize?: number;
  dim?: boolean;
  strike?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({
  x,
  y,
  w,
  h,
  icon,
  label,
  sub,
  variant = "default",
  row = false,
  delay = 0,
  iconSize = 58,
  labelSize = 31,
  dim = false,
  strike = false,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 110 } });

  const amber = variant === "amber";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 20,
        background: amber ? C.amber : variant === "ghost" ? "transparent" : C.card,
        border: `2px solid ${variant === "ghost" ? C.rule : C.ink}`,
        boxShadow:
          variant === "ghost"
            ? "none"
            : amber
              ? "0 10px 26px rgba(192,138,46,0.28)"
              : "0 6px 0 rgba(31,27,22,0.05), 0 12px 30px rgba(31,27,22,0.05)",
        display: "flex",
        flexDirection: row ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        gap: row ? 22 : 12,
        opacity: s * (dim ? 0.5 : 1),
        transform: `translateY(${interpolate(s, [0, 1], [34, 0])}px) scale(${interpolate(s, [0, 1], [0.94, 1])})`,
        ...style,
      }}
    >
      <Icon name={icon} size={iconSize} color={C.ink} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: row ? "flex-start" : "center" }}>
        <span
          style={{
            fontFamily: F.sans,
            fontSize: labelSize,
            fontWeight: 500,
            letterSpacing: -0.2,
            color: C.ink,
            textDecoration: strike ? "line-through" : "none",
            textDecorationThickness: 3,
          }}
        >
          {label}
        </span>
        {sub ? (
          <span
            style={{
              fontFamily: F.mono,
              fontSize: 19,
              letterSpacing: 2,
              color: amber ? "rgba(31,27,22,0.7)" : C.soft,
              marginTop: 4,
            }}
          >
            {sub}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
};

/** Serif headline, one line at a time, rising into place. */
export const Headline: React.FC<{
  lines: Array<React.ReactNode>;
  top?: number;
  size?: number;
  delay?: number;
  align?: "left" | "center";
}> = ({ lines, top = 300, size = 104, delay = 0, align = "left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 92,
        right: 92,
        top,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
      }}
    >
      {lines.map((line, i) => {
        const s = spring({ frame: frame - delay - i * 5, fps, config: { damping: 18, stiffness: 90 } });
        return (
          <div
            key={i}
            style={{
              fontFamily: F.serif,
              fontSize: size,
              lineHeight: 1.02,
              letterSpacing: -2,
              color: C.ink,
              opacity: s,
              transform: `translateY(${interpolate(s, [0, 1], [28, 0])}px)`,
              textAlign: align,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};

/** Connector line in absolute page coordinates; draws itself in. */
export const Connector: React.FC<{
  d: string;
  delay?: number;
  dashed?: boolean;
  both?: boolean;
  color?: string;
  width?: number;
  w?: number;
  h?: number;
}> = ({ d, delay = 0, dashed = false, both = false, color = C.ink, width = 2.6, w = W, h = H }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 45 } });
  const id = React.useId().replace(/:/g, "");
  const marker = `a-${id}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <marker id={marker} viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill={color} />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={dashed ? "0.03 0.025" : "1"}
        strokeDashoffset={dashed ? 0 : 1 - s}
        opacity={dashed ? interpolate(s, [0, 1], [0, 0.9]) : 1}
        markerEnd={`url(#${marker})`}
        markerStart={both ? `url(#${marker})` : undefined}
      />
    </svg>
  );
};
