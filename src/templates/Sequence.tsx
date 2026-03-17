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
import { SequenceScene } from "../schema";

export const Sequence: React.FC<SequenceScene> = ({
  title,
  actors,
  messages,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  const HEADER_HEIGHT = 100;
  const TOP_OFFSET = 120;
  const CONTENT_WIDTH = 1920 - SCENE_PADDING * 2;
  const actorSpacing = CONTENT_WIDTH / actors.length;

  // Messages appear sequentially
  const msgDelay = Math.max(
    10,
    Math.floor((durationInFrames * 0.75) / messages.length),
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.surface,
        padding: SCENE_PADDING,
        flexDirection: "column",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: SUBTITLE_SIZE,
          fontWeight: 700,
          color: COLORS.accent,
          marginBottom: 24,
          opacity: titleOpacity,
        }}
      >
        {title}
      </div>

      {/* Diagram area */}
      <div style={{ position: "relative", flex: 1 }}>
        {/* Actor headers */}
        {actors.map((actor, i) => {
          const actorScale = spring({
            frame,
            fps,
            config: { damping: 100, mass: 0.5 },
          });
          const x = i * actorSpacing + actorSpacing / 2;

          return (
            <div
              key={`actor-${i}`}
              style={{
                position: "absolute",
                left: x - 90,
                top: 0,
                width: 180,
                textAlign: "center",
                transform: `scale(${actorScale})`,
              }}
            >
              {/* Actor box */}
              <div
                style={{
                  backgroundColor: COLORS.bg,
                  border: `2px solid ${COLORS.primary}`,
                  borderRadius: 12,
                  padding: "14px 16px",
                  fontFamily: FONT_FAMILY,
                  fontSize: 22,
                  fontWeight: 700,
                  color: COLORS.text,
                  whiteSpace: "nowrap",
                }}
              >
                {actor}
              </div>
            </div>
          );
        })}

        {/* Lifelines */}
        {actors.map((_, i) => {
          const x = i * actorSpacing + actorSpacing / 2;
          const lineOpacity = interpolate(frame, [5, 15], [0, 0.3], {
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={`line-${i}`}
              style={{
                position: "absolute",
                left: x - 1,
                top: HEADER_HEIGHT - 10,
                width: 2,
                bottom: 0,
                background: `linear-gradient(180deg, ${COLORS.primary}80, ${COLORS.primary}10)`,
                opacity: lineOpacity,
              }}
            />
          );
        })}

        {/* Messages (arrows) */}
        {messages.map((msg, i) => {
          const startFrame = 15 + i * msgDelay;
          const msgProgress = spring({
            frame: frame - startFrame,
            fps,
            config: { damping: 80, mass: 0.4 },
          });
          const msgOpacity = interpolate(frame - startFrame, [0, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const fromX = msg.from * actorSpacing + actorSpacing / 2;
          const toX = msg.to * actorSpacing + actorSpacing / 2;
          const isLeftToRight = toX > fromX;

          const y = TOP_OFFSET + i * 65;
          const arrowLeft = Math.min(fromX, toX);
          const arrowWidth = Math.abs(toX - fromX);

          // Label position: centered above arrow
          const labelX = (fromX + toX) / 2;

          return (
            <div key={`msg-${i}`} style={{ opacity: msgOpacity }}>
              {/* Label */}
              <div
                style={{
                  position: "absolute",
                  left: labelX - 200,
                  top: y - 28,
                  width: 400,
                  textAlign: "center",
                  fontFamily: FONT_FAMILY,
                  fontSize: 18,
                  fontWeight: 600,
                  color: COLORS.text,
                  whiteSpace: "nowrap",
                }}
              >
                {msg.label}
              </div>

              {/* Description (if exists) */}
              {msg.description && (
                <div
                  style={{
                    position: "absolute",
                    left: labelX - 200,
                    top: y - 8,
                    width: 400,
                    textAlign: "center",
                    fontFamily: FONT_FAMILY,
                    fontSize: 14,
                    color: COLORS.textMuted,
                    whiteSpace: "nowrap",
                  }}
                >
                  {msg.description}
                </div>
              )}

              {/* Arrow line */}
              <div
                style={{
                  position: "absolute",
                  left: arrowLeft,
                  top: y + 12,
                  width: arrowWidth,
                  height: 2,
                  backgroundColor: COLORS.accent,
                  transform: `scaleX(${msgProgress})`,
                  transformOrigin: isLeftToRight ? "left" : "right",
                }}
              />

              {/* Arrow head */}
              <div
                style={{
                  position: "absolute",
                  left: isLeftToRight ? toX - 10 : toX - 2,
                  top: y + 12 - 6,
                  width: 0,
                  height: 0,
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                  ...(isLeftToRight
                    ? { borderLeft: `10px solid ${COLORS.accent}` }
                    : { borderRight: `10px solid ${COLORS.accent}` }),
                  opacity: msgProgress,
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
