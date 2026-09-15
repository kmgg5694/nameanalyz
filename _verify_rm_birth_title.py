# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
# remaining 음력 "+birth.lunar near birthRead
i = 0
while True:
    j = kw.find('children:"음력 "+birth.lunar[0]', i)
    if j < 0:
        break
    print(j, repr(kw[j-80:j+100]))
    i = j + 1
print("탄생일 풀이", kw.find("탄생일 풀이"))
