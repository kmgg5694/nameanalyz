# -*- coding: utf-8 -*-
from pathlib import Path
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js")
t = p.read_text(encoding="utf-8")
neu = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\_sum_iife_neu.js").read_text(encoding="utf-8").rstrip() + "\n"
mark = 'return E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:sumTable"'
end = t.find(mark)
if end < 0:
    raise SystemExit("sumTable return not found")
start = t.rfind("(()=>{const strip=", 0, end)
if start < 0:
    raise SystemExit("IIFE start not found")
t2 = t[:start] + neu + t[end:]
p.write_text(t2, encoding="utf-8")
print("old", end - start, "new", len(neu))
print("sumTable", t2.count("EnglishName.tsx:sumTable"))
print("praiseG", "재물을 모으고 키우기" in t2)
print("warnG", "큰 위기가 있으니" in t2)
print("canned1", "나쁜 사주에 비해" in t2)
print("canned2", "매우 좋았음" in t2)
