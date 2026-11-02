import React from "react";
import { C } from "../theme";

type Name =
  | "chat"
  | "ticket"
  | "sparkle"
  | "cube"
  | "chart"
  | "graph"
  | "terminal"
  | "shield"
  | "laptop"
  | "check"
  | "code"
  | "person";

const sw = 2.6;

export const Icon: React.FC<{ name: Name; size?: number; color?: string }> = ({
  name,
  size = 64,
  color = C.ink,
}) => {
  const common = { fill: "none", stroke: color, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      {name === "chat" && (
        <>
          <path d="M7 9 H33 V26 H18 L11 33 V26 H7 Z" {...common} />
          <circle cx="15" cy="17.5" r="1.8" fill={color} />
          <circle cx="20" cy="17.5" r="1.8" fill={color} />
          <circle cx="25" cy="17.5" r="1.8" fill={color} />
        </>
      )}
      {name === "ticket" && (
        <>
          <path d="M5 12 H35 V17 A3.5 3.5 0 0 0 35 24 V29 H5 V24 A3.5 3.5 0 0 0 5 17 Z" {...common} />
          <path d="M12 17 H26 M12 22 H22" {...common} />
        </>
      )}
      {name === "sparkle" && (
        <path
          d="M20 5 L24 15 L34 20 L24 25 L20 35 L16 25 L6 20 L16 15 Z"
          fill={color}
          stroke={color}
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      )}
      {name === "cube" && (
        <>
          <path d="M20 5 L34 12.5 V27.5 L20 35 L6 27.5 V12.5 Z" {...common} />
          <path d="M6 12.5 L20 20 L34 12.5 M20 20 V35" {...common} />
        </>
      )}
      {name === "chart" && (
        <>
          <path d="M9 31 V22" {...common} strokeWidth={5} />
          <path d="M20 31 V14" {...common} strokeWidth={5} />
          <path d="M31 31 V8" {...common} strokeWidth={5} />
        </>
      )}
      {name === "graph" && (
        <>
          <circle cx="9" cy="10" r="4" {...common} />
          <circle cx="31" cy="18" r="4" {...common} />
          <circle cx="17" cy="31" r="4" {...common} />
          <path d="M12 13 L28 17 M29 21 L20 28" {...common} />
        </>
      )}
      {name === "terminal" && (
        <>
          <rect x="4" y="7" width="32" height="26" rx="3" {...common} />
          <path d="M11 17 L15 21 L11 25" {...common} />
          <path d="M19 25 H27" {...common} />
        </>
      )}
      {name === "shield" && (
        <>
          <path d="M20 4 L33 9 V21 C33 29 20 36 20 36 C20 36 7 29 7 21 V9 Z" {...common} />
          <path d="M14 20 L18 25 L27 15" {...common} />
        </>
      )}
      {name === "laptop" && (
        <>
          <rect x="9" y="9" width="22" height="15" rx="2" {...common} />
          <path d="M5 29 H35" {...common} />
        </>
      )}
      {name === "check" && (
        <>
          <circle cx="20" cy="20" r="14" {...common} />
          <path d="M13 20 L18 26 L28 14" {...common} />
        </>
      )}
      {name === "code" && (
        <>
          <path d="M14 12 L6 20 L14 28" {...common} />
          <path d="M26 12 L34 20 L26 28" {...common} />
        </>
      )}
      {name === "person" && (
        <>
          <circle cx="20" cy="14" r="6" {...common} />
          <path d="M8 33 C8 26 14 23 20 23 C26 23 32 26 32 33" {...common} />
        </>
      )}
    </svg>
  );
};
