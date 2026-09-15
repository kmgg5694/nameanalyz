# -*- coding: utf-8 -*-
from pathlib import Path
import re

t = Path("assets/index-eTNXNndF.js").read_text(encoding="utf-8")
for s in ["音靈五行", "KakaoTalk", "Self-Centered", "Mo (1", "blue wealth", "Inauspicious", "Phonetic", "generating", "controlling"]:
    i = 0
    n = 0
    while True:
        i = t.find(s, i)
        if i < 0:
            break
        n += 1
        Path(f"_leftfix_{n}_{s[:8].encode('ascii','ignore').decode() or 'x'}.txt").write_text(
            t[max(0, i - 100) : i + 160], encoding="utf-8"
        )
        print(s, n, i)
        i += len(s)
    if n == 0:
        print(s, 0)
