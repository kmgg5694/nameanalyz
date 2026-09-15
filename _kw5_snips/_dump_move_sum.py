# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# around 전체 오행 분포
i = t.find('S?"전체 오행 분포"')
out.joinpath("move_ohang_around.txt").write_text(t[i-1500:i+800], encoding="utf-8")
print("ohang around", i)

# find start of 요약보기 card
j = t.find('이름풀이 요약보기')
# search backward for the wrapping div
k = t.rfind("E.jsxs(", 0, j)
# more likely the card starts with a data-loc near 1040
k2 = t.rfind("data-loc", 0, j)
print("sum heading", j, "prev jsxs", k, "prev loc", k2, t[k2:k2+80])
out.joinpath("move_sum_head.txt").write_text(t[j-600:j+400], encoding="utf-8")

# after sumTable IIFE ends at EnglishName.tsx:1175
k3 = t.find('EnglishName.tsx:1175')
print("1175", k3)
out.joinpath("move_sum_after.txt").write_text(t[k3-200:k3+250], encoding="utf-8")

# find parent of 전체 오행 분포 - look for data-loc before it
locs = []
p = 0
while True:
    x = t.find("EnglishName.tsx:", p)
    if x < 0 or x > i + 50:
        break
    if x > i - 4000:
        locs.append(t[x:x+40])
    p = x + 1
print("locs near ohang:")
for L in locs[-15:]:
    print(" ", L)
