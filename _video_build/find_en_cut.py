# -*- coding: utf-8 -*-
import subprocess
from pathlib import Path
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
videos = Path(r"C:\Users\a8071\Projects\nameanalyz\videos")
src = next(videos.glob("*한국어단독*.mp4"))
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_video_build\work\ko_frames")
out.mkdir(parents=True, exist_ok=True)

# finer frames around transition
for t in [31.0, 31.5, 32.0, 32.2, 32.4, 32.6, 32.8, 33.0, 33.2]:
    dest = out / f"f{t:.1f}.png".replace(".", "_")
    subprocess.run([
        FFMPEG, "-y", "-ss", f"{t:.1f}", "-i", str(src),
        "-frames:v", "1", str(dest),
    ], capture_output=True)

# silencedetect + volume around 28-39
r = subprocess.run([
    FFMPEG, "-i", str(src),
    "-af", "silencedetect=noise=-30dB:d=0.25,astats=metadata=1:reset=1",
    "-f", "null", "-",
], capture_output=True, text=True, encoding="utf-8", errors="replace")
lines = [ln for ln in r.stderr.splitlines() if "silence" in ln.lower() or "Duration" in ln]
print("\n".join(lines[-40:]))
print("---")
# also volumedetect windows via showinfo on audio? extract wav rms via python
wav = out / "ko.wav"
subprocess.run([
    FFMPEG, "-y", "-i", str(src), "-ac", "1", "-ar", "16000", str(wav)
], capture_output=True)
print("wav", wav.exists(), wav.stat().st_size if wav.exists() else 0)
