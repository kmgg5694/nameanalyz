# -*- coding: utf-8 -*-
from pathlib import Path
import re

t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
report = []

# Phrases that mix jargon or Korean concepts poorly for Americans
suspects = [
    "KakaoTalk",
    "blue wealth",
    "hexagram",
    "Numerology (81)",
    "I Ching (64",
    "Self-Centered",
    "Five Elements",
    "life-stage",
    "birth chart",
    "inauspicious",
    "auspicious",
    "taboo",
    "Mo (",
    "staff",
    "ceo",
    "사장",
    "일반직",
    "상생",
    "상극",
    "오행",
    "수리",
    "주역",
    "wealth luck",
    "Name · Suri",
    "Name ·",
    "Gwe",
    "Suri",
    "underline",
]

for s in suspects:
    report.append(f"COUNT\t{s}\t{t.count(s)}")

# Extract English verdict / summary paragraphs
for pat in [
    r'"([^"]{30,200}birth chart[^"]*)"',
    r'"([^"]{30,200}wealth[^"]*)"',
    r'"([^"]{30,200}hexagram[^"]*)"',
    r'"([^"]{20,160}Five Elements[^"]*)"',
    r'"([^"]{20,160}Self-Centered[^"]*)"',
    r'S\?"[^"]+":"([^"]{20,180})"',
]:
    for m in re.finditer(pat, t):
        s = m.group(1)
        if any(ord(c) > 127 for c in s):
            continue
        report.append("STR " + s)

# Find ohang English explanation snippets
i = t.find("Three-Element Structure")
report.append("CTX_OHANG " + t[i:i+500] if i>=0 else "no ohang")

i = t.find("Reading Summary")
report.append("CTX_SUM " + t[max(0,i-100):i+800] if i>=0 else "no sum")

# English letter ohang map?
for needle in ["letterOhang", "enOhang", "A:\"Wood", "Wood", "Fire", "Earth", "Metal", "Water", "abcdefghijklmnopqrstuvwxyz"]:
    report.append(f"FIND {needle} {t.find(needle)}")

Path("_en_access_review.txt").write_text("\n".join(report), encoding="utf-8")
print("ok", len(report))
