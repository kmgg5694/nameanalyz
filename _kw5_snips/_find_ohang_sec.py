# -*- coding: utf-8 -*-
from pathlib import Path
import re

for name in ["index-eTNXNndF.js", "index-kw5.js"]:
    p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets") / name
    t = p.read_text(encoding="utf-8")
    print("====", name, "len", len(t))
    for s in ["전체오행", "오행분포", "분포", "요약보기", "Reading Summary", "전체 오행", "Element Distribution", "Five Elements Dist", "오행 개수", "음령오행"]:
        print(f"  {s!r}: {t.count(s)}")
    # headings around 오행
    for m in re.finditer(r'children:"([^"]{0,8}오행[^"]{0,20})"', t):
        print("  head", m.group(1), "at", m.start())
    for m in re.finditer(r'children:\["📋 ",S\?"([^"]+)"', t):
        print("  clip", m.group(1), "at", m.start())
