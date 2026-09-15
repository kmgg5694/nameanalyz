# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")
out.mkdir(exist_ok=True)

# find markers around summary end and 총운
markers = [
    "Home.tsx:1193",
    "이제 이 이름이 가진 전체적인 기운",
    "한글이름의 총운",
    "한자이름의 총운",
    "초년",
    "장년",
    "중년",
    "말년",
    "탄생일",
    "birthSuri",
    "원형이정",
]
for s in markers:
    print(f"{s!r}: count={t.count(s)} first={t.find(s)}")

# dump from after summary verdict to 총운 section
j = t.find("Home.tsx:1193")
(out / "after_sum_verdict.txt").write_text(t[j:j+8000], encoding="utf-8")

# dump 총운 block
i = t.find("이제 이 이름이 가진 전체적인 기운")
(out / "chongun_block.txt").write_text(t[i-200:i+4500] if i>=0 else "miss", encoding="utf-8")

# find period detail explanations
for s in ["원형", "형격", "이격", "정격", "won.desc", "data.desc", "gwe.desc"]:
    print("hit", s, t.find(s))

print("done")
