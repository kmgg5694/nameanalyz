# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# all 전체 오행
idx = 0
n = 0
while True:
    i = t.find("전체 오행", idx)
    if i < 0:
        break
    loc = t.rfind("data-loc", max(0, i-200), i)
    print("전체 오행", n, i, "loc", t[loc:loc+70] if loc>=0 else "?")
    print(" ", t[i-60:i+80].replace("\n"," "))
    idx = i + 1
    n += 1

print("--- 요약보기 ---")
idx = 0
n = 0
while True:
    i = t.find("요약보기", idx)
    if i < 0:
        break
    loc = t.rfind("data-loc", max(0, i-200), i)
    print("요약보기", n, i, "loc", t[loc:loc+80] if loc>=0 else "?")
    idx = i + 1
    n += 1

# Home 오행 section
for s in ["오행 분포", "음양오행", "자원오행", "Home.tsx:7"]:
    print(s, t.find(s), t.count(s))

# dump around Home 요약보기 1113
i = t.find("Home.tsx:1113")
out.joinpath("ko_sum_1113.txt").write_text(t[i-400:i+500], encoding="utf-8")
print("1113", i)

# find ohang distribution on Home
for s in ["Home.tsx:7", "기운이", "목화토금수"]:
    pass

# search Home data-locs near 오행 bars
i = t.find('children:"전체 오행 분포"')
print("exact children 전체", i)
i = t.find("v?\"전체 오행 분포\"")
print("v? 전체", i)
# Home might use different string
for s in ["오행분포", "오행 개수", "전체오행", "분포도"]:
    print(s, t.find(s))
