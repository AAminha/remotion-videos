import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BODY_SIZE,
  CARD_PADDING,
  COLORS,
  FONT_FAMILY,
  SCENE_PADDING,
  SUBTITLE_SIZE,
} from "../constants";
import { GridScene } from "../schema";
import { BackgroundGlow, TitleAccent, cardStyle } from "./Decorations";

export const Grid: React.FC<GridScene> = ({ title, cards, columns = 3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.surface,
        padding: SCENE_PADDING,
        flexDirection: "column",
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

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 24,
          flex: 1,
        }}
      >
        {cards.map((card, i) => {
          const startFrame = 10 + i * 8;
          const cardScale = spring({
            frame: frame - startFrame,
            fps,
            config: { damping: 80, mass: 0.4 },
          });
          const cardOpacity = interpolate(frame - startFrame, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                ...cardStyle,
                padding: CARD_PADDING,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                opacity: cardOpacity,
                transform: `scale(${cardScale})`,
              }}
            >
              {card.icon && (
                <span style={{ fontSize: 40, lineHeight: 1 }}>{card.icon}</span>
              )}
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 26,
                  fontWeight: 700,
                  color: COLORS.text,
                }}
              >
                {card.title}
              </div>
              {card.description && (
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: BODY_SIZE - 4,
                    color: COLORS.textMuted,
                    lineHeight: 1.4,
                  }}
                >
                  {card.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
