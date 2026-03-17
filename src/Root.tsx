import "./index.css";
import { Composition } from "remotion";
import { TypeScript } from "./TypeScript/TypeScript";
import {
  calculateTypeScriptMetadata,
  typeScriptSchema,
} from "./TypeScript/schema";
import typeScriptVideoConfig from "./TypeScript/video-config.json";

// Each <Composition> is an entry in the sidebar!
// 이건 Remotion의 진입점 (entry point)
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TypeScript" // 영상 이름
        component={TypeScript} // 실제 영상 내용을 담은 React 컴포넌트
        schema={typeScriptSchema}
        calculateMetadata={calculateTypeScriptMetadata}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        defaultProps={typeScriptVideoConfig as unknown as any}
        durationInFrames={1} // 영상 길이 (프레임 수)
        fps={30} // 초당 프레임 수
        width={1920} // 해상도 (가로)
        height={1080} // 해상도 (세로)
      />
    </>
  );
};
