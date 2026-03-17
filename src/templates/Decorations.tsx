import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../constants";

/**
 * Shared background glow — two soft radial blurs positioned off-center.
 * Every template uses this so the "feel" stays consistent.
 */
export const BackgroundGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "20%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.primary}20 0%, transparent 70%)`,
          opacity,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accent}18 0%, transparent 70%)`,
          opacity,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
    </>
  );
};

/**
 * Small gradient bar rendered next to (or under) section titles.
 * Gives every template the same "branded title" look.
 */
export const TitleAccent: React.FC<{
  width?: number;
  opacity?: number;
}> = ({ width = 48, opacity = 1 }) => (
  <div
    style={{
      width,
      height: 4,
      borderRadius: 2,
      background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`,
      marginBottom: 20,
      opacity,
    }}
  />
);

/** Consistent card wrapper style used by Grid, Code, Stat, etc. */
export const cardStyle: React.CSSProperties = {
  backgroundColor: COLORS.bg,
  borderRadius: 16,
  border: `1px solid ${COLORS.border}`,
  borderTop: `2px solid ${COLORS.primary}`,
  boxShadow: `0 4px 24px ${COLORS.primary}10, 0 1px 4px rgba(0,0,0,0.3)`,
};
