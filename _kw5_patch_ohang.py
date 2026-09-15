from pathlib import Path

src = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
t = src.read_text(encoding="utf-8")
orig_len = len(t)
etnx = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js")
etnx_before = etnx.read_bytes()

def extract_obj(s, start_eq):
    i = s.find("{", start_eq)
    depth = 0
    in_str = None
    esc = False
    for k, ch in enumerate(s[i:], i):
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == in_str:
                in_str = None
            continue
        if ch in ("'", '"', "`"):
            in_str = ch
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return k + 1
    raise SystemExit("unbalanced object")

# 1) Remove B6 dominant-characteristics card + count>=3 / missing IIFE
a = t.find(',m.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:803"')
b = t.find(']}),m.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:850"', a)
if a < 0 or b < 0:
    raise SystemExit(f"803/850 markers missing a={a} b={b}")
chunk = t[a:b]
assert "Td[" in chunk and "A6[" in chunk and "ohangCounts[z]>=3" in chunk, "unexpected 803 chunk"
t = t[:a] + t[b:]
print("removed 803+count IIFE", b - a, "chars")

# 2) Remove print-card "가장 강한 기운"
star = ',m.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:1038"'
s = t.find(star)
if s < 0:
    raise SystemExit("1038 marker missing after first cut")
# walk m.jsxs(
p = t.find("(", s)
depth = 0
in_str = None
esc = False
end = None
for k, ch in enumerate(t[p:], p):
    if in_str:
        if esc:
            esc = False
        elif ch == "\\":
            esc = True
        elif ch == in_str:
            in_str = None
        continue
    if ch in ("'", '"', "`"):
        in_str = ch
        continue
    if ch == "(":
        depth += 1
    elif ch == ")":
        depth -= 1
        if depth == 0:
            end = k + 1
            break
star_chunk = t[s:end]
assert "가장 강한 기운" in star_chunk, star_chunk[:200]
t = t[:s] + t[end:]
print("removed 1038 star", end - s, "chars")

# 3) Remove Td/Nd/A6/R6 tables
td = t.find(",Td={")
if td < 0:
    raise SystemExit("Td={ missing")
nd = t.find(",Nd={", td)
a6 = t.find(",A6={", nd)
r6 = t.find(",R6={", a6)
r6_end = extract_obj(t, r6)
tables = t[td:r6_end]
assert "기운이 강합니다" in tables and "기운이 없습니다" in tables
assert t[r6_end:r6_end+20].startswith(";function yg")
t = t[:td] + t[r6_end:]
print("removed Td/Nd/A6/R6", r6_end - td, "chars")

# Verify
checks = {
    "기운이 강합니다": t.count("기운이 강합니다"),
    "기운이 없습니다": t.count("기운이 없습니다"),
    "기운 결핍": t.count("기운 결핍"),
    "가장 강한": t.count("가장 강한"),
    "Td={": t.count("Td={"),
    "Td[": t.count("Td["),
    "Nd={": t.count("Nd={"),
    "A6={": t.count("A6={"),
    "R6={": t.count("R6={"),
    "ohangExt": t.count("ohangExt"),
    "hg-mid-ext": t.count("hg-mid-ext"),
    "양부모·관청": t.count("양부모·관청"),
    "재물운 보존력": t.count("재물운 보존력"),
    "function B6(": t.count("function B6("),
    "function j6(": t.count("function j6("),
}
print("checks", checks)
assert checks["기운이 강합니다"] == 0
assert checks["Td={"] == 0
assert checks["Td["] == 0
assert checks["A6={"] == 0
assert checks["ohangExt"] == 1
assert checks["function B6("] == 1
assert "EnglishName.tsx:850" in t
assert "Home.tsx:ohangExt" in t

src.write_text(t, encoding="utf-8")
print("wrote kw5", orig_len, "->", len(t), "delta", len(t) - orig_len)

etnx_after = etnx.read_bytes()
assert etnx_before == etnx_after, "eTNX was modified — abort"
print("eTNX unchanged", len(etnx_after))
