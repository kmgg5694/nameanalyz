# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
# Ln array: find first {char:" after const or let that holds hanja
i = kw.find('{char:"')
print("first", i, kw[i:i+80])
c = 0
pos = 0
while True:
    j = kw.find('{char:"', pos)
    if j < 0:
        break
    c += 1
    pos = j + 7
print("char objects", c)
# last one
print("last around", pos)
