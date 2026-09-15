from pathlib import Path

src = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
t = src.read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_extract_out.txt")

needles = [
    "기운이 강합니다",
    "기운이 없습니다",
    "기운 결핍",
    "가장 강한",
    "Td={",
    "Nd={",
    "A6={",
    "R6={",
    "ohangCounts",
    "ohangExt",
    "hg-mid-ext",
    "한글 가운데 글자",
    "외부 기운",
    "내적 기운",
    "재물운 보존력",
    "왕따",
    "hg-dominant",
    "hg-missing",
    "function B6(",
    "function j6(",
    "EnglishName.tsx:826",
    "EnglishName.tsx:793",
    "EnglishName.tsx:1038",
    "Home.tsx:ohangExt",
    "dominant-",
    "missing-",
    "Strongest element",
]
lines = []
for n in needles:
    c = t.count(n)
    idx = t.find(n)
    lines.append(f"{c:4d}  first={idx:10d}  {n}")

b6 = t.find("function B6(")
j6 = t.find("function j6(")
lines.append(f"\nj6={j6} B6={b6} len={len(t)}")

# Which function owns each Td/강합니다
for n in ["기운이 강합니다", "Td={", "ohangCounts", "ohangExt", "hg-mid-ext"]:
    i = 0
    hits = []
    while True:
        i = t.find(n, i)
        if i < 0:
            break
        owner = "B6" if b6 >= 0 and i > b6 else "j6"
        hits.append(f"  {n} @ {i} -> {owner}")
        i += len(n)
        if len(hits) > 20:
            hits.append("  ...")
            break
    lines.extend(hits)

out.write_text("\n".join(lines), encoding="utf-8")
print("wrote", out, "chars", len(t))
