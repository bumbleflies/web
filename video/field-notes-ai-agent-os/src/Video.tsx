import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SCENES, END_CARD_FROM, TOTAL } from "./timing";
import { Background, Header, Progress } from "./components/Background";
import { Captions, CaptionScrim } from "./components/Captions";
import { Hook } from "./scenes/Hook";
import { Answer } from "./scenes/Answer";
import { Foundations } from "./scenes/Foundations";
import { Pillars } from "./scenes/Pillars";
import { Agents } from "./scenes/Agents";
import { Skills } from "./scenes/Skills";
import { Guardrails } from "./scenes/Guardrails";
import { Outro } from "./scenes/Outro";
import { EndCard } from "./scenes/EndCard";

const SCENE_COMPONENTS: Record<string, React.FC> = {
  hook: Hook,
  answer: Answer,
  foundations: Foundations,
  pillars: Pillars,
  agents: Agents,
  skills: Skills,
  guardrails: Guardrails,
  outro: Outro,
};

export const Video: React.FC = () => (
  <AbsoluteFill>
    <Background />

    {SCENES.map((scene, i) => {
      const Comp = SCENE_COMPONENTS[scene.id];
      return (
        <Sequence key={scene.id} from={scene.start} durationInFrames={scene.duration} name={scene.id}>
          <AbsoluteFill>
            <Audio src={staticFile(`content/ai-os/audio/vo-${scene.id}.wav`)} />
            <Header index={`${String(i + 1).padStart(2, "0")} / 08`} />
            <Comp />
            <Progress durationInFrames={scene.duration} />
          </AbsoluteFill>
        </Sequence>
      );
    })}

    <CaptionScrim />
    <Captions />

    <Sequence from={END_CARD_FROM} durationInFrames={TOTAL - END_CARD_FROM} name="endcard">
      <EndCard />
    </Sequence>
  </AbsoluteFill>
);
