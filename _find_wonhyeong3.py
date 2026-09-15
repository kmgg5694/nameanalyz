# -*- coding: utf-8 -*-
from pathlib import Path
import re

t = Path("assets/index-eTNXNndF.js").read_text(encoding="utf-8")
out = []

# All labelEn with Gyeok / Won / Hyeong / Yi / Jeong
for m in re.finditer(r'labelEn:"[^"]+"', t):
    g = m.group(0)
    if any(x in g for x in ("Gyeok", "Won", "Hyeong", "Yi ", "Jeong", "Youth", "Middle", "Early", "Late", "元", "亨", "利", "貞", "Destiny", "Fortune")):
        out.append(g)

out.append("--- children headers ---")
for m in re.finditer(r'S\?"(초년|장년|중년|말년|구분)":"[^"]+"', t):
    out.append(m.group(0))

out.append("--- destiny / birth titles ---")
for m in re.finditer(r'S\?"[^"]{0,40}원형이정[^"]{0,40}":"[^"]+"', t):
    out.append(m.group(0))
for m in re.finditer(r'S\?"[^"]{0,30}탄생일[^"]{0,40}":"[^"]+"', t):
    out.append(m.group(0))

# phonetic leftovers in English strings
for m in re.finditer(r'"[^"]*(?:Gyeok|Wonhyeong|元亨利貞|원형이정|亨格|利格|貞格|元格)[^"]*"', t):
    s = m.group(0)
    if len(s) < 200:
        out.append("STR " + s)

Path("_won_report.txt").write_text("\n".join(out), encoding="utf-8")
print("ok", len(out))
