# -*- coding: utf-8 -*-
import subprocess
import wave
import struct
from pathlib import Path
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
DESKTOP = Path(r"C:\Users\a8071\OneDrive\Desktop")
VIDEOS = Path(r"C:\Users\a8071\Projects\nameanalyz\videos")
WORK = Path(r"C:\Users\a8071\Projects\nameanalyz\_video_build\work\en_compare")
WORK.mkdir(parents=True, exist_ok=True)

ref = next(DESKTOP.glob("*영어단독_최종 (1).mp4"))
cur = next(VIDEOS.glob("*영어단독_21초*.mp4"))
print("REF", ref.name, ref.stat().st_size)
print("CUR", cur.name, cur.stat().st_size)

def probe(path):
    r = subprocess.run([FFMPEG, "-i", str(path)], capture_output=True, text=True, encoding="utf-8", errors="replace")
    out = []
    for ln in r.stderr.splitlines():
        if "Duration" in ln or "Stream" in ln or "Audio" in ln or "Video" in ln:
            out.append(ln.strip())
    return "\n".join(out)

print("\n=== REF probe ===")
print(probe(ref))
print("\n=== CUR probe ===")
print(probe(cur))

def to_wav(src, dest):
    subprocess.run([
        FFMPEG, "-y", "-i", str(src),
        "-ac", "1", "-ar", "16000", "-vn", str(dest)
    ], capture_output=True, check=True)

def rms_windows(wav_path, win_ms=20):
    with wave.open(str(wav_path), "rb") as w:
        n, sw, rate, nframes = w.getnchannels(), w.getsampwidth(), w.getframerate(), w.getnframes()
        raw = w.readframes(nframes)
    assert sw == 2 and n == 1
    samples = struct.unpack("<" + "h" * (len(raw) // 2), raw)
    win = max(1, int(rate * win_ms / 1000))
    out = []
    for i in range(0, len(samples) - win, win):
        chunk = samples[i:i + win]
        ms = sum(x * x for x in chunk) / len(chunk)
        rms = ms ** 0.5
        t = i / rate
        out.append((t, rms))
    return rate, len(samples) / rate, out

def speech_start(windows, thresh_ratio=0.12, persist=3):
    peak = max(r for _, r in windows) or 1
    thresh = peak * thresh_ratio
    run = 0
    for t, r in windows:
        if r >= thresh:
            run += 1
            if run >= persist:
                # back up to first of the run
                idx = int(round(t / 0.02)) - persist + 1
                return windows[max(0, idx)][0], peak, thresh
        else:
            run = 0
    return None, peak, thresh

def silence_detect(path):
    r = subprocess.run([
        FFMPEG, "-i", str(path),
        "-af", "silencedetect=noise=-32dB:d=0.15",
        "-f", "null", "-"
    ], capture_output=True, text=True, encoding="utf-8", errors="replace")
    lines = [ln for ln in r.stderr.splitlines() if "silence" in ln.lower()]
    return lines

for label, src in (("ref", ref), ("cur", cur)):
    wav = WORK / f"{label}.wav"
    to_wav(src, wav)
    rate, dur, wins = rms_windows(wav)
    start, peak, thresh = speech_start(wins)
    print(f"\n=== {label} audio ===")
    print("dur", round(dur, 3), "peak_rms", round(peak, 1), "thresh", round(thresh, 1), "speech_start", start)
    print("silencedetect:")
    print("\n".join(silence_detect(src)[:20]))
    # first 3 seconds rms every 100ms
    print("rms 0-3s /100ms:")
    for t, r in wins:
        if t > 3.0:
            break
        if abs((t * 10) % 1) < 0.05 or int(round(t * 50)) % 5 == 0:
            bar = "#" * int(min(40, r / (peak or 1) * 40))
            print(f"  {t:5.2f} {r:7.1f} {bar}")
