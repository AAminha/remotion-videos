import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  COLORS,
  FONT_FAMILY,
  MONO_FONT,
  SCENE_PADDING,
  SUBTITLE_SIZE,
} from "../constants";
import { CodeScene } from "../schema";
import { BackgroundGlow, TitleAccent } from "./Decorations";

// Simple regex-based syntax highlighting (no heavy lib)
const tokenize = (code: string) => {
  const keywords =
    /\b(const|let|var|function|return|import|export|from|type|interface|class|extends|implements|if|else|for|while|async|await|new|typeof|instanceof)\b/g;
  const strings = /(["'`])((?:\\.|[^\\])*?)\1/g;
  const comments = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;
  const numbers = /\b(\d+\.?\d*)\b/g;

  // Tag each token with a color
  const result: { text: string; color: string }[] = [];
  let lastIndex = 0;

  const ranges: { start: number; end: number; color: string }[] = [];

  const collect = (re: RegExp, color: string) => {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(code)) !== null) {
      ranges.push({ start: m.index, end: m.index + m[0].length, color });
    }
  };

  collect(comments, COLORS.textMuted);
  collect(strings, "#a6e3a1");
  collect(keywords, "#cba6f7");
  collect(numbers, "#fab387");

  ranges.sort((a, b) => a.start - b.start);

  for (const r of ranges) {
    if (r.start < lastIndex) continue;
    if (r.start > lastIndex) {
      result.push({
        text: code.slice(lastIndex, r.start),
        color: COLORS.codeText,
      });
    }
    result.push({ text: code.slice(r.start, r.end), color: r.color });
    lastIndex = r.end;
  }
  if (lastIndex < code.length) {
    result.push({ text: code.slice(lastIndex), color: COLORS.codeText });
  }

  return result;
};

export const Code: React.FC<CodeScene> = ({ title, code, language }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Typewriter: reveal characters over 75% of scene duration
  const typewriterEnd = durationInFrames * 0.75;
  const charsToShow = Math.floor(
    interpolate(frame, [5, typewriterEnd], [0, code.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  const visibleCode = code.slice(0, charsToShow);
  const tokens = tokenize(visibleCode);

  // Blinking cursor (every 20 frames)
  const cursorVisible = Math.floor(frame / 20) % 2 === 0;

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

      {/* Code block */}
      <div
        style={{
          backgroundColor: COLORS.codeBg,
          borderRadius: 16,
          border: `1px solid ${COLORS.border}`,
          borderTop: `2px solid ${COLORS.primary}`,
          boxShadow: `0 4px 24px ${COLORS.primary}10, 0 1px 4px rgba(0,0,0,0.3)`,
          padding: 0,
          flex: 1,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Window chrome */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "16px 20px",
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div
              key={c}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: c,
              }}
            />
          ))}
          {/* Language badge */}
          <div
            style={{
              marginLeft: "auto",
              fontFamily: FONT_FAMILY,
              fontSize: 14,
              color: COLORS.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {language}
          </div>
        </div>

        {/* Code with line numbers */}
        <div style={{ display: "flex", flex: 1, padding: "24px 0" }}>
          {/* Line numbers */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "0 20px",
              borderRight: `1px solid ${COLORS.border}`,
              fontFamily: MONO_FONT,
              fontSize: 24,
              lineHeight: 1.7,
              color: `${COLORS.textMuted}60`,
              userSelect: "none",
              textAlign: "right",
              minWidth: 60,
            }}
          >
            {visibleCode.split("\n").map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>

          <pre
            style={{
              margin: 0,
              padding: "0 24px",
              fontFamily: MONO_FONT,
              fontSize: 24,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              flex: 1,
            }}
          >
            {tokens.map((token, i) => (
              <span key={i} style={{ color: token.color }}>
                {token.text}
              </span>
            ))}
            {/* Blinking cursor */}
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 26,
                backgroundColor: COLORS.accent,
                opacity: cursorVisible ? 1 : 0,
                verticalAlign: "middle",
                marginLeft: 2,
                borderRadius: 2,
              }}
            />
          </pre>
        </div>
      </div>
    </AbsoluteFill>
  );
};
