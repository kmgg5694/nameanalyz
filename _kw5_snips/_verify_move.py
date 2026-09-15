# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

en = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
ko = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

def pos(t, s):
    return t.find(s)

print("EN order:")
for s in ["EnglishName.tsx:1042m", "EnglishName.tsx:1043", "EnglishName.tsx:781", "전체 오행 분포", "EnglishName.tsx:1042", "EnglishName.tsx:1175"]:
    print(" ", s, pos(en, s))
print("EN 1043 heading count", en.count('EnglishName.tsx:1043"'))
print("EN sumTable", en.count("EnglishName.tsx:sumTable"))
print("EN iife strip", en.count('(()=>{const strip=x=>String(x||"")'))

print("\nKO order:")
for s in ["Home.tsx:1112", "Home.tsx:1113", "Home.tsx:978", "Home.tsx:1201", "Home.tsx:818"]:
    print(" ", s, pos(ko, s))
print("KO taboo iife", ko.count('(()=>{const ho=vo=>vo==="taboo"'))
print("KO 요약보기", ko.count("요약보기"))

# EN: 1042m < 781 < 1042 (old wrapper) < 1175
ok = pos(en,"1042m") < pos(en,"EnglishName.tsx:781") < pos(en,'EnglishName.tsx:1042"') < pos(en,"EnglishName.tsx:1175")
print("EN sequence ok", ok)
ok2 = pos(ko,"Home.tsx:818") < pos(ko,"Home.tsx:1112") < pos(ko,"Home.tsx:978") < pos(ko,"Home.tsx:1201")
print("KO sequence ok", ok2)
