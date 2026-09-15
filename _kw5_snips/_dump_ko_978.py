# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")
i = t.find("Home.tsx:978")
out.joinpath("ko_978.txt").write_text(t[i:i+2500], encoding="utf-8")
print("978", i)
# what is between 1075 and 1112
j = t.find("Home.tsx:1075")
k = t.find("Home.tsx:1112")
out.joinpath("ko_1075_1112.txt").write_text(t[j:k+200], encoding="utf-8")
print("1075", j, "1112", k, "gap", k-j)
# end of 요약보기 card - 1193 or 1288
print("1288", t.find("Home.tsx:1288"))
# after 1288
m = t.find("Home.tsx:1288")
out.joinpath("ko_1288.txt").write_text(t[m:m+400], encoding="utf-8")
# first 요약보기 2241739
out.joinpath("ko_sum0.txt").write_text(t[2241650:2241850], encoding="utf-8")
