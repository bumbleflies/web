import { Composition } from "remotion";
import { Video } from "./Video";
import { TOTAL } from "./timing";

export const RemotionRoot: React.FC = () => (
  <Composition id="AiOsSample" component={Video} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
);
