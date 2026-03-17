import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_FAMILY } from "../constants";
import { SubtitleData, ticksToFrames } from "../types/subtitle";

const FADE_FRAMES = 5;

export const SubtitleOverlay: React.FC<{ data: SubtitleData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  for (const boundary of data.boundaries) {
    const startFrame = ticksToFrames(boundary.offset, fps);
    const endFrame = ticksToFrames(boundary.offset + boundary.duration, fps);

    if (frame >= startFrame - FADE_FRAMES && frame <= endFrame + FADE_FRAMES) {
      const opacity = interpolate(
        frame,
        [
          startFrame - FADE_FRAMES,
          startFrame,
          endFrame,
          endFrame + FADE_FRAMES,
        ],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );

      return (
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 80,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              borderRadius: 12,
              padding: "16px 32px",
              maxWidth: "80%",
              opacity,
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontFamily: FONT_FAMILY,
                fontSize: 32,
                lineHeight: 1.4,
                textAlign: "center",
                display: "block",
              }}
            >
              {boundary.text}
            </span>
          </div>
        </AbsoluteFill>
      );
    }
  }

  return null;
};
