# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

# Find visible title with name on result - look for Home.tsx:75x-80x
j = kw.find('data-loc":"client/src/pages/Home.tsx:750"')
if j < 0:
    # search 요약보기 relative - before that the name card
    j = kw.find('children:"요약보기"')
print("요약보기", j)
# go back to find name heading near result
# search for gold-text or text-2xl with t.name in result section
start = kw.find('id:"result-full-capture"')
end = kw.find('children:"요약보기"', start)
chunk = kw[start:end]
print("chunk len", len(chunk))
# find t.name occurrences in result head
idx = 0
c = 0
while c < 15:
    i = chunk.find("t.name", idx)
    if i < 0:
        break
    print(c, repr(chunk[max(0,i-100):i+80]))
    idx = i + 1
    c += 1

# Find birth 풀이 block marker and what's before it - maybe user expects birth at top
i = kw.find("탄생일은 음력기준")
print("\nbirth note context:")
print(kw[i-100:i+500])

# Find birth input table - label 탄생일
i = kw.find('children:"탄생일"')
print("\nbirth input label", i)
if i > 0:
    print(kw[i-300:i+200])
