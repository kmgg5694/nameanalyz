# -*- coding: utf-8 -*-
from pathlib import Path

js = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
# dump header region
i = js.find('EnglishName.tsx:564')
Path(r"C:\Users\a8071\Projects\nameanalyz\_video_build\en_header.txt").write_text(js[i:i+2500], encoding="utf-8")
print("header dumped", i)

ko = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
# Home outer layout around first screen
j = ko.find("Home.tsx:540")
print("home 540", j)
# find min-h-screen near Home input
k = 0
locs = []
while True:
    n = ko.find("Home.tsx:", k)
    if n < 0 or n > 1900000:
        if n < 0:
            break
    loc = ko[n:n+18]
    if loc.split(":")[-1].rstrip('"').isdigit():
        num = int(loc.split(":")[-1].rstrip('"'))
        if 520 <= num <= 590:
            locs.append((num, ko[n-80:n+280]))
    k = n + 10
    if len(locs) > 40:
        break
Path(r"C:\Users\a8071\Projects\nameanalyz\_video_build\ko_home_layout.txt").write_text(
    "\n\n====\n\n".join(f"{a}\n{b}" for a,b in locs), encoding="utf-8"
)
print("ko locs", len(locs))
