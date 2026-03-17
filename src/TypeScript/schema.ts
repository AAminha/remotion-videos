import { zColor } from "@remotion/zod-types";
import { CalculateMetadataFunction } from "remotion";
import { z } from "zod";
import { sceneSchema } from "../schema";

export type { Scene } from "../schema";

// ── TypeScript 영상 전용 설정 스키마 ──────────────────────────────

export const typeScriptSchema = z.object({
  title: z.string(),
  scenes: z.array(sceneSchema).min(1),
  fps: z.number().default(30),
  background: zColor().optional(),
});

export type TypeScriptProps = z.infer<typeof typeScriptSchema>;

// ── Dynamic metadata ───────────────────────────────────────────────

export const calculateTypeScriptMetadata: CalculateMetadataFunction<
  TypeScriptProps
> = ({ props }) => {
  const fps = props.fps ?? 30;
  const totalSeconds = props.scenes.reduce(
    (sum, scene) => sum + scene.duration,
    0,
  );
  const durationInFrames = Math.max(1, Math.round(totalSeconds * fps));
  return { durationInFrames, fps, width: 1920, height: 1080 };
};
