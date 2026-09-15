# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# Detailed analysis sections after 요약
i = kw.find('children:["한글이름의 총운은 "')
print("총운", i)
(out / "hangul_detail_block.txt").write_text(kw[i : i + 20000], encoding="utf-8")

# check for 한문이름의
for s in ["한문이름의", "한문 이름", "한문이름의 총운", "한문이름의 초년", "hjShow&&m.jsxs", "uo&&"]:
    print(s, kw.count(s), kw.find(s))

# 요약보기 tbody end - is 한문 incomplete?
j = kw.find('children:"한문수리"', kw.find("요약보기"))
print("요약 한문수리", j)
(out / "sum_hanja_rows_now.txt").write_text(kw[j : j + 3500], encoding="utf-8")

# Check if 한문 rows are gated
k = kw.find('Home.tsx:1150')
print("around 1150 gate", kw[k-80:k+50])
