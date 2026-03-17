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
import { FlowScene } from "../schema";
import { BackgroundGlow, TitleAccent } from "./Decorations";

export const Flow: React.FC<FlowScene> = ({ title, steps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  const stepDelay = 18;

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
          textAlign: "center",
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <TitleAccent opacity={titleOpacity} />
      </div>
      <div style={{ marginBottom: 40 }} />

      {/* Steps row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          position: "relative",
        }}
      >
        {steps.map((step, i) => {
          const startFrame = i * stepDelay;
          const stepScale = spring({
            frame: frame - startFrame,
            fps,
            config: { damping: 80, mass: 0.5 },
          });
          const stepOpacity = interpolate(frame - startFrame, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const arrowProgress = interpolate(
            frame - startFrame - 5,
            [0, 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* Step box */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  opacity: stepOpacity,
                  transform: `scale(${stepScale})`,
                  width: Math.max(160, 1600 / steps.length - 80),
                }}
              >
                {/* Number circle */}
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONT_FAMILY,
                    fontSize: 26,
                    fontWeight: 800,
                    color: COLORS.text,
                    marginBottom: 16,
                    boxShadow: `0 0 20px ${COLORS.primary}40`,
                  }}
                >
                  {i + 1}
                </div>
                {/* Label */}
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: BODY_SIZE,
                    fontWeight: 700,
                    color: COLORS.text,
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  {step.label}
                </div>
                {/* Description */}
                {step.description && (
                  <div
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontSize: 20,
                      color: COLORS.textMuted,
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    {step.description}
                  </div>
                )}
              </div>

              {/* Arrow between steps */}
              {i < steps.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    opacity: arrowProgress,
                    width: 60,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      height: 3,
                      background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`,
                      flex: 1,
                      transform: `scaleX(${arrowProgress})`,
                      transformOrigin: "left",
                      borderRadius: 2,
                    }}
                  />
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: "8px solid transparent",
                      borderBottom: "8px solid transparent",
                      borderLeft: `12px solid ${COLORS.accent}`,
                      opacity: arrowProgress,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
