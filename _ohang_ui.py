from pathlib import Path
etnx = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
kw5 = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# eTNX EnglishName loc markers around ohang
for loc in ["780","787","803","811","815","825","830","835","840","850","860"]:
    n = f'EnglishName.tsx:{loc}"'
    i = etnx.find(n)
    print(f"eTNX {loc}: {i}")

# dump from ~770 to ~860
i = etnx.find("EnglishName.tsx:770")
if i < 0:
    i = etnx.find("EnglishName.tsx:780")
(out/"etnx_ohang_ui.txt").write_text(etnx[i-200:i+5500] if i>=0 else "NONE", encoding="utf-8")

# kw5 B6 unique strings for null replace
i = kw5.find('EnglishName.tsx:803"')
(out/"kw5_b6_803.txt").write_text(kw5[i-80:i+2400] if i>=0 else "NONE", encoding="utf-8")

# wealth in eTNX
print("eTNX 재물운", etnx.count("재물운"), "왕따", etnx.count("왕따"), "middleRep", etnx.count("middleRep"))
print("eTNX 기운이 강한", etnx.count("기운이 강한"))
print("eTNX 겉으로 드러내는 기운", etnx.count("겉으로 드러내는 기운"))
