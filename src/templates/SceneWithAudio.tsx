import { useCallback, useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  staticFile,
} from "remotion";
import { SubtitleData } from "../types/subtitle";
import { SubtitleOverlay } from "./SubtitleOverlay";

interface SceneWithAudioProps {
  compositionId: string;
  sceneIndex: number;
  children: React.ReactNode;
}

export const SceneWithAudio: React.FC<SceneWithAudioProps> = ({
  compositionId,
  sceneIndex,
  children,
}) => {
  const [subtitleData, setSubtitleData] = useState<SubtitleData | null>(null);
  const [audioExists, setAudioExists] = useState(false);
  const [handle] = useState(() => delayRender("Loading subtitle data"));

  const audioSrc = staticFile(
    `generated/${compositionId}/audio/scene_${sceneIndex}.mp3`,
  );

  const fetchData = useCallback(async () => {
    try {
      const subtitleUrl = staticFile(
        `generated/${compositionId}/subtitles/scene_${sceneIndex}.json`,
      );
      const res = await fetch(subtitleUrl);
      if (res.ok) {
        const data: SubtitleData = await res.json();
        setSubtitleData(data);
      }
    } catch {
      // No subtitle file — continue without subtitles
    }

    try {
      const audioRes = await fetch(audioSrc, { method: "HEAD" });
      setAudioExists(audioRes.ok);
    } catch {
      // No audio file
    }

    continueRender(handle);
  }, [compositionId, sceneIndex, audioSrc, handle]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AbsoluteFill>
      {audioExists && <Audio src={audioSrc} />}
      {children}
      {subtitleData && <SubtitleOverlay data={subtitleData} />}
    </AbsoluteFill>
  );
};
