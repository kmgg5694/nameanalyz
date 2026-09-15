from pathlib import Path
root = Path(r"C:\Users\a8071\Projects\nameanalyz")
out = root / "_kw5_snips"
etnx = (root / "assets" / "index-eTNXNndF.js").read_text(encoding="utf-8")
kw5 = (root / "assets" / "index-kw5.js").read_text(encoding="utf-8")

i = etnx.find("EnglishName.tsx:880")
(out / "now_etnx_880_full.txt").write_text(etnx[i:i+8000], encoding="utf-8")

# find where 880 IIFE ends — next sibling after }})()
# also 재물 / 수리 after it
for n in ["재물운", "EnglishName.tsx:980", "EnglishName.tsx:1000", "Numerology", "수리 81"]:
    j = etnx.find(n, i)
    print(n, j)

j = etnx.find("수리 81")
print("수리81", j)
if j < 0:
    j = etnx.find("Numerology")
(out / "now_etnx_after880.txt").write_text(etnx[i+5500:i+9000], encoding="utf-8")

# 793 text to restore 강약
(out / "now_etnx_793.txt").write_text(etnx[etnx.find("EnglishName.tsx:793")-50:etnx.find("EnglishName.tsx:793")+900], encoding="utf-8")

# missing filter
print("filter !1", etnx.count("z=x.filter(N=>!1)"))
print("ohangCounts[N]===0", etnx.count("ohangCounts[N]===0"))
print("기운이 약", etnx.count("기운이 약"))
print("kT={", etnx.count("kT={"))
