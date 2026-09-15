# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

needles = [
    "전체 오행",
    "Five Elements Dist",
    "이름풀이 요약보기",
    "Reading Summary",
    "EnglishName.tsx:sumTable",
    "Home.tsx:1113",
    "음령오행",
]

for name in ["index-eTNXNndF.js", "index-kw5.js"]:
    p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets") / name
    t = p.read_text(encoding="utf-8")
    print("====", name)
    for s in needles:
        i = t.find(s)
        print(f"  {s!r:40} {i}")
        if i >= 0:
            chunk = t[max(0, i-80): i+120].replace("\n", " ")
            print("   ", chunk[:200])
