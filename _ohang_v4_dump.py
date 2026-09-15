# -*- coding: utf-8 -*-
from pathlib import Path
kw5 = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
etnx = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

def dump(name, s, needle, before=80, after=2500):
    i = s.find(needle)
    p = out / name
    p.write_text(("NONE "+needle) if i < 0 else s[max(0, i-before):i+after], encoding="utf-8")
    print(f"{name}: {i}")

print("=== kw5 counts ===")
for k in ["기운이 강합니다","기운이 약합니다","재물운 보존력","왕따","겉으로는","010-5694","사장","일반직","유산상속","설령 결혼을","다수오행","ohangExt","ohangInn","ohangWealth"]:
    print(f"  {k}: {kw5.count(k)}")

print("=== etnx counts ===")
for k in ["기운이 강합니다","기운이 약합니다","재물운","왕따","다수오행","스스로 내 몸을","사장","일반직","010-5694","midSelf"]:
    print(f"  {k}: {etnx.count(k)}")

dump("v4_kw5_ohangExt.txt", kw5, 'data-loc":"client/src/pages/Home.tsx:ohangExt"', 400, 4500)
dump("v4_kw5_1219.txt", kw5, 'Home.tsx:1219', 200, 3500)
dump("v4_kw5_gender.txt", kw5, 'Home.tsx:602', 80, 900)
dump("v4_kw5_1307.txt", kw5, 'Home.tsx:1307', 80, 1200)
dump("v4_etnx_880.txt", etnx, 'EnglishName.tsx:880', 200, 2000)
dump("v4_etnx_midSelf.txt", etnx, 'EnglishName.tsx:midSelf', 80, 2500)
dump("v4_etnx_gender.txt", etnx, 'EnglishName.tsx:595', 80, 1200)
