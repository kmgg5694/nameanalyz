# -*- coding: utf-8 -*-
from pathlib import Path
import re

t = Path("assets/index-eTNXNndF.js").read_text(encoding="utf-8")
out = []

# Find remaining 원형이정 / hanja related to life stages
for pat in [
    r'[^"]{0,40}원형이정[^"]{0,40}',
    r'[^"]{0,40}元亨利貞[^"]{0,40}',
    r'label:"[^"]*"',
    r'labelEn:"[^"]*"',
]:
    for m in re.finditer(pat, t):
        g = m.group(0)
        if any(x in g for x in ("원형", "元", "亨", "利", "貞", "원격", "형격", "이격", "정격", "Gyeok", "Early Fortune", "Prime Years")):
            if g not in out and len(g) < 180:
                out.append(g)

Path("_won_remain.txt").write_text("\n".join(out), encoding="utf-8")
print("count", len(out))
for x in out[:60]:
    print(x)
