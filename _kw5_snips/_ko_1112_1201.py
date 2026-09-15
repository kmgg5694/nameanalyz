# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ko = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
a = ko.find('m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:1112"')
b = ko.find('m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:1201"')
print("1112", a, "1201", b, "len", b-a)
print("BEFORE 1201:", repr(ko[b-80:b]))
print("1112 HEAD:", ko[a:a+180])
# 1193
c = ko.find("Home.tsx:1193")
print("\n1193 to 1201:\n", ko[c:b+80])
