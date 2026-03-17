# remotion-videos

[Remotion](https://www.remotion.dev/)으로 만드는 개발 관련 영상 프로젝트입니다.

주제만 던지면 Claude Code 커스텀 스킬이 영상 구성(씬, 자막, 나레이션)을 자동으로 설계하고, Edge TTS로 음성을 생성한 뒤 Remotion으로 렌더링까지 처리합니다. 영상 한 편을 만드는 데 실질적인 코딩이 거의 필요하지 않습니다.

## 기술 스택

- [Remotion](https://www.remotion.dev/) 4.0
- React 19
- TypeScript
- Tailwind CSS v4
- [Edge TTS](https://github.com/rany2/edge-tts) - 나레이션 음성 생성
- [Claude Code](https://claude.ai/code) + 커스텀 스킬 - 영상 자동 생성

## 시작하기

```bash
npm install

# Remotion Studio 실행
npm run dev
```

## 영상 목록

| 영상       | 설명              |
| ---------- | ----------------- |
| TypeScript | TypeScript 소개   |
| KafkaIntro | Apache Kafka 소개 |

## 예시

### KafkaIntro

https://github.com/user-attachments/assets/8cf6ae12-acef-478a-a050-066e2c453e93