# -*- coding: utf-8 -*-
import shutil
from pathlib import Path

desktop = Path(r"C:\Users\a8071\OneDrive\Desktop")
videos = Path(r"C:\Users\a8071\Projects\nameanalyz\videos")
src = next(desktop.glob("*영어단독_최종 (1).mp4"))
dest = videos / "영어이름풀이_영어단독.mp4"
shutil.copy2(src, dest)
print("copied", src.name, "->", dest.name, dest.stat().st_size)
old = list(videos.glob("*영어단독_21초*"))
for f in old:
    print("delete", f.name)
    f.unlink()
print("videos english:")
for f in videos.iterdir():
    if "영어이름" in f.name:
        print(" ", f.name, f.stat().st_size)
