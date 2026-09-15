# -*- coding: utf-8 -*-
from pathlib import Path
kw5 = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
etnx = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

i = kw5.find("function dk(")
print("dk", i)
if i>=0:
    (out/"v4_dk.txt").write_text(kw5[i:i+800], encoding="utf-8")

# gender buttons
for needle in ['gender:"male"', 'Home.tsx:640', 'Home.tsx:655', '성별']:
    print("kw5", needle, kw5.find(needle))

i = kw5.find('children:"성별"')
print("성별 loc", i)
if i>=0:
    (out/"v4_kw5_sex.txt").write_text(kw5[i-200:i+1200], encoding="utf-8")

# result end / footer
i = kw5.find("정확한 이름 감정은")
print("footer", i)
if i>=0:
    (out/"v4_kw5_footer.txt").write_text(kw5[i-400:i+900], encoding="utf-8")

# URL state init
i = kw5.find('return{name:mo,gender:co')
print("init", i)
(out/"v4_kw5_init.txt").write_text(kw5[i:i+400] if i>=0 else "none", encoding="utf-8")

# reset on tab
i = kw5.find('hanjaManualStrokes:["","",""]}),ao(!1)')
print("reset", i)

# english gender
i = etnx.find('children:"Gender"')
print("en gender", i, etnx.find("남성"), etnx.find("Male"))
i = etnx.find('EnglishName.tsx:midSelf')
(out/"v4_etnx_mid_full.txt").write_text(etnx[i-500:i+4000], encoding="utf-8")

# english 815 / 793 for majority
i = etnx.find("EnglishName.tsx:815")
(out/"v4_etnx_815.txt").write_text(etnx[i-100:i+1800] if i>=0 else "none", encoding="utf-8")
i = etnx.find("EnglishName.tsx:793")
print("793", i)
i = etnx.find("w.dominant")
print("dominant count", etnx.count("w.dominant"))
