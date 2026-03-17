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
  TITLE_SIZE,
} from "../constants";
import { HeroScene } from "../schema";
import { BackgroundGlow, TitleAccent } from "./Decorations";

export const Hero: React.FC<HeroScene> = ({
  title,
  subtitle,
  background,
  textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 100, mass: 0.5 },
  });

  const titleOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [20, 40], [20, 0], {
    extrapolateRight: "clamp",
  });

  const words = title.split(" ");
  const bg = background ?? COLORS.surface;
  const color = textColor ?? COLORS.text;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: SCENE_PADDING,
      }}
    >
      <BackgroundGlow />

      {/* Title */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.25em",
          marginBottom: subtitle ? 32 : 0,
        }}
      >
        {words.map((word, i) => {
          const wordProgress = spring({
            frame: frame - i * 4,
            fps,
            config: { damping: 100, mass: 0.5 },
          });
          const wordOpacity = interpolate(frame - i * 4, [0, 10], [0, 1], {
            extrapolateRight: "clamp",
          });
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: TITLE_SIZE,
                fontWeight: 800,
                color,
                opacity: wordOpacity,
                transform: `scale(${wordProgress})`,
                display: "inline-block",
                lineHeight: 1.1,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Title accent bar */}
      <TitleAccent width={64} opacity={titleOpacity} />

      {/* Subtitle */}
      {subtitle && (
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: SUBTITLE_SIZE,
            fontWeight: 400,
            color: COLORS.textMuted,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>
      )}

      {/* Accent line */}
      <div
        style={{
          position: "absolute",
          bottom: SCENE_PADDING,
          left: SCENE_PADDING,
          right: SCENE_PADDING,
          height: 3,
          background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`,
          opacity: titleOpacity,
          borderRadius: 2,
          transform: `scaleX(${titleScale})`,
          transformOrigin: "left",
        }}
      />
    </AbsoluteFill>
  );
};
