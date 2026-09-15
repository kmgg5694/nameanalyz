# -*- coding: utf-8 -*-
import subprocess
from pathlib import Path
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
paths = [
    Path(r"C:\Users\a8071\Projects\nameanalyz\videos\이름풀이_한국어단독.mp4"),
    Path(r"C:\Users\a8071\Projects\nameanalyz\_video_build\inbox41\이름풀이_한국어단독_지연추가_최종.mp4"),
]
for p in paths:
    print("===", p.name, "exists", p.exists(), "size", p.stat().st_size if p.exists() else 0)
    if not p.exists():
        continue
    r = subprocess.run([FFMPEG, "-i", str(p)], capture_output=True, text=True, encoding="utf-8", errors="replace")
    for ln in r.stderr.splitlines():
        if "Duration" in ln or "Stream" in ln or "Video:" in ln or "Audio:" in ln:
            print(ln.strip())
    print()
