# -*- coding: utf-8 -*-
from pathlib import Path
import sys, re
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# Home.tsx data-locs in order around result
locs = []
p = 0
while True:
    x = t.find('data-loc":"client/src/pages/Home.tsx:', p)
    if x < 0:
        break
    m = re.match(r'data-loc":"client/src/pages/Home.tsx:(\d+[a-z]*)"', t[x:x+80])
    if m:
        num = m.group(1)
        snippet = t[x:x+160].replace("\n"," ")
        # extract children string if nearby
        locs.append((num, x, snippet[:140]))
    p = x + 20

# unique loc numbers 700-1300 (result area typically)
print("Home locs 700-1300:")
seen = set()
for num, x, sn in locs:
    try:
        n = int("".join(c for c in num if c.isdigit()))
    except:
        continue
    if 700 <= n <= 1300 and num not in seen:
        seen.add(num)
        print(f"  {num:8} {x:8} {sn}")

print("\n--- 요약보기 1113 context ---")
i = t.find("Home.tsx:1113")
print(t[i-200:i+300])

# ohang counts / 木
print("\n--- 木火土 near Home ---")
for s in ["목(木)", "오행", "기운이 강", "상생", "children:\"오행\""]:
    idx = 0
    c = 0
    while c < 6:
        j = t.find(s, idx)
        if j < 0:
            break
        loc = t.rfind("Home.tsx:", max(0, j-300), j)
        print(s, j, "near", t[loc:loc+20] if loc>=0 else "no Home")
        idx = j + 1
        c += 1
