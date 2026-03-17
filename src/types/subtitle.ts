export interface SubtitleBoundary {
  offset: number;
  duration: number;
  text: string;
}

export interface SubtitleData {
  text: string;
  boundaries: SubtitleBoundary[];
}

export function ticksToFrames(ticks: number, fps: number): number {
  return Math.round((ticks / 10_000_000) * fps);
}
