# 씬 타입 레퍼런스

8개 씬 타입의 스키마, 용도, JSON 예시. 정의 원천: `src/schema.ts`

---

## hero

**용도**: 영상 제목/인트로. 모든 영상의 첫 씬으로 사용.

| 필드       | 타입     | 필수 | 설명                     |
| ---------- | -------- | ---- | ------------------------ |
| type       | `"hero"` | O    |                          |
| title      | string   | O    | 메인 제목                |
| subtitle   | string   |      | 부제목                   |
| background | color    |      | 배경색 (기본: `#1a1a2e`) |
| textColor  | color    |      | 텍스트 색상              |
| duration   | number   |      | 1~60초, 기본 5초         |

**TTS**: title + subtitle 전체 읽기

```json
{
  "type": "hero",
  "title": "BytePlus VOD 리전 마이그레이션",
  "subtitle": "2026.03.17 새벽 3:00 (KST) — Singapore → Johor",
  "background": "#1a1a2e",
  "textColor": "#ffffff",
  "duration": 5
}
```

---

## list

**용도**: 항목 나열. 장점, 배경 설명, 체크리스트, 모니터링 항목 등.

| 필드     | 타입     | 필수 | 설명       |
| -------- | -------- | ---- | ---------- |
| type     | `"list"` | O    |            |
| title    | string   | O    | 섹션 제목  |
| items    | string[] | O    | 1~8개 항목 |
| duration | number   |      | 기본 6초   |

**TTS**: title + 모든 항목 읽기 (항목 사이 자연스러운 쉼)

```json
{
  "type": "list",
  "title": "핵심 장점",
  "items": [
    "컴파일 타임에 버그를 잡아준다",
    "IDE 자동완성이 강력해진다",
    "코드가 자기 자신을 문서화한다"
  ],
  "duration": 6
}
```

---

## grid

**용도**: 카드형 정보 나열. 생태계, 기능 목록, 비교 등.

| 필드                | 타입     | 필수 | 설명          |
| ------------------- | -------- | ---- | ------------- |
| type                | `"grid"` | O    |               |
| title               | string   | O    |               |
| cards               | object[] | O    | 1~9개 카드    |
| cards[].title       | string   | O    | 카드 제목     |
| cards[].description | string   |      | 카드 설명     |
| cards[].icon        | string   |      | 이모지/아이콘 |
| columns             | number   |      | 2~3, 기본 3   |
| duration            | number   |      | 기본 6초      |

**TTS**: title만 읽기 (카드 내용은 시각적으로만 표시)

```json
{
  "type": "grid",
  "title": "생태계",
  "columns": 3,
  "cards": [
    { "title": "React", "icon": "⚛️", "description": "완전한 TS 지원" },
    { "title": "Next.js", "icon": "▲", "description": "TS로 구축됨" }
  ],
  "duration": 6
}
```

---

## code

**용도**: 코드 블록 표시. 타이핑 애니메이션 효과.

| 필드     | 타입     | 필수 | 설명                        |
| -------- | -------- | ---- | --------------------------- |
| type     | `"code"` | O    |                             |
| title    | string   | O    |                             |
| code     | string   | O    | 코드 내용 (`\n`으로 줄바꿈) |
| language | string   |      | 기본 `"typescript"`         |
| duration | number   |      | 기본 7초                    |

**TTS**: title만 읽기 (코드 내용은 읽지 않음)

```json
{
  "type": "code",
  "title": "타입 추론 예시",
  "code": "const user = { name: \"Alice\", age: 30 };\n\nuser.age.toUpperCase();",
  "language": "typescript",
  "duration": 7
}
```

---

## flow

**용도**: 순차 프로세스. 워크플로우, 타임라인, 절차 설명.

| 필드                | 타입     | 필수 | 설명       |
| ------------------- | -------- | ---- | ---------- |
| type                | `"flow"` | O    |            |
| title               | string   | O    |            |
| steps               | object[] | O    | 2~7개 단계 |
| steps[].label       | string   | O    | 단계 이름  |
| steps[].description | string   |      | 단계 설명  |
| duration            | number   |      | 기본 6초   |

**TTS**: title + 모든 step의 label, description 읽기 (단계 사이 쉼)

```json
{
  "type": "flow",
  "title": "작업 타임라인",
  "steps": [
    { "label": "02:50", "description": "담당자 대기 시작" },
    { "label": "03:00", "description": "마이그레이션 개시" },
    { "label": "03:10", "description": "완료 예정" }
  ],
  "duration": 6
}
```

---

## chat

**용도**: 대화 표현. 팀 토론, Q&A, 인터뷰 형식.

| 필드              | 타입     | 필수 | 설명                           |
| ----------------- | -------- | ---- | ------------------------------ |
| type              | `"chat"` | O    |                                |
| title             | string   |      |                                |
| messages          | object[] | O    | 1~10개 메시지                  |
| messages[].sender | string   | O    | 발신자 이름                    |
| messages[].text   | string   | O    | 메시지 내용                    |
| messages[].isUser | boolean  |      | 기본 false. true면 오른쪽 정렬 |
| duration          | number   |      | 기본 6초                       |

**TTS**: 화자별 다른 음성으로 합성 (isUser=true → 여성, false → 남성)

```json
{
  "type": "chat",
  "title": "팀 도입 대화",
  "messages": [
    { "sender": "개발자", "text": "TypeScript 도입할까요?", "isUser": true },
    { "sender": "리드", "text": "타입 안전성만으로도 충분한 이유가 돼요." }
  ],
  "duration": 6
}
```

---

## stat

**용도**: 숫자/통계 강조. 성과, 현황, KPI 등.

| 필드           | 타입     | 필수 | 설명                |
| -------------- | -------- | ---- | ------------------- |
| type           | `"stat"` | O    |                     |
| title          | string   | O    |                     |
| stats          | object[] | O    | 1~6개 항목          |
| stats[].label  | string   | O    | 지표명              |
| stats[].value  | number   | O    | 숫자 값             |
| stats[].suffix | string   |      | 접미사 (%, K, M 등) |
| stats[].prefix | string   |      | 접두사 ($, ₩ 등)    |
| duration       | number   |      | 기본 5초            |

**TTS**: title만 읽기 (숫자는 카운트업 애니메이션으로 표시)

```json
{
  "type": "stat",
  "title": "TypeScript 현황",
  "stats": [
    { "label": "GitHub Stars", "value": 98, "suffix": "K" },
    { "label": "개발자 만족도", "value": 93, "suffix": "%" }
  ],
  "duration": 5
}
```

---

## sequence

**용도**: 시퀀스 다이어그램. API 호출 흐름, 시스템 간 통신 설명.

| 필드                   | 타입         | 필수 | 설명             |
| ---------------------- | ------------ | ---- | ---------------- |
| type                   | `"sequence"` | O    |                  |
| title                  | string       | O    |                  |
| actors                 | string[]     | O    | 2~5개 액터 이름  |
| messages               | object[]     | O    | 1~12개 메시지    |
| messages[].from        | number       | O    | 발신 액터 인덱스 |
| messages[].to          | number       | O    | 수신 액터 인덱스 |
| messages[].label       | string       | O    | 메시지 라벨      |
| messages[].description | string       |      | 추가 설명        |
| duration               | number       |      | 기본 8초         |

**TTS**: title + 모든 message의 label 읽기 (메시지 사이 쉼)

```json
{
  "type": "sequence",
  "title": "Upload URL 발급",
  "actors": ["Client", "BigStream", "BytePlus"],
  "messages": [
    { "from": 0, "to": 1, "label": "createStream() 호출" },
    { "from": 1, "to": 2, "label": "ApplyUploadInfo API" },
    { "from": 2, "to": 1, "label": "uploadURL + sessionKey 반환" }
  ],
  "duration": 8
}
```
