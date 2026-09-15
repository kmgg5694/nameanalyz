# Read-only dump of ohang-related snippets from the two bundles.
from pathlib import Path

root = Path(r"C:\Users\a8071\Projects\nameanalyz")
out = root / "_kw5_snips"
out.mkdir(exist_ok=True)
kw5 = (root / "assets" / "index-kw5.js").read_text(encoding="utf-8")
etnx = (root / "assets" / "index-eTNXNndF.js").read_text(encoding="utf-8")


def dump(name, text, needle, before=400, after=1200):
    i = text.find(needle)
    p = out / name
    if i < 0:
        p.write_text("NONE " + needle, encoding="utf-8")
        return -1
    p.write_text(text[max(0, i - before) : i + after], encoding="utf-8")
    return i


needles_kw5 = [
    "기운이 강합니다",
    "기운이 없습니다",
    "Td={",
    "Td[",
    "Nd={",
    "A6={",
    "R6={",
    "ohangExt",
    "hg-mid-ext",
    "재물운 보존력",
    "양부모·관청",
    "왕따",
    "가장 강한",
    "겉으로 드러내는",
    "내적 기운",
    "ohangCounts",
    "EnglishName.tsx:803",
    "EnglishName.tsx:825",
    "EnglishName.tsx:1038",
    "Home.tsx:ohangExt",
    "So.label",
    "function B6(",
    "function j6(",
]
needles_etnx = [
    "기운이 강합니다",
    "기운이 없습니다",
    "겉으로 드러내는",
    "재물운 보존력",
    "왕따",
    "양부모·관청",
    "middleRep",
    "ohangCounts",
    "EnglishName.tsx:782",
    "EnglishName.tsx:787",
    "EnglishName.tsx:803",
    "EnglishName.tsx:815",
    "EnglishName.tsx:825",
    "EnglishName.tsx:850",
    "lastRep",
    "firstRep",
    "uy={",
]

lines = ["=== kw5 counts ==="]
for n in needles_kw5:
    lines.append(f"  {kw5.count(n):3d}  {n}")
lines.append("=== eTNX counts ===")
for n in needles_etnx:
    lines.append(f"  {etnx.count(n):3d}  {n}")
(out / "now_status.txt").write_text("\n".join(lines), encoding="utf-8")

dump("now_kw5_ohangExt.txt", kw5, "Home.tsx:ohangExt", 200, 2500)
dump("now_kw5_803.txt", kw5, "EnglishName.tsx:803", 80, 500)
dump("now_kw5_td.txt", kw5, ",Td={", 20, 200)
dump("now_kw5_solabel.txt", kw5, "So.label", 200, 800)
dump("now_etnx_782.txt", etnx, "EnglishName.tsx:782", 400, 3500)
dump("now_etnx_815.txt", etnx, "EnglishName.tsx:815", 200, 2500)
dump("now_etnx_uy.txt", etnx, "uy={木:", 0, 400)

# lastRep assignment
i = etnx.find("lastRep:")
dump("now_etnx_lastRep_ret.txt", etnx, "lastRep:", 800, 400)

# how lastRep computed — search backwards from return
j = etnx.rfind("lastRep", 0, i) if i >= 0 else -1
# find lastRep= assignment
k = etnx.find("lastRep=")
(out / "now_etnx_lastRep_eq.txt").write_text(
    etnx[max(0, k - 500) : k + 800] if k >= 0 else f"eq={k} ret={i}",
    encoding="utf-8",
)

# firstOhangs / representative
for label, n in [
    ("now_etnx_firstOhangs.txt", "firstOhangs"),
    ("now_etnx_lastOhangs.txt", "lastOhangs="),
    ("now_etnx_dominant.txt", "dominant:"),
]:
    dump(label, etnx, n, 300, 500)

print("\n".join(lines))
print("wrote", out)
