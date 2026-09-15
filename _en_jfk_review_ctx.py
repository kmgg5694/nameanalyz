# -*- coding: utf-8 -*-
from pathlib import Path
import re

t = Path("assets/index-eTNXNndF.js").read_text(encoding="utf-8")
chunks = []

for key in [
    "EnglishName.tsx:midSelf",
    "EnglishName.tsx:1043",
    "blue wealth",
    "KakaoTalk",
    "Self-Centered",
    "Mo (1-12)",
    "staff",
    "Current Position",
    "rank",
    "사장",
    "일반",
    "Title",
    "김만기주역",
]:
    i = t.find(key)
    chunks.append(f"\n===== {key} @ {i} =====\n")
    if i >= 0:
        chunks.append(t[max(0, i - 80) : i + 350])

# summary table row labels English
for m in re.finditer(r'S\?"([^"]{2,40})":"([^"]{2,60})"', t):
    ko, en = m.group(1), m.group(2)
    if any(x in ko for x in ("수리", "괘", "이름", "탄생", "오행", "재물", "총평", "구분")) or any(
        x in en for x in ("Name", "Birth", "Suri", "Hex", "Type", "Wealth", "Summary")
    ):
        chunks.append(f"TERN {ko} => {en}")

Path("_en_jfk_review_ctx.txt").write_text("".join(chunks), encoding="utf-8")
print("wrote", len(chunks))
