# -*- coding: utf-8 -*-
"""Build 10 iljin intro videos (navy/gold card style) + copy 2 existing name videos."""
from __future__ import annotations

import asyncio
import math
import shutil
import subprocess
import sys
import wave
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import edge_tts
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
DESKTOP = Path(r"C:\Users\a8071\OneDrive\Desktop")
ROOT = Path(r"C:\Users\a8071\Projects\nameanalyz")
OUT_DIR = ROOT / "videos"
WORK = ROOT / "_video_build" / "work"
FONTS = Path(r"C:\Windows\Fonts")

W, H, FPS = 1280, 720, 24
BG = (11, 14, 32)
CARD = (27, 21, 42)
CARD_EDGE = (201, 176, 122)
GOLD = (232, 213, 163)
LINE = (201, 176, 122)
WHITE = (255, 252, 246)
YINYANG = (212, 175, 122)

AUDIO_FILTER = (
    "dynaudnorm=f=100:g=9:p=0.98:m=45,volume=6dB,"
    "alimiter=limit=0.95:attack=5:release=50"
)

VOICES = {
    "한국어": "ko-KR-SunHiNeural",
    "영어": "en-US-JennyNeural",
    "일본어": "ja-JP-NanamiNeural",
    "스페인어": "es-ES-ElviraNeural",
    "힌디어": "hi-IN-SwaraNeural",
}


def font_path(lang: str, bold: bool) -> Path:
    if lang == "힌디어":
        return FONTS / "Nirmala.ttc"
    if lang == "일본어":
        return FONTS / ("YuGothB.ttc" if bold else "YuGothR.ttc")
    if lang == "영어" or lang == "스페인어":
        return FONTS / ("segoeuib.ttf" if bold else "arial.ttf")
    return FONTS / ("malgunbd.ttf" if bold else "malgun.ttf")


def load_font(lang: str, size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = font_path(lang, bold)
    try:
        return ImageFont.truetype(str(path), size, index=0)
    except OSError:
        return ImageFont.truetype(str(FONTS / "malgun.ttf"), size)


def text_size(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=font)
    return box[2] - box[0], box[3] - box[1]


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, max_w: int, lang: str) -> list[str]:
    text = text.strip()
    if text_size(draw, text, font)[0] <= max_w:
        return [text]
    if lang in ("한국어", "일본어"):
        lines, cur = [], ""
        for ch in text:
            trial = cur + ch
            if text_size(draw, trial, font)[0] <= max_w or not cur:
                cur = trial
            else:
                lines.append(cur)
                cur = ch
        if cur:
            lines.append(cur)
        return lines
    words = text.replace("—", " — ").split()
    lines, cur = [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if text_size(draw, trial, font)[0] <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def fit_font(draw: ImageDraw.ImageDraw, text: str, lang: str, bold: bool, start: int, min_size: int, max_w: int) -> ImageFont.FreeTypeFont:
    size = start
    while size > min_size:
        font = load_font(lang, size, bold)
        if text_size(draw, text, font)[0] <= max_w:
            return font
        size -= 2
    return load_font(lang, min_size, bold)


def draw_card(title: str, subtitle: str, lang: str) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    d.line((80, 58, W - 80, 58), fill=LINE, width=2)
    d.line((80, H - 58, W - 80, H - 58), fill=LINE, width=2)

    card_w, card_h = 1080, 340
    x0, y0 = (W - card_w) // 2, (H - card_h) // 2
    d.rounded_rectangle((x0, y0, x0 + card_w, y0 + card_h), radius=8, fill=CARD)

    inner = card_w - 100
    title_font = fit_font(d, title, lang, True, 44 if lang != "힌디어" else 36, 24, inner)
    title_lines = wrap_text(d, title, title_font, inner, lang)
    if len(title_lines) > 4:
        title_font = fit_font(d, title, lang, True, 32, 20, inner)
        title_lines = wrap_text(d, title, title_font, inner, lang)

    sub_lines: list[str] = []
    sub_font = load_font(lang, 28 if lang != "힌디어" else 24, False)
    if subtitle.strip():
        sub_lines = wrap_text(d, subtitle, sub_font, inner, lang)
        while len(sub_lines) > 3 and sub_font.size > 18:
            sub_font = load_font(lang, sub_font.size - 2, False)
            sub_lines = wrap_text(d, subtitle, sub_font, inner, lang)

    gap = 18 if sub_lines else 0
    t_h = sum(text_size(d, ln, title_font)[1] + 8 for ln in title_lines)
    s_h = sum(text_size(d, ln, sub_font)[1] + 6 for ln in sub_lines) if sub_lines else 0
    y = y0 + (card_h - (t_h + gap + s_h)) // 2
    for ln in title_lines:
        d.text((W // 2, y), ln, font=title_font, fill=WHITE, anchor="mt")
        y += text_size(d, ln, title_font)[1] + 8
    if sub_lines:
        y += gap
        for ln in sub_lines:
            d.text((W // 2, y), ln, font=sub_font, fill=GOLD, anchor="mt")
            y += text_size(d, ln, sub_font)[1] + 6

    return img


def cards(lines: list[str]) -> list[tuple[str, str, str]]:
    return [(ln, ln.rstrip("."), "") for ln in lines]


LUCKY_KO = [
    "행운역일진.",
    "일진을 확인하려면 천, 지, 인 버튼 3개를 차례대로 누르면 됩니다.",
    "마지막 버튼을 누르는 그 순간 하늘의 메시지를 포착해서, 주역으로 운세를 보여드리는 것입니다.",
    "그래서 하루에 한 번, 정해진 시간에 하시는 것이 정확한 방법입니다.",
    "나쁘게 나온다고 다시 하시면, 두 번째부터는 하늘이 보내는 신호가 흐려져 버립니다.",
    "프로필 링크에서 지금 확인해보세요.",
]
LUCKY_EN = [
    "Lucky Yeok Iljin.",
    "To check your fortune, press the three buttons — Heaven, Earth, and Humanity — in order.",
    "The instant you press the last button, it captures heaven's message at that instant and reveals your fortune through the I Ching.",
    "That's why doing it once a day, at a fixed time, is the correct way.",
    "If you don't like the result and try again, the signal heaven sends becomes blurred from the second time on.",
    "Check it now through the link in our profile.",
]
LUCKY_JA = [
    "ハンウンヨクイルジン。",
    "運勢を確認するには、天・地・人の三つのボタンを順番に押してください。",
    "最後のボタンを押すその瞬間に、天からのメッセージを取り込んで、周易であなたの運勢をお見せします。",
    "ですから、一日一回、決まった時間に行うのが正しい方法です。",
    "悪い結果が出たからともう一度行うと、二回目からは天が送る信号がぼやけてしまいます。",
    "プロフィールのリンクから今すぐ確認してください。",
]
LUCKY_ES = [
    "Lucky Yeok Iljin.",
    "Para consultar tu fortuna, presiona los tres botones —Cielo, Tierra y Humanidad— en orden.",
    "En el instante en que presionas el último botón, se capta el mensaje del cielo en ese instante y se revela tu fortuna a través del I Ching.",
    "Por eso, hacerlo una vez al día, a una hora fija, es la forma correcta.",
    "Si no te gusta el resultado y lo intentas de nuevo, desde la segunda vez la señal que envía el cielo se vuelve borrosa.",
    "Consúltalo ahora en el enlace de nuestro perfil.",
]
LUCKY_HI = [
    "लकी योक इलजिन।",
    "अपनी किस्मत जानने के लिए, स्वर्ग, पृथ्वी और मनुष्य — इन तीन बटनों को क्रम से दबाएँ।",
    "आखिरी बटन दबाते ही उस पल स्वर्ग के संदेश को पकड़कर, आई चिंग के ज़रिए आपकी किस्मत दिखाई जाती है।",
    "इसलिए दिन में एक बार, एक तय समय पर करना ही सही तरीका है।",
    "अगर परिणाम अच्छा न लगे और आप दोबारा करें, तो दूसरी बार से स्वर्ग का भेजा गया संकेत धुंधला हो जाता है।",
    "अभी प्रोफ़ाइल लिंक से देखें।",
]
JAMI_KO = ["자미역일진."] + LUCKY_KO[1:]
JAMI_EN = ["Jami Yeok Iljin."] + LUCKY_EN[1:]
JAMI_JA = ["ジャミヨクイルジン。"] + LUCKY_JA[1:]
JAMI_ES = ["Jami Yeok Iljin."] + LUCKY_ES[1:]
JAMI_HI = ["जामी योक इलजिन।"] + LUCKY_HI[1:]

CLIPS = [
    {"file": "행운역일진_소개_한국어.mp4", "lang": "한국어", "cards": cards(LUCKY_KO)},
    {"file": "행운역일진_소개_영어.mp4", "lang": "영어", "cards": cards(LUCKY_EN)},
    {"file": "행운역일진_소개_일본어.mp4", "lang": "일본어", "cards": cards(LUCKY_JA)},
    {"file": "행운역일진_소개_스페인어.mp4", "lang": "스페인어", "cards": cards(LUCKY_ES)},
    {"file": "행운역일진_소개_힌디어.mp4", "lang": "힌디어", "cards": cards(LUCKY_HI)},
    {"file": "자미역일진_소개_한국어.mp4", "lang": "한국어", "cards": cards(JAMI_KO)},
    {"file": "자미역일진_소개_영어.mp4", "lang": "영어", "cards": cards(JAMI_EN)},
    {"file": "자미역일진_소개_일본어.mp4", "lang": "일본어", "cards": cards(JAMI_JA)},
    {"file": "자미역일진_소개_스페인어.mp4", "lang": "스페인어", "cards": cards(JAMI_ES)},
    {"file": "자미역일진_소개_힌디어.mp4", "lang": "힌디어", "cards": cards(JAMI_HI)},
]


def run(cmd: list[str], cwd: Path | None = None) -> None:
    r = subprocess.run(cmd, cwd=cwd, capture_output=True)
    if r.returncode != 0:
        err = (r.stderr or b"").decode("utf-8", "replace")[-2000:]
        raise RuntimeError(f"ffmpeg failed ({r.returncode}): {err}")


def wav_duration(path: Path) -> float:
    with wave.open(str(path), "rb") as wf:
        return wf.getnframes() / float(wf.getframerate())


async def tts_to_mp3(text: str, voice: str, dest: Path) -> None:
    last = None
    for attempt in range(4):
        try:
            communicate = edge_tts.Communicate(text, voice, rate="-8%")
            await communicate.save(str(dest))
            if dest.exists() and dest.stat().st_size > 500:
                return
            last = RuntimeError(f"empty tts file {dest}")
        except Exception as e:
            last = e
            await asyncio.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"TTS failed for {voice}: {last}")


def process_audio(src_mp3: Path, dest_wav: Path) -> float:
    run(
        [
            FFMPEG,
            "-y",
            "-i",
            str(src_mp3),
            "-af",
            AUDIO_FILTER + ",apad=pad_dur=0.4",
            "-ar",
            "48000",
            "-ac",
            "1",
            str(dest_wav),
        ]
    )
    return wav_duration(dest_wav)


def make_clip(png: Path, wav: Path, dest: Path, freeze_start: bool, audio_dur: float) -> None:
    total = audio_dur + (2.5 if freeze_start else 0)
    cmd = [
        FFMPEG,
        "-y",
        "-loop",
        "1",
        "-framerate",
        str(FPS),
        "-i",
        str(png),
        "-i",
        str(wav),
    ]
    if freeze_start:
        cmd += [
            "-vf",
            "tpad=start_duration=2.5:start_mode=clone",
            "-af",
            "adelay=2500|2500",
        ]
    cmd += [
        "-c:v",
        "libx264",
        "-tune",
        "stillimage",
        "-pix_fmt",
        "yuv420p",
        "-r",
        str(FPS),
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-t",
        f"{total:.3f}",
        "-movflags",
        "+faststart",
        str(dest),
    ]
    run(cmd)


def concat_clips(clips: list[Path], dest: Path) -> None:
    job = clips[0].parent
    lst = job / "concat.txt"
    lst.write_text("".join(f"file '{p.name}'\n" for p in clips), encoding="utf-8")
    run(
        [
            FFMPEG,
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            "concat.txt",
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-r",
            str(FPS),
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-movflags",
            "+faststart",
            str(dest),
        ],
        cwd=job,
    )


async def build_one(spec: dict) -> Path:
    lang = spec["lang"]
    voice = VOICES[lang]
    stem = Path(spec["file"]).stem
    job = WORK / stem
    job.mkdir(parents=True, exist_ok=True)
    clips = []
    for i, (spoken, title, subtitle) in enumerate(spec["cards"], 1):
        png = job / f"card{i}.png"
        draw_card(title, subtitle, lang).save(png, "PNG")
        mp3 = job / f"tts{i}.mp3"
        wav = job / f"tts{i}.wav"
        await tts_to_mp3(spoken, voice, mp3)
        dur = process_audio(mp3, wav)
        clip = job / f"clip{i}.mp4"
        make_clip(png, wav, clip, freeze_start=(i == 1), audio_dur=dur)
        shown = dur + (2.5 if i == 1 else 0)
        clips.append(clip)
        print(f"  {spec['file']} card {i}: {shown:.2f}s")
    out = OUT_DIR / spec["file"]
    concat_clips(clips, out)
    print(f"WROTE {out} ({out.stat().st_size} bytes)")
    return out


def copy_existing() -> None:
    pairs = [
        ("영어이름풀이_영어단독_21초_볼륨업4.mp4", "영어이름풀이_영어단독_21초_볼륨업4.mp4"),
        ("이름풀이_한국어단독_39초_볼륨업3.mp4", "이름풀이_한국어단독_39초_볼륨업3.mp4"),
    ]
    for src_name, dst_name in pairs:
        src = DESKTOP / src_name
        if not src.exists():
            raise SystemExit(f"missing source video: {src}")
        dst = OUT_DIR / dst_name
        shutil.copy2(src, dst)
        print(f"COPIED {src.name} -> {dst}")


def preview() -> None:
    WORK.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    samples = [
        ("preview_ko.png", "한국어", "천·지·인", "세 개의 버튼으로 열어보는 오늘의 운세"),
        ("preview_en.png", "영어", "Heaven, Earth, and Humanity", "Three buttons to unlock today's fortune"),
        ("preview_hi.png", "힌디어", "स्वर्ग, पृथ्वी और मनुष्य", "तीन बटन जो आज की किस्मत खोलते हैं"),
    ]
    for name, lang, t, s in samples:
        p = WORK / name
        draw_card(t, s, lang).save(p, "PNG")
        print("preview", p)


async def main_async(mode: str) -> None:
    WORK.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    if mode == "preview":
        preview()
        return
    specs = CLIPS
    if mode not in ("all", "preview"):
        specs = [c for c in CLIPS if mode in c["file"]]
        if not specs:
            raise SystemExit(f"no clips match {mode!r}")
    for spec in specs:
        await build_one(spec)
    print("ALL DONE")
    for p in sorted(OUT_DIR.glob("*.mp4")):
        print(p.name, p.stat().st_size)


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"
    asyncio.run(main_async(mode))
