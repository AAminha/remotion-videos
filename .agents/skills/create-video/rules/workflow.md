# 영상 생성 워크플로우

주제로부터 Remotion 영상을 완성하기까지의 전체 단계.

## 네이밍 규칙

- **CompositionName**: PascalCase (예: `MyTopic`, `KafkaIntro`)
- 디렉토리명, 컴포넌트명, Composition ID 모두 동일한 이름 사용
- 한글 불가. 영어 PascalCase만.

---

## Step 1: 디렉토리 + video-config.json 생성

```
src/[CompositionName]/
└── video-config.json
```

`video-config.json` 구조:

```json
{
  "title": "영상 제목",
  "fps": 30,
  "background": "#0f0f23",
  "scenes": [
    { "type": "hero", "title": "...", "subtitle": "...", "duration": 5 },
    ...
  ]
}
```

씬 타입별 스키마는 [scene-types.md](scene-types.md) 참조.

---

## Step 2: 컴포지션 컴포넌트 생성

파일: `src/[CompositionName]/[CompositionName].tsx`

```tsx
import { AbsoluteFill, Series } from "remotion";
import { COLORS } from "../constants";
import { SceneRenderer } from "../templates/SceneRenderer";
import { SceneWithAudio } from "../templates/SceneWithAudio";
import { [CompositionName]Props } from "./schema";

export const [CompositionName]: React.FC<[CompositionName]Props> = ({
  scenes,
  fps,
  background,
}) => {
  const resolvedFps = fps ?? 30;

  return (
    <AbsoluteFill style={{ backgroundColor: background ?? COLORS.bg }}>
      <Series>
        {scenes.map((scene, i) => (
          <Series.Sequence
            key={i}
            durationInFrames={Math.round(scene.duration * resolvedFps)}
          >
            <SceneWithAudio compositionId="[CompositionName]" sceneIndex={i}>
              <SceneRenderer scene={scene} />
            </SceneWithAudio>
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
```

**주의**: `compositionId`에는 실제 CompositionName 문자열을 넣는다.

---

## Step 3: 스키마 생성

파일: `src/[CompositionName]/schema.ts`

```tsx
import { zColor } from "@remotion/zod-types";
import { CalculateMetadataFunction } from "remotion";
import { z } from "zod";
import { sceneSchema } from "../schema";

export type { Scene } from "../schema";

export const [camelCase]Schema = z.object({
  title: z.string(),
  scenes: z.array(sceneSchema).min(1),
  fps: z.number().default(30),
  background: zColor().optional(),
});

export type [CompositionName]Props = z.infer<typeof [camelCase]Schema>;

export const calculate[CompositionName]Metadata: CalculateMetadataFunction<
  [CompositionName]Props
> = ({ props }) => {
  const fps = props.fps ?? 30;
  const totalSeconds = props.scenes.reduce(
    (sum, scene) => sum + scene.duration,
    0,
  );
  const durationInFrames = Math.max(1, Math.round(totalSeconds * fps));
  return { durationInFrames, fps, width: 1920, height: 1080 };
};
```

**네이밍 예시** (CompositionName = `KafkaIntro`):

- 스키마 변수: `kafkaIntroSchema`
- 타입: `KafkaIntroProps`
- 메타데이터 함수: `calculateKafkaIntroMetadata`

---

## Step 4: Root.tsx에 등록

파일: `src/Root.tsx`

import 추가:

```tsx
import [camelCase]VideoConfig from "./[CompositionName]/video-config.json";
import { [CompositionName] } from "./[CompositionName]/[CompositionName]";
import {
  [camelCase]Schema,
  calculate[CompositionName]Metadata,
} from "./[CompositionName]/schema";
```

`<RemotionRoot>` 안에 `<Composition>` 추가:

```tsx
<Composition
  id="[CompositionName]"
  component={[CompositionName]}
  schema={[camelCase]Schema}
  calculateMetadata={calculate[CompositionName]Metadata}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultProps={[camelCase]VideoConfig as unknown as any}
  durationInFrames={1}
  fps={30}
  width={1920}
  height={1080}
/>
```

---

## Step 5: TTS 생성

### 5-1. COMPOSITIONS 배열 업데이트

`tts/generate_audio.py`의 `COMPOSITIONS` 리스트에 추가:

```python
COMPOSITIONS = ["TypeScript", "BigStream", "BigStreamMigration", "[CompositionName]"]
```

### 5-2. 발음 사전 업데이트

video-config.json에 영어 단어가 있으면 `PRONUNCIATION` 딕셔너리에 추가:

```python
PRONUNCIATION = {
    ...
    "NewTerm": "뉴텀",
}
```

### 5-3. TTS 실행

```bash
python tts/generate_audio.py [CompositionName]
```

이 명령은:

- `src/[CompositionName]/video-config.json`을 읽음
- 씬별 오디오 → `public/generated/[CompositionName]/audio/scene_X.mp3`
- 씬별 자막 → `public/generated/[CompositionName]/subtitles/scene_X.json`
- 오디오가 설정 duration보다 길면 video-config.json 자동 업데이트

---

## Step 6: 검증

```bash
# 타입체크
npx tsc --noEmit

# Remotion Studio에서 미리보기
npm run dev
```

Remotion Studio (http://localhost:3000)에서 새 컴포지션 선택 후:

- 씬 전환 확인
- 오디오 재생 확인
- 자막 타이밍 확인

---

## 체크리스트

- [ ] `src/[Name]/video-config.json` 생성
- [ ] `src/[Name]/[Name].tsx` 생성
- [ ] `src/[Name]/schema.ts` 생성
- [ ] `src/Root.tsx`에 import + Composition 추가
- [ ] `tts/generate_audio.py` COMPOSITIONS에 추가
- [ ] 새 영어 단어 → PRONUNCIATION 사전에 추가
- [ ] `python tts/generate_audio.py [Name]` 실행
- [ ] `npx tsc --noEmit` 통과 확인
