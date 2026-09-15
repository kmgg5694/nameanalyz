# -*- coding: utf-8 -*-
from pathlib import Path
import re

t = Path("assets/index-eTNXNndF.js").read_text(encoding="utf-8")
orig = t
report = []

def rep(old, new):
    global t
    c = t.count(old)
    if c:
        t = t.replace(old, new)
        report.append(f"OK x{c} {old[:60]} → {new[:60]}")
    else:
        report.append(f"MISS {old[:70]}")

rep(
    "Link copied.\\nPaste it in KakaoTalk or Messages.",
    "Link copied.\\nPaste it in Messages or any app.",
)
# alternate escaping in source
rep(
    "Link copied.\nPaste it in KakaoTalk or Messages.",
    "Link copied.\nPaste it in Messages or any app.",
)

# Soften remaining generating/controlling in English UI sentences
reps = [
    (
        "One generating and one controlling — neither especially good nor bad; a middle state.",
        "One supportive and one clashing link — neither especially good nor bad; a middle state.",
    ),
    (
        "generating links",
        "supportive links",
    ),
    (
        "controlling links",
        "clashing links",
    ),
]
# Also capture S? ternary English sides with generating/controlling
for m in re.finditer(r'S\?"[^"]*":"([^"]*(?:generating|controlling)[^"]*)"', t):
    en = m.group(1)
    report.append("FOUND " + en)

for old, new in reps:
    rep(old, new)

# Fix any remaining Kakao in English-only strings
for m in re.finditer(r'"[^"]*Kakao[^"]*"', t):
    report.append("KAKAO " + m.group(0)[:120])

if t != orig:
    Path("assets/index-eTNXNndF.js").write_text(t, encoding="utf-8")

Path("_en_access_fix2.txt").write_text("\n".join(report), encoding="utf-8")
print("changed", t != orig)
print("Kakao left", t.count("KakaoTalk"))
