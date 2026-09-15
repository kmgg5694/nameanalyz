# -*- coding: utf-8 -*-
"""Replace Korean intro video voice with the realistic guide script. Loop picture to match TTS."""
from __future__ import annotations

import asyncio
import shutil
import subprocess
import sys
import wave
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import edge_tts
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
ROOT = Path(r"C:\Users\a8071\Projects\nameanalyz")
VIDEO = ROOT / "videos" / "이름풀이_한국어단독.mp4"
WORK = ROOT / "_video_build" / "work" / "ko_intro_voice"
WORK.mkdir(parents=True, exist_ok=True)
BACKUP = WORK / "이름풀이_한국어단독_before_voice.mp4"
MP3 = WORK / "guide.mp3"
WAV = WORK / "guide.wav"
OUT = WORK / "이름풀이_한국어단독_new.mp4"

VOICE = "ko-KR-SunHiNeural"
AUDIO_FILTER = (
    "dynaudnorm=f=100:g=9:p=0.98:m=45,volume=6dB,"
    "alimiter=limit=0.95:attack=5:release=50"
)
LEAD_MS = 1800

SCRIPT = (
    "아래에 이름을 풀어 보면 처음엔 잘 나갔는데 갈수록 기우는게 무슨 이유 인지를 알게 됩니다. "
    "현재 내가 왜 이런 침체기를 맞이 하는가? 반대로 젊어서는 별로 였는데 갈수록 상승하는 모습이 적나라 하게 보입니다. "
    "수리 보다는 주역괘의 기운이 강하고 그가 가지고 있는 기운대로 인생을 살아가게 됩니다. "
    "오행의 조화, 수리, 주역괘로 인해 평생 결혼을 못하는 원인도 알 수가 있고, "
    "암이나 수술, 교통사고, 낙상사고, 시험운, 승진운, 공부운, 결혼운, 유산 상속운, 재물운도 그 속에 전부 담겨 있으니 "
    "꼼꼼히 살펴보고 나의 현실과 비교하시길 바랍니다. "
    "큰 재물운도 그 크기에 따라 대기업 회장, 국가원수 등의 일을 경영 할 수 가 있답니다. "
    "단! 개명 하신 분은 이걸 풀어도 맞지가 않으니 예전 이름으로 풀어보고 지금까지 살아 온 길과 대조 해 보시길 바랍니다. "
    "주역을 모르는 작명가들은 한글이름만 듣고도 가난한지, 부자인지, 성격이 어떤지 전혀 모르시는 분들입니다. "
    "한문이름 두자 지어 놓고 81수리 4개만 붙여서는 절대로 알 수가 없답니다. "
    "왜 그러냐면 수리는 내가 몸으로 때우면 되지만 주역괘는 꼭 생채기를 남기니까 그걸 모르면 인생의 변곡점을 꼭 집어 낼 수가 없답니다. "
    "한글, 한문 이름 두개를 수리와 주역괘를 붙여서 종합적으로 판단하게 됩니다. "
    "더 정확히 알고 싶으면 주역사주를 이름에 대입해서 시기별 변곡점을 꼭 집어내는데 "
    "이건 나중에 상세상담 신청하시면 알려 드릴께요."
)


def run(cmd: list[str]) -> None:
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode != 0:
        err = (r.stderr or b"").decode("utf-8", "replace")[-2500:]
        raise RuntimeError(f"ffmpeg failed ({r.returncode}): {err}")


def wav_duration(path: Path) -> float:
    with wave.open(str(path), "rb") as wf:
        return wf.getnframes() / float(wf.getframerate())


async def tts_to_mp3(text: str, dest: Path) -> None:
    last = None
    for attempt in range(4):
        try:
            communicate = edge_tts.Communicate(text, VOICE, rate="-8%")
            await communicate.save(str(dest))
            if dest.exists() and dest.stat().st_size > 500:
                return
            last = RuntimeError(f"empty tts file {dest}")
        except Exception as e:
            last = e
            await asyncio.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"TTS failed: {last}")


def probe(path: Path) -> None:
    r = subprocess.run(
        [FFMPEG, "-i", str(path)],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    print("PROBE", path.name)
    for ln in r.stderr.splitlines():
        if "Duration" in ln or "Stream" in ln:
            print(" ", ln.strip())


async def main() -> None:
    if not VIDEO.exists():
        raise SystemExit(f"missing {VIDEO}")
    if not BACKUP.exists():
        shutil.copy2(VIDEO, BACKUP)
        print("backup", BACKUP)

    print("tts...")
    await tts_to_mp3(SCRIPT, MP3)
    print("mp3", MP3.stat().st_size)

    run(
        [
            FFMPEG,
            "-y",
            "-i",
            str(MP3),
            "-af",
            f"{AUDIO_FILTER},apad=pad_dur=0.5,adelay={LEAD_MS}|{LEAD_MS}",
            "-ar",
            "48000",
            "-ac",
            "1",
            str(WAV),
        ]
    )
    dur = wav_duration(WAV)
    print(f"wav duration {dur:.2f}s")

    t = f"{dur:.3f}"
    run(
        [
            FFMPEG,
            "-y",
            "-fflags",
            "+genpts",
            "-stream_loop",
            "-1",
            "-i",
            str(BACKUP if BACKUP.exists() else VIDEO),
            "-i",
            str(WAV),
            "-map",
            "0:v:0",
            "-map",
            "1:a:0",
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-preset",
            "medium",
            "-crf",
            "20",
            "-r",
            "24",
            "-c:a",
            "aac",
            "-ar",
            "32000",
            "-ac",
            "1",
            "-b:a",
            "160k",
            "-t",
            t,
            "-movflags",
            "+faststart",
            str(OUT),
        ]
    )
    shutil.copy2(OUT, VIDEO)
    probe(VIDEO)
    print("wrote", VIDEO, VIDEO.stat().st_size)


if __name__ == "__main__":
    asyncio.run(main())
