import argparse
import asyncio
import json
from pathlib import Path

import edge_tts

# ── 음성 설정 ─────────────────────────────────────────────────────
VOICE_FEMALE = "ko-KR-SunHiNeural"
VOICE_MALE = "ko-KR-InJoonNeural"

COMPOSITIONS = ["TypeScript", "BigStream", "BigStreamMigration", "KafkaIntro", "BytePlusMigration"]
PADDING_SECONDS = 1.0

# ── 영어 → 한국어 발음 사전 ───────────────────────────────────────
# 한국어 TTS가 영어를 어색하게 읽는 문제를 해결하기 위한 발음 치환
PRONUNCIATION = {
    # 기술/프레임워크
    "TypeScript": "타입스크립트",
    "JavaScript": "자바스크립트",
    "Next.js": "넥스트 제이에스",
    "React": "리액트",
    "Vite": "비트",
    "Zod": "조드",
    "Prisma": "프리즈마",
    "tRPC": "티알피씨",
    "ORM": "오알엠",
    "IDE": "아이디이",
    "API": "에이피아이",
    "URL": "유알엘",
    "HLS": "에이치엘에스",
    "DASH": "대시",
    "STS": "에스티에스",
    "VOD": "브이오디",
    "POST": "포스트",
    "PUT": "풋",
    "MP4": "엠피포",
    "H.264": "에이치이육사",
    # 서비스/제품
    "BigStream": "빅스트림",
    "BytePlus": "바이트플러스",
    "GitHub": "깃허브",
    "Kafka": "카프카",
    "Konsole": "콘솔",
    "Kontrol": "컨트롤",
    "Webhook": "웹훅",
    "Pipeline": "파이프라인",
    "Playback": "플레이백",
    # 코드/식별자
    "createStream": "크리에이트스트림",
    "ApplyUploadInfo": "어플라이 업로드 인포",
    "uploadURL": "업로드 유알엘",
    "sessionKey": "세션키",
    "FileUploadComplete": "파일 업로드 컴플리트",
    "VideoUploadedEvent": "비디오 업로디드 이벤트",
    "VideoEncodedEvent": "비디오 인코디드 이벤트",
    "GetAllPlayInfo": "겟 올 플레이 인포",
    "WorkflowComplete": "워크플로우 컴플리트",
    "AssumeRole": "어슘롤",
    "playURL": "플레이 유알엘",
    "hlsURL": "에이치엘에스 유알엘",
    "dashURL": "대시 유알엘",
    "posterURL": "포스터 유알엘",
    # 상태값
    "PENDING": "펜딩",
    "UPLOADED": "업로디드",
    "ENCODED": "인코디드",
    "CRASH": "크래시",
    "Retryable": "리트라이어블",
    "Error": "에러",
    # 지역
    "Singapore": "싱가포르",
    "Johor": "조호르",
    # Kafka 관련
    "Kafka": "카프카",
    "Apache Kafka": "아파치 카프카",
    "Kafka Connect": "카프카 커넥트",
    "Kafka Streams": "카프카 스트림즈",
    "Schema Registry": "스키마 레지스트리",
    "KSQL": "케이에스큐엘",
    "MirrorMaker": "미러메이커",
    "Confluent": "컨플루언트",
    "Confluent Cloud": "컨플루언트 클라우드",
    "Producer": "프로듀서",
    "Consumer": "컨슈머",
    "Consumer Group": "컨슈머 그룹",
    "Broker": "브로커",
    "Topic": "토픽",
    "Partition": "파티션",
    "Replica": "레플리카",
    "CDC": "씨디씨",
    "LinkedIn": "링크드인",
    "Fortune": "포춘",
    # 일반
    "Client": "클라이언트",
    "Phase": "페이즈",
    "Upload": "업로드",
    "Video": "비디오",
    "tsc": "티에스씨",
    "TS": "티에스",
    "JS": "제이에스",
}


def apply_pronunciation(text):
    """영어 단어를 한국어 발음으로 치환한다. 긴 단어부터 먼저 치환."""
    for eng, kor in sorted(PRONUNCIATION.items(), key=lambda x: -len(x[0])):
        text = text.replace(eng, kor)
    return text


# ── 나레이션 빌드 ─────────────────────────────────────────────────

def build_narration(scene):
    """단일 음성 씬의 나레이션을 생성한다. 항목 사이에 구두점으로 자연스러운 쉼을 넣는다."""
    t = scene["type"]

    if t == "hero":
        return f"{scene['title']}. {scene.get('subtitle', '')}"

    if t == "list":
        # 항목별로 끊어 읽기: ". " → TTS가 자연스럽게 쉼
        items = ". ".join(scene["items"])
        return f"{scene['title']}... {items}."

    if t == "flow":
        steps = ". ".join(
            f"{s['label']}, {s.get('description', '')}" for s in scene["steps"]
        )
        return f"{scene['title']}... {steps}."

    if t == "sequence":
        msgs = ". ".join(m["label"] for m in scene["messages"])
        return f"{scene['title']}... {msgs}."

    return scene.get("title", "")


# ── 유틸 ──────────────────────────────────────────────────────────

def audio_duration_seconds(boundaries):
    """boundaries에서 실제 오디오 길이(초)를 계산한다."""
    if not boundaries:
        return 0
    last = max(boundaries, key=lambda b: (b["offset"] or 0) + (b["duration"] or 0))
    ticks = (last["offset"] or 0) + (last["duration"] or 0)
    return ticks / 10_000_000  # 100ns ticks → seconds


async def synthesize_voice(text, voice):
    """하나의 텍스트를 지정된 음성으로 합성하여 (audio_bytes, boundaries)를 반환한다."""
    text = apply_pronunciation(text)
    communicate = edge_tts.Communicate(text, voice)

    audio_chunks = bytearray()
    boundaries = []

    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_chunks.extend(chunk["data"])
        elif chunk["type"] in ("SentenceBoundary", "WordBoundary"):
            boundaries.append(
                {
                    "offset": chunk.get("offset"),
                    "duration": chunk.get("duration"),
                    "text": chunk.get("text"),
                }
            )

    return bytes(audio_chunks), boundaries


# ── 단일 음성 합성 ───────────────────────────────────────────────

async def synthesize_single(text, voice, audio_path, subtitle_path):
    audio_bytes, boundaries = await synthesize_voice(text, voice)

    with open(audio_path, "wb") as f:
        f.write(audio_bytes)

    with open(subtitle_path, "w", encoding="utf-8") as f:
        json.dump(
            {"text": text, "boundaries": boundaries},
            f,
            ensure_ascii=False,
            indent=2,
        )

    print(f"  Generated: {audio_path}")
    return audio_duration_seconds(boundaries) + PADDING_SECONDS


# ── 채팅 다중 음성 합성 ──────────────────────────────────────────

async def synthesize_chat(scene, audio_path, subtitle_path):
    """chat 씬: 화자별로 다른 음성을 사용, MP3를 이어붙인다."""
    messages = scene.get("messages", [])
    title = scene.get("title")

    # (text, voice) 세그먼트 리스트 구성
    segments = []
    if title:
        segments.append((title, VOICE_FEMALE))
    for msg in messages:
        voice = VOICE_FEMALE if msg.get("isUser", False) else VOICE_MALE
        segments.append((msg["text"], voice))

    all_audio = bytearray()
    all_boundaries = []
    offset_ticks = 0

    for text, voice in segments:
        seg_audio, seg_boundaries = await synthesize_voice(text, voice)

        # boundary offset을 누적 오프셋만큼 밀어준다
        for b in seg_boundaries:
            all_boundaries.append(
                {
                    "offset": (b["offset"] or 0) + offset_ticks,
                    "duration": b["duration"],
                    "text": b["text"],
                }
            )

        all_audio.extend(seg_audio)

        # 이 세그먼트의 끝 시점 + 400ms 쉼을 다음 세그먼트 시작점으로
        if seg_boundaries:
            seg_end = max(
                (b["offset"] or 0) + (b["duration"] or 0) for b in seg_boundaries
            )
            offset_ticks += seg_end + 4_000_000  # +400ms 쉼

    # 저장
    with open(audio_path, "wb") as f:
        f.write(all_audio)

    full_text = " ".join(text for text, _ in segments)
    with open(subtitle_path, "w", encoding="utf-8") as f:
        json.dump(
            {"text": full_text, "boundaries": all_boundaries},
            f,
            ensure_ascii=False,
            indent=2,
        )

    print(f"  Generated: {audio_path} (multi-voice, {len(segments)} segments)")
    return audio_duration_seconds(all_boundaries) + PADDING_SECONDS


# ── 씬 디스패치 ──────────────────────────────────────────────────

async def synthesize(scene, index, audio_dir, sub_dir):
    audio_path = audio_dir / f"scene_{index}.mp3"
    subtitle_path = sub_dir / f"scene_{index}.json"

    if scene["type"] == "chat":
        return await synthesize_chat(scene, audio_path, subtitle_path)

    text = build_narration(scene)
    return await synthesize_single(text, VOICE_FEMALE, audio_path, subtitle_path)


# ── 컴포지션 생성 ────────────────────────────────────────────────

async def generate_composition(composition):
    config_path = Path(f"src/{composition}/video-config.json")
    audio_dir = Path(f"public/generated/{composition}/audio")
    sub_dir = Path(f"public/generated/{composition}/subtitles")

    if not config_path.exists():
        print(f"Config not found: {config_path}")
        return

    audio_dir.mkdir(parents=True, exist_ok=True)
    sub_dir.mkdir(parents=True, exist_ok=True)

    with open(config_path, encoding="utf-8") as f:
        config = json.load(f)

    scenes = config["scenes"]
    updated = False

    print(f"\n[{composition}]")
    for i, scene in enumerate(scenes):
        actual_duration = await synthesize(scene, i, audio_dir, sub_dir)

        old_duration = scene.get("duration", 5)
        if actual_duration > old_duration:
            new_duration = round(actual_duration, 1)
            scene["duration"] = new_duration
            updated = True
            print(
                f"    duration: {old_duration}s → {new_duration}s "
                f"(audio: {actual_duration - PADDING_SECONDS:.1f}s)"
            )

    if updated:
        with open(config_path, "w", encoding="utf-8") as f:
            json.dump(config, f, ensure_ascii=False, indent=2)
        print(f"  Updated: {config_path}")

    print(f"  Done: {len(scenes)} scenes\n")


# ── CLI ───────────────────────────────────────────────────────────

async def main():
    parser = argparse.ArgumentParser(description="Generate TTS audio and subtitles")
    parser.add_argument(
        "composition",
        nargs="?",
        help=f"Composition name: {', '.join(COMPOSITIONS)}",
    )
    parser.add_argument(
        "--all", action="store_true", help="Generate for all compositions"
    )
    args = parser.parse_args()

    if args.all:
        for comp in COMPOSITIONS:
            await generate_composition(comp)
    elif args.composition:
        if args.composition not in COMPOSITIONS:
            print(f"Unknown composition: {args.composition}")
            print(f"Available: {', '.join(COMPOSITIONS)}")
            return
        await generate_composition(args.composition)
    else:
        parser.print_help()


if __name__ == "__main__":
    asyncio.run(main())
