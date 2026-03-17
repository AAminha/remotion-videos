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
import { ChatScene } from "../schema";
import { BackgroundGlow, TitleAccent } from "./Decorations";

export const Chat: React.FC<ChatScene> = ({ title, messages }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Space messages evenly across the scene duration
  const msgDelay = Math.max(
    12,
    Math.floor((durationInFrames * 0.8) / messages.length),
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.surfaceAlt,
        padding: SCENE_PADDING,
        flexDirection: "column",
      }}
    >
      <BackgroundGlow />

      {/* Optional title */}
      {title && (
        <>
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
        </>
      )}

      {/* Messages */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          flex: 1,
          justifyContent: "center",
        }}
      >
        {messages.map((msg, i) => {
          const startFrame = i * msgDelay;
          const msgOpacity = interpolate(frame - startFrame, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const msgY = spring({
            frame: frame - startFrame,
            fps,
            config: { damping: 100, mass: 0.4 },
          });
          const translateY = interpolate(msgY, [0, 1], [20, 0]);

          const isUser = msg.isUser;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isUser ? "flex-end" : "flex-start",
                opacity: msgOpacity,
                transform: `translateY(${translateY}px)`,
              }}
            >
              {/* Sender name */}
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 18,
                  color: COLORS.textMuted,
                  marginBottom: 6,
                  paddingLeft: isUser ? 0 : 4,
                  paddingRight: isUser ? 4 : 0,
                }}
              >
                {msg.sender}
              </div>
              {/* Bubble */}
              <div
                style={{
                  backgroundColor: isUser
                    ? COLORS.userBubble
                    : COLORS.otherBubble,
                  borderRadius: isUser
                    ? "20px 20px 4px 20px"
                    : "20px 20px 20px 4px",
                  padding: "16px 24px",
                  maxWidth: "65%",
                  boxShadow: isUser
                    ? `0 2px 12px ${COLORS.userBubble}40`
                    : `0 2px 8px rgba(0,0,0,0.2)`,
                  fontFamily: FONT_FAMILY,
                  fontSize: BODY_SIZE,
                  color: COLORS.text,
                  lineHeight: 1.5,
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
