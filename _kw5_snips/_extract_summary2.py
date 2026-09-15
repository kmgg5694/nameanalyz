# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\summary_view2.txt")
parts = []
idx = 0
n = 0
while n < 5:
    j = kw.find("요약보기", idx)
    if j < 0:
        break
    loc = kw.rfind("data-loc", max(0, j - 120), j)
    parts.append("요약보기 #%s at %s locctx=%s" % (n, j, kw[loc:j+20] if loc>=0 else "?"))
    idx = j + 3
    n += 1

i = kw.find("한글수리", kw.find("한글수리") + 1)
parts.append("\n=== 2nd 한글수리 ===")
parts.append(kw[i - 500 : i + 3500])

# Home 요약보기
h = kw.find('children:"요약보기"')
# find Home.tsx near 요약
k = kw.find("Home.tsx")
# search Home 요약
p = 0
while True:
    x = kw.find("요약보기", p)
    if x < 0:
        break
    chunk = kw[max(0, x - 80) : x]
    if "Home.tsx" in chunk:
        parts.append("\n=== Home 요약 ===")
        parts.append(kw[x - 150 : x + 4500])
        break
    p = x + 3

out.write_text("\n".join(parts), encoding="utf-8")
print("wrote")
