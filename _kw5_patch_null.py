# Patch index-kw5.js only.
# Replace B6 count-UI subtrees with `null` (keeps surrounding ]}), then delete Td/Nd/A6/R6.
from pathlib import Path

src = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
t = src.read_text(encoding="utf-8")
orig = len(t)

def walk_paren(s, open_idx):
    """open_idx points at '(' . Return index after matching ')'."""
    depth = 0
    in_str = None
    esc = False
    for k, ch in enumerate(s[open_idx:], open_idx):
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
                return k + 1
    raise SystemExit("unbalanced paren")

def walk_obj(s, brace_idx):
    depth = 0
    in_str = None
    esc = False
    for k, ch in enumerate(s[brace_idx:], brace_idx):
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
    raise SystemExit("unbalanced brace")

def replace_jsxs(s, marker):
    i = s.find(marker)
    if i < 0:
        raise SystemExit("missing " + marker)
    # back up to m.jsxs or m.jsx
    start = s.rfind("m.jsxs(", max(0, i - 20), i + 1)
    if start < 0:
        start = s.rfind("m.jsx(", max(0, i - 20), i + 1)
    if start < 0:
        raise SystemExit("no m.jsx before " + marker)
    p = s.find("(", start)
    end = walk_paren(s, p)
    chunk = s[start:end]
    return s[:start] + "null" + s[end:], len(chunk)

# 1) 803 dominant-characteristics card (uses Td)
t, n = replace_jsxs(t, '{"data-loc":"client/src/pages/EnglishName.tsx:803"')
print("null 803", n)

# 2) count>=3 / missing IIFE
iife = t.find('(()=>{const q=["木","火","土","金","水"],oo=q.filter(z=>f.ohangCounts[z]>=3)')
if iife < 0:
    raise SystemExit("missing count IIFE")
# starts at '(' of (()=>{
end = walk_paren(t, iife)
# IIFE is (()=>{...})()  — walk_paren on first '(' gives ()=>{...}  then we need ()
# iife points at '(' of '(()=>{'
# walk_paren(iife) matches the wrapping ( of ( ()=>{...} )  then leftover ()
rest = t[end:end+2]
if rest != "()":
    # maybe the IIFE is (()=>{...})() and first paren is the grouping paren
    print("after grouping paren:", repr(t[end:end+10]))
# Standard: (()=>{...})()
# Position iife = '(' 
# walk_paren -> after ')' of grouping: now at '()'
if t[end:end+2] == "()":
    end = end + 2
chunk = t[iife:end]
assert "Td[" in chunk and "A6[" in chunk, chunk[:200]
t = t[:iife] + "null" + t[end:]
print("null IIFE", len(chunk))

# 3) print-card strongest line
t, n = replace_jsxs(t, '{"data-loc":"client/src/pages/EnglishName.tsx:1038"')
print("null 1038", n)

# 4) delete Td/Nd/A6/R6 if unused
for needle in ("Td[", "Nd[", "A6[", "R6["):
    if needle in t:
        raise SystemExit("still has " + needle)

td = t.find(",Td={")
nd = t.find(",Nd={")
a6 = t.find(",A6={")
r6 = t.find(",R6={")
if min(td, nd, a6, r6) < 0:
    raise SystemExit(f"tables missing {td,nd,a6,r6}")
r6_end = walk_obj(t, t.find("{", r6))
tables = t[td:r6_end]
assert "기운이 강합니다" in tables
assert t[r6_end:r6_end+15].startswith(";function yg")
t = t[:td] + t[r6_end:]
print("deleted tables", len(tables))

assert t.count("기운이 강합니다") == 0
assert t.count("Td={") == 0
assert "Home.tsx:ohangExt" in t
assert "양부모·관청" in t
assert "function B6(" in t
assert "function j6(" in t

src.write_text(t, encoding="utf-8")
print("wrote", orig, "->", len(t), "delta", len(t) - orig)
