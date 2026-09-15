# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

i = t.find('data-loc":"client/src/pages/Home.tsx:1307"')
# find 중년 block and what comes after
k = t.find("중년(41", i)
print("중년", k)
(out / "after_jungnyeon.txt").write_text(t[k:k+8000], encoding="utf-8")

# search 말년 in whole On result area
area = t[i:i+50000]
print("말년 in 50k", area.find("말년"), area.find("56세"), area.find("정격"), area.find("jeong"))
# find all "을 보겠습니다" in area
idx = 0
while True:
    j = area.find("을 보겠습니다", idx)
    if j < 0:
        break
    print("보겠습니다", j, area[j-40:j+20])
    idx = j + 1

# find contact footer
print("연락", area.find("010-5694"))
