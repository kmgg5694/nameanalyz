# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path("assets/index-kw5.js").read_text(encoding="utf-8")
for s in ["한글 총운", "한문 총운", "한글이름의 총운", "한자이름의 총운", "이제 이 이름이 가진", "이름기운 · 탄생일"]:
    idx = 0
    n = 0
    while True:
        i = kw.find(s, idx)
        if i < 0:
            break
        n += 1
        print(s, n, i, repr(kw[i-40:i+60]))
        idx = i + 1
    if n == 0:
        print(s, "NONE")
