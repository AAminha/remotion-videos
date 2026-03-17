import { AbsoluteFill, Series } from "remotion";
import { COLORS } from "../constants";
import { SceneRenderer } from "../templates/SceneRenderer";
import { SceneWithAudio } from "../templates/SceneWithAudio";
import { TypeScriptProps } from "./schema";

export const TypeScript: React.FC<TypeScriptProps> = ({
  scenes,
  fps,
  background,
}) => {
  const resolvedFps = fps ?? 30;

  return (
    <AbsoluteFill style={{ backgroundColor: background ?? COLORS.bg }}>
      <Series>
        {scenes.map((scene, i) => (
          <Series.Sequence
            key={i}
            durationInFrames={Math.round(scene.duration * resolvedFps)}
          >
            <SceneWithAudio compositionId="TypeScript" sceneIndex={i}>
              <SceneRenderer scene={scene} />
            </SceneWithAudio>
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
