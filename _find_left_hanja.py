# -*- coding: utf-8 -*-
from pathlib import Path
t = Path("assets/index-eTNXNndF.js").read_text(encoding="utf-8")
items = [
    ("won_gyeok", "元格"),
    ("hyeong_gyeok", "亨格"),
    ("i_gyeok", "利格"),
    ("jeong_gyeok", "貞格"),
    ("wonhyeong", "원형이정"),
    ("yuanheng", "元亨利貞"),
]
lines = []
for name, s in items:
    c = t.count(s)
    lines.append(f"{name}\t{c}")
    i = 0
    n = 0
    while c and n < 3:
        i = t.find(s, i)
        if i < 0:
            break
        n += 1
        Path(f"_left_{name}_{n}.txt").write_text(t[max(0, i - 100) : i + 140], encoding="utf-8")
        i += len(s)
Path("_left_summary.txt").write_text("\n".join(lines), encoding="utf-8")
