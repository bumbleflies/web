import React from "react";
import { C } from "../theme";
import { Card, Connector } from "./Card";

/** Local design box for the architecture diagram (matches the Field Notes poster). */
export const ARCH = { w: 760, h: 900 };

const N = {
  chat: { x: 20, y: 0, w: 230, h: 150 },
  ticket: { x: 510, y: 0, w: 230, h: 150 },
  agents: { x: 190, y: 220, w: 380, h: 150 },
  skills: { x: 20, y: 400, w: 230, h: 150 },
  cockpit: { x: 510, y: 400, w: 230, h: 150 },
  pr: { x: 265, y: 580, w: 230, h: 150 },
  guard: { x: 265, y: 760, w: 230, h: 150 },
};

/**
 * The whole system as one diagram: two foundations on top, agents in amber,
 * the pillars around it, the guardrail at the bottom.
 */
export const ArchDiagram: React.FC<{
  x: number;
  y: number;
  scale?: number;
  delay?: number;
  /** Extra delay per node, on top of `delay`. */
  stagger?: number;
  pulse?: boolean;
  hide?: Array<keyof typeof N>;
}> = ({ x, y, scale = 0.74, delay = 0, stagger = 6, pulse = false, hide = [] }) => {
  const d = (i: number) => delay + i * stagger;
  const shown = (k: keyof typeof N) => !hide.includes(k);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: ARCH.w,
        height: ARCH.h,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      {shown("chat") && shown("ticket") && (
        <Connector d="M 252 72 H 508" delay={d(2)} both w={ARCH.w} h={ARCH.h} />
      )}
      {shown("chat") && shown("agents") && (
        <Connector d="M 135 152 V 186 H 380 V 218" delay={d(3)} w={ARCH.w} h={ARCH.h} />
      )}
      {shown("agents") && shown("skills") && (
        <Connector d="M 188 296 H 128 V 476 H 248" delay={d(4)} w={ARCH.w} h={ARCH.h} />
      )}
      {shown("agents") && shown("cockpit") && (
        <Connector d="M 572 296 H 632 V 476 H 512" delay={d(4)} w={ARCH.w} h={ARCH.h} />
      )}
      {shown("agents") && shown("pr") && (
        <Connector d="M 380 372 V 578" delay={d(5)} w={ARCH.w} h={ARCH.h} />
      )}
      {shown("pr") && shown("guard") && (
        <Connector d="M 380 732 V 758" delay={d(6)} dashed w={ARCH.w} h={ARCH.h} />
      )}
      {shown("cockpit") && shown("guard") && (
        <Connector d="M 625 552 V 690 C 625 790 566 835 497 835" delay={d(6)} dashed w={ARCH.w} h={ARCH.h} />
      )}

      {shown("chat") && <Card {...N.chat} icon="chat" label="Team Chat" delay={d(0)} />}
      {shown("ticket") && <Card {...N.ticket} icon="ticket" label="Ticket" delay={d(1)} />}
      {shown("agents") && (
        <Card
          {...N.agents}
          icon="sparkle"
          label="Agents"
          row
          variant="amber"
          delay={d(2)}
          iconSize={54}
          labelSize={46}
          style={pulse ? { boxShadow: "0 10px 40px rgba(247,185,62,0.55)" } : undefined}
        />
      )}
      {shown("skills") && <Card {...N.skills} icon="cube" label="Skills" delay={d(3)} />}
      {shown("cockpit") && <Card {...N.cockpit} icon="chart" label="Cockpit" delay={d(3)} />}
      {shown("pr") && <Card {...N.pr} icon="graph" label="Pull Request" delay={d(4)} />}
      {shown("guard") && <Card {...N.guard} icon="shield" label="Guardrails" delay={d(5)} />}
    </div>
  );
};

export const amberHint = C.amber;
