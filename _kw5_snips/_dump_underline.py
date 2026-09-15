# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

def dump(name, needle, before=80, after=700):
    i = kw.find(needle)
    p = out / name
    p.write_text(f"idx={i}\n" + (kw[max(0,i-before):i+after] if i>=0 else "MISSING"), encoding="utf-8")
    print(name, i)

print("len", len(kw))
print("snBtn count", kw.count("snBtn("))
print("WebkitTap", kw.find("WebkitTapHighlightColor"))
print("fmtNm", kw.find("fmtNm="), kw.count("fmtNm="))
print("wrap2", kw.find("wrap2="), kw.count("wrap2="))
print("setTip", kw.find("setTip"), kw.count("setTip("))
print("tipMask", kw.find("tipMask"))

dump("now_snBtn.txt", "const snBtn=", 20, 900)
dump("now_fmtNm.txt", "const fmtNm=", 40, 400)
dump("now_wrap2.txt", "const wrap2=", 20, 250)
dump("now_tipMask.txt", "tipMask", 80, 900)
dump("now_suri_mean.txt", 'children:"수리뜻"', 20, 1200)
dump("now_gwe_row.txt", 'Home.tsx:936"', 0, 900)
dump("now_summary_iife.txt", "(()=>{const ho=vo=>", 0, 500)
dump("now_hangul_suri.txt", 'children:"한글수리"', 20, 1400)
dump("now_j6.txt", "function j6(", 0, 400)
dump("now_desc8.txt", 'name:"수복겸전(壽福兼全)"', 0, 400)
