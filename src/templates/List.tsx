import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BODY_SIZE,
  COLORS,
  FONT_FAMILY,
  SCENE_PADDING,
  SUBTITLE_SIZE,
} from "../constants";
import { ListScene } from "../schema";
import { BackgroundGlow, TitleAccent } from "./Decorations";

export const List: React.FC<ListScene> = ({ title, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 100, mass: 0.5 },
  });
  const titleOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Space items evenly: first item appears at frame 15, rest staggered
  const itemDelay = 15;
  const itemStart = 15;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.surface,
        padding: SCENE_PADDING,
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <BackgroundGlow />

      {/* Title */}
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: SUBTITLE_SIZE,
          fontWeight: 700,
          color: COLORS.accent,
          marginBottom: 12,
          opacity: titleOpacity,
          transform: `scale(${titleProgress})`,
          transformOrigin: "left center",
        }}
      >
        {title}
      </div>
      <TitleAccent opacity={titleOpacity} />

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {items.map((item, i) => {
          const startFrame = itemStart + i * itemDelay;
          const itemOpacity = interpolate(frame - startFrame, [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const itemX = interpolate(frame - startFrame, [0, 12], [-40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const dotScale = spring({
            frame: frame - startFrame,
            fps,
            config: { damping: 80, mass: 0.4 },
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity: itemOpacity,
                transform: `translateX(${itemX}px)`,
              }}
            >
              {/* Number indicator */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
                  flexShrink: 0,
                  transform: `scale(${dotScale})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT_FAMILY,
                  fontSize: 16,
                  fontWeight: 700,
                  color: COLORS.text,
                }}
              >
                {i + 1}
              </div>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: BODY_SIZE,
                  color: COLORS.text,
                  lineHeight: 1.4,
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
