---
name: create-video
description: 주제나 맥락을 받아 Remotion 영상을 자동 생성하는 스킬. 사용자가 영상을 만들어달라고 하거나, 특정 주제에 대한 영상/비디오를 요청하거나, 파일/맥락을 공유하며 영상 제작을 요청할 때 사용.
metadata:
  tags: video, remotion, tts, create, generate, 영상, 비디오
---

# create-video

주제 또는 맥락을 받아 Remotion 기반 영상을 자동 생성한다.

## 트리거 조건

- "영상 만들어줘", "비디오 생성해줘", "이 주제로 영상"
- 특정 주제/기술에 대한 영상 요청
- 파일이나 정리된 맥락을 공유하며 영상화 요청
- `/create-video [주제]` 직접 호출

## 전체 워크플로우

### Step 1: 주제 분석 + 씬 구성 계획

사용자 입력(주제, 맥락, 파일)을 분석하여 씬 구성을 계획한다.
콘텐츠 가이드 참조: [rules/content-guide.md](rules/content-guide.md)

### Step 2: video-config.json 생성

8개 씬 타입을 조합하여 `src/[CompositionName]/video-config.json`을 생성한다.
씬 타입 레퍼런스: [rules/scene-types.md](rules/scene-types.md)

### Step 3~4: 컴포지션 등록

tsx 컴포넌트, schema.ts 생성 후 Root.tsx에 등록한다.
워크플로우 상세: [rules/workflow.md](rules/workflow.md)

### Step 5: TTS 생성

`tts/generate_audio.py`에 컴포지션 이름을 추가하고 실행한다.

```bash
python tts/generate_audio.py [CompositionName]
```

## 핵심 규칙

1. **hero로 시작**: 모든 영상은 hero 씬으로 시작한다
2. **5~9개 씬**: 너무 짧거나 길지 않은 구성
3. **내용에 맞는 템플릿 선택**: 다양한 템플릿을 골고루 쓰지 말고, 내용에 맞는 것만 사용
4. **한국어 콘텐츠**: 영어 기술 용어는 그대로 사용 (TTS 발음 사전이 처리)
5. **duration은 짧게**: TTS가 자동으로 조정하므로 기본값 사용
6. **CompositionName은 PascalCase**: 디렉토리명, 컴포넌트명, ID 모두 동일

## 참조 파일

- `src/schema.ts` — 씬 타입 스키마 정의
- `src/constants.ts` — 색상/폰트/사이즈
- `src/templates/` — 씬 렌더러 컴포넌트들
- `tts/generate_audio.py` — TTS 스크립트 (COMPOSITIONS, PRONUNCIATION)
- `src/Root.tsx` — 컴포지션 등록
