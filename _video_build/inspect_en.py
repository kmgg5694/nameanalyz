# -*- coding: utf-8 -*-
from pathlib import Path

s = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
i = s.find('className:"intro-sec"')
print("intro idx", i)
if i >= 0:
    Path(r"C:\Users\a8071\Projects\nameanalyz\_video_build\en_intro_snip.txt").write_text(s[i-250:i+2200], encoding="utf-8")
    print("wrote intro snip")

j = s.find("EnglishName.tsx:595")
print("595 idx", j)
if j >= 0:
    Path(r"C:\Users\a8071\Projects\nameanalyz\_video_build\en_595_snip.txt").write_text(s[j-120:j+800], encoding="utf-8")

# layout-ish around first screen
k = s.find("EnglishName.tsx:1")
print("tsx:1", k)

# find min-h-screen / mx-auto classNames near EnglishName
idx = 0
hits = []
while True:
    n = s.find("EnglishName.tsx:", idx)
    if n < 0:
        break
    loc = s[n:n+40]
    nearby = s[max(0, n-180):n+220]
    if any(x in nearby for x in ["min-h", "mx-auto", "maxWidth", "margin", "padding", "flex", "text-center", "items-center", "justify"]):
        hits.append((loc, nearby[:400]))
    idx = n + 20
    if len(hits) > 25:
        break
Path(r"C:\Users\a8071\Projects\nameanalyz\_video_build\en_layout_hits.txt").write_text(
    "\n\n====\n\n".join(f"{a}\n{b}" for a, b in hits), encoding="utf-8"
)
print("layout hits", len(hits))

# Korean home first screen for comparison
ko = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
m = ko.find('className:"intro-sec"')
print("ko intro", m)
n = ko.find("Home.tsx:573")
print("ko 573", n)
if n >= 0:
    Path(r"C:\Users\a8071\Projects\nameanalyz\_video_build\ko_573_snip.txt").write_text(ko[n-200:n+600], encoding="utf-8")
