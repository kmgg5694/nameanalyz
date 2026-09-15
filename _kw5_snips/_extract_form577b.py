# -*- coding: utf-8 -*-
from pathlib import Path

kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\form_start.txt")

a = kw.find('data-loc":"client/src/pages/Home.tsx:577"')
b = kw.find('data-loc":"client/src/pages/Home.tsx:718"')
chunk = kw[a:b]
parts = ["len=%s" % len(chunk)]

# loc markers in order
idx = 0
locs = []
while True:
    i = chunk.find("Home.tsx:", idx)
    if i < 0:
        break
    j = chunk.find('"', i)
    locs.append(chunk[i:j])
    idx = i + 9
parts.append("locs: " + ", ".join(locs[:80]))

# unique strings
for m in [
    "이름풀이 시작",
    "풀이 시작",
    "찾기",
    "두음",
    "경고",
    "본명",
    "예명",
    "한자",
    "한문",
    "현재 직위",
    "onSearchClick",
    "Home.tsx:581",
    "Home.tsx:602",
    "Home.tsx:655",
    "Home.tsx:690",
    "Home.tsx:700",
]:
    parts.append("%s -> %s" % (m, chunk.find(m)))

# dump in pieces of 1500
for start in range(0, min(len(chunk), 18000), 1500):
    parts.append("\n===== %s-%s =====" % (start, start + 1500))
    parts.append(chunk[start : start + 1500])

out.write_text("\n".join(parts), encoding="utf-8")
print("chunk", len(chunk), "wrote", out.stat().st_size)
