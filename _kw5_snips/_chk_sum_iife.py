# -*- coding: utf-8 -*-
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
i = t.find("EnglishName.tsx:sumTable")
# IIFE starts with (()=>{const strip=
a = t.rfind("(()=>{const strip=", 0, i)
print("iife start", a, "sumTable", i)
if a < 0:
    a = t.rfind("const strip=", 0, i)
    print("fallback strip", a)
chunk = t[a:i+200]
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\now_sum_iife.txt").write_text(chunk, encoding="utf-8")
print("len", len(chunk))
# also search whole file for leftover example
for s in [
    "매우 좋았음", "나쁜 사주에 비해", "좋은 이름을 가진",
    "이산파멸", "화수미제", "두령지모", "명망사해",
    "strip(Y&&Y.name)", "strip(K&&K.name)",
    "de(N,Y&&Y.name)", "joinS", "joinG",
    "lines.push", "nS=", "bS=",
]:
    print(s, t.find(s))
