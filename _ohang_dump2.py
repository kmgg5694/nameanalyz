from pathlib import Path
root = Path(r"C:\Users\a8071\Projects\nameanalyz")
out = root / "_kw5_snips"
etnx = (root / "assets" / "index-eTNXNndF.js").read_text(encoding="utf-8")
kw5 = (root / "assets" / "index-kw5.js").read_text(encoding="utf-8")

def dump(name, text, needle, before=500, after=1500):
    i = text.find(needle)
    p = out / name
    if i < 0:
        p.write_text("NONE " + needle, encoding="utf-8")
        return
    p.write_text(text[max(0, i - before) : i + after], encoding="utf-8")

# IIFE end + next section
dump("now_etnx_iife_end.txt", etnx, "EnglishName.tsx:852", 100, 2500)
dump("now_etnx_uy_full.txt", etnx, "uy={木:", 0, 1800)
dump("now_etnx_kT.txt", etnx, "kT={", 0, 400)

# compute ff/cf and s,m,e
dump("now_etnx_ff.txt", etnx, "function ff(", 0, 400)
dump("now_etnx_cf.txt", etnx, "function cf(", 0, 400)
# assignment of s,m,e near lastOhangs
dump("now_etnx_ha.txt", etnx, "lastOhangs", 800, 200)

# name grid UI
for loc in ["640", "650", "700", "720", "740", "760", "770"]:
    dump(f"now_etnx_{loc}.txt", etnx, f"EnglishName.tsx:{loc}", 50, 600)

# Td leftover refs in kw5
lines = []
for n in ["Td", "Nd", "A6", "R6", "Td[", "Nd[", "A6[", "R6["]:
    lines.append(f"{n}: {kw5.count(n)}")
# find remaining Td usages
i = 0
c = 0
while c < 8:
    j = kw5.find("Td", i)
    if j < 0:
        break
    lines.append(f"Td@{j}: {kw5[j-30:j+40]!r}")
    i = j + 2
    c += 1
(out / "now_kw5_td_uses.txt").write_text("\n".join(lines), encoding="utf-8")

# Korean 강하다 leftovers in j6 only
j6 = kw5.find("function j6(")
b6 = kw5.find("function B6(")
body = kw5[j6:b6]
(out / "now_kw5_j6_strong.txt").write_text(
    f"강합니다={body.count('강합니다')} 약합니다={body.count('약합니다')} 결핍={body.count('결핍')} 가장 강한={body.count('가장 강한')} Td={body.count('Td')}\n",
    encoding="utf-8",
)

# 왕따 in eTNX
dump("now_etnx_왕따.txt", etnx, "왕따", 200, 400)

print("ok")
