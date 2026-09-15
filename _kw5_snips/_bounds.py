# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

en = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
ko = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# English 1042 start to 1175
a = en.find('E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:1042"')
b = en.find('E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:1175"')
print("EN 1042", a, "1175", b, "len", b-a)
print("before 1175:", repr(en[b-20:b]))
print("1042 start:", en[a:a+80])
# insert point 781
c = en.find('E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:781"')
print("EN 781", c)
print("before 781:", repr(en[c-30:c]))

# Korean IIFE start and end
d = ko.find("(()=>{const ho=vo=>vo===\"taboo\"")
print("\nKO iife", d)
e = ko.find('m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:1307"')
print("KO 1307", e)
print("before 1307:", repr(ko[e-30:e]))
f = ko.find('m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:978"')
print("KO 978", f)
print("before 978:", repr(ko[f-40:f]))

out.joinpath("en_1042_head.txt").write_text(en[a:a+200]+"\n...\n"+en[b-80:b+80], encoding="utf-8")
out.joinpath("ko_iife_ends.txt").write_text(ko[d:d+80]+"\n---\n"+ko[e-80:e+80]+"\n---978---\n"+ko[f-80:f+80], encoding="utf-8")
print("ok")
