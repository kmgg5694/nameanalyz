# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# Extract full 요약보기 tbody (Home)
start = kw.find('children:"요약보기"')
# find home version (second or the one with 1113)
start = kw.find('Home.tsx:1113')
tbody = kw.find('Home.tsx:1134', start)
end = kw.find('Home.tsx:1172', start)
if end < 0:
    end = kw.find('}]}),m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1172"', start)
print("start", start, "tbody", tbody, "end", end)
chunk = kw[start:start+8000] if end < 0 else kw[start:end+200]
(out / "home_sum_full.txt").write_text(chunk, encoding="utf-8")

# Check syntax around 한문수리
j = kw.find('Home.tsx:1150')
print(kw[j:j+2500])
(out / "home_sum_hanja.txt").write_text(kw[j:j+4000], encoding="utf-8")

# Check if 한문 rows are unconditional
print("1150 preceded by", repr(kw[j-30:j]))
