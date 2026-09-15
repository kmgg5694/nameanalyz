# -*- coding: utf-8 -*-
from pathlib import Path
kw5 = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
etnx = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

def w(name, s, i, a=0, b=800):
    (out/name).write_text("NONE" if i<0 else s[max(0,i-a):i+b], encoding="utf-8")
    print(name, i)

# kakao / url
for n in ["hc=","ho=","gender=","URLSearchParams","set(\"name\""]:
    print("kw5", n, kw5.find(n), kw5.count(n) if len(n)<8 else "")

i = kw5.find('G.set("name"')
if i<0: i = kw5.find('.set("name"')
w("v4_kw5_urlset.txt", kw5, i, 50, 600)

i = kw5.find('hanjaManualStrokes:["","",""]}),ao(!1)')
w("v4_kw5_reset.txt", kw5, i, 80, 80)

# english form
i = etnx.find("gender")
print("etnx gender first", i)
i = etnx.find("EnglishName.tsx:570")
print("570", i)
for loc in ["560","565","575","580","585","590","600","610","620"]:
    print("en", loc, etnx.find(f"EnglishName.tsx:{loc}"))

i = etnx.find('children:"Gender"')
if i<0: i = etnx.find('children:S?"성별"')
print("gender label", i)
w("v4_etnx_sex.txt", etnx, i if i>=0 else etnx.find("male"), 100, 900)

i = etnx.find("정확한 이름 감정")
print("en footer", i)
if i<0:
    i = etnx.find("expert consultation")
w("v4_etnx_footer.txt", etnx, i, 200, 500)

# 880 head current
i = etnx.find('EnglishName.tsx:880')
w("v4_etnx_880head.txt", etnx, i, 900, 200)

# IIFE extra 강약 end -> 880
i = etnx.find("EnglishName.tsx:847")
w("v4_etnx_847.txt", etnx, i, 0, 1500)
