# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path("assets/index-kw5.js").read_text(encoding="utf-8")
out = []
for mark in ["Home.tsx:ohangRow", "Home.tsx:hjOhang", "Home.tsx:978", "Home.tsx:980", "Home.tsx:1031", "오행명"]:
    i = kw.find(f'"data-loc":"{mark}"' if mark.startswith("Home") else mark)
    if i < 0:
        i = kw.find(mark)
    out.append(f"\n==== {mark} @ {i} ====\n")
    if i >= 0:
        out.append(kw[i:i+2200])
Path("_ohang_layout_now.txt").write_text("".join(out), encoding="utf-8")
print("done", len(out))
