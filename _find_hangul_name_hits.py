# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")
idx = 0
n = 0
while True:
    j = kw.find("한글이름", idx)
    if j < 0:
        break
    n += 1
    ctx = kw[max(0, j - 100) : j + 180]
    (out / f"hangul_name_hit_{n}.txt").write_text(ctx, encoding="utf-8")
    print(n, j, ctx.replace("\n", " ")[:160])
    idx = j + 1
print("total", n)

# also look for section headers near 종합
for s in ["한글 이름", "한문 이름", "한글풀이", "한문풀이", "성명표", "획수", "자원오행"]:
    print(s, kw.find(s), kw.count(s))
