import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  COLORS,
  FONT_FAMILY,
  SCENE_PADDING,
  SUBTITLE_SIZE,
} from "../constants";
import { StatScene } from "../schema";
import { BackgroundGlow, TitleAccent } from "./Decorations";

export const Stat: React.FC<StatScene> = ({ title, stats }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Numbers count up over first 70% of duration
  const countDuration = durationInFrames * 0.7;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.surface,
        padding: SCENE_PADDING,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
        }}
      >
        {title}
      </div>
      <TitleAccent opacity={titleOpacity} />
      <div style={{ marginBottom: 40 }} />

      {/* Stats grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 60,
          width: "100%",
        }}
      >
        {stats.map((stat, i) => {
          const startFrame = i * 10;
          const cardOpacity = interpolate(frame - startFrame, [0, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const cardScale = spring({
            frame: frame - startFrame,
            fps,
            config: { damping: 80, mass: 0.5 },
          });

          const currentValue = interpolate(
            frame,
            [startFrame, startFrame + countDuration],
            [0, stat.value],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const displayValue = Number.isInteger(stat.value)
            ? Math.round(currentValue)
            : Math.round(currentValue * 10) / 10;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 60,
              }}
            >
              {/* Divider between stats */}
              {i > 0 && (
                <div
                  style={{
                    width: 1,
                    height: 80,
                    background: `linear-gradient(180deg, transparent, ${COLORS.primary}60, transparent)`,
                    opacity: cardOpacity,
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  opacity: cardOpacity,
                  transform: `scale(${cardScale})`,
                  minWidth: 200,
                }}
              >
                {/* Value */}
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 96,
                    fontWeight: 800,
                    lineHeight: 1,
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.prefix ?? ""}
                  {displayValue}
                  {stat.suffix ?? ""}
                </div>
                {/* Label */}
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 24,
                    color: COLORS.textMuted,
                    marginTop: 12,
                    textAlign: "center",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
