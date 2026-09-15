# -*- coding: utf-8 -*-
import subprocess
from pathlib import Path
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
videos = Path(r"C:\Users\a8071\Projects\nameanalyz\videos")
src = next(videos.glob("*한국어단독*.mp4"))
print("SRC", src)
print("exists", src.exists(), "size", src.stat().st_size)
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_video_build\work\ko_frames")
out.mkdir(parents=True, exist_ok=True)

p = subprocess.run([FFMPEG, "-i", str(src)], capture_output=True, text=True, encoding="utf-8", errors="replace")
print(p.stderr)

for t in [18, 20, 22, 24, 26, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38]:
    dest = out / f"t{t:02d}.png"
    r = subprocess.run([
        FFMPEG, "-y", "-ss", str(t), "-i", str(src),
        "-frames:v", "1", str(dest),
    ], capture_output=True)
    print("t", t, "ok" if dest.exists() else "FAIL", dest.exists() and dest.stat().st_size)
