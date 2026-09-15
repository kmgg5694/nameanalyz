# -*- coding: utf-8 -*-
"""Trim English-name outro from the Korean name-reading intro video."""
import subprocess
from pathlib import Path
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
videos = Path(r"C:\Users\a8071\Projects\nameanalyz\videos")
src = next(videos.glob("*한국어단독_39초*.mp4"))
dest = videos / "이름풀이_한국어단독.mp4"
CUT = "33.35"

cmd = [
    FFMPEG, "-y", "-i", str(src),
    "-t", CUT,
    "-vf", "fade=t=out:st=32.95:d=0.4",
    "-af", "afade=t=out:st=32.95:d=0.4",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "medium", "-crf", "20",
    "-r", "24",
    "-c:a", "aac", "-ar", "32000", "-ac", "1", "-b:a", "160k",
    "-movflags", "+faststart",
    str(dest),
]
print("SRC", src)
print("DST", dest)
r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
print(r.stderr[-1500:])
print("exists", dest.exists(), "size", dest.stat().st_size if dest.exists() else 0)

p = subprocess.run([FFMPEG, "-i", str(dest)], capture_output=True, text=True, encoding="utf-8", errors="replace")
for ln in p.stderr.splitlines():
    if "Duration" in ln or "Stream" in ln:
        print(ln)
