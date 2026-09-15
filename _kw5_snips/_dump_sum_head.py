# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")
i = kw.find('children:"요약보기"')
print("요약보기 hits")
idx=0
hits=[]
while True:
    j=kw.find('children:"요약보기"', idx)
    if j<0: break
    hits.append(j)
    idx=j+1
print(hits)
# Home.tsx:1113
i = kw.find('Home.tsx:1113')
print("1113", i)
(out/"now_sum_head.txt").write_text(kw[i:i+900] if i>=0 else "MISS", encoding="utf-8")
