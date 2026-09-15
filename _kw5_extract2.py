from pathlib import Path
import re

t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out_dir = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")
out_dir.mkdir(exist_ok=True)

j6 = t.find("function j6(")
b6 = t.find("function B6(")

# function decls around this region
region = t[j6:b6+80]
funcs = [(m.start()+j6, m.group()) for m in re.finditer(r"function [A-Za-z0-9_$]+\(", t[j6:b6+200])]
(out_dir/"funcs.txt").write_text("\n".join(f"{pos} {name}" for pos,name in funcs[:80]), encoding="utf-8")

# also look for `const Td=` style vs Td={
td = t.find("Td={")
# 400 chars before Td
(out_dir/"td_before.txt").write_text(t[td-500:td+200], encoding="utf-8")

# extract Td object - find matching braces
def extract_obj(start_eq):
    i = t.find("{", start_eq)
    depth = 0
    for k, ch in enumerate(t[i:], i):
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return t[start_eq:k+1]
    return t[start_eq:start_eq+3000]

td_obj = extract_obj(td)
(out_dir/"td_obj.txt").write_text(td_obj[:8000], encoding="utf-8")
(out_dir/"td_obj_len.txt").write_text(str(len(td_obj)), encoding="utf-8")

nd = t.find("Nd={")
a6 = t.find("A6={")
r6 = t.find("R6={")
nd_obj = extract_obj(nd)
a6_obj = extract_obj(a6)
r6_obj = extract_obj(r6)
(out_dir/"nd_obj.txt").write_text(nd_obj[:4000], encoding="utf-8")
(out_dir/"a6_obj.txt").write_text(a6_obj[:4000], encoding="utf-8")
(out_dir/"r6_obj.txt").write_text(r6_obj[:4000], encoding="utf-8")

# after R6 object, next 400 chars
r6_end = r6 + len(r6_obj)
(out_dir/"after_r6.txt").write_text(t[r6_end:r6_end+800], encoding="utf-8")

# Home ohang IIFE
hx = t.find("Home.tsx:ohangExt")
(out_dir/"home_ohang.txt").write_text(t[hx-2000:hx+4500], encoding="utf-8")

# B6 ohangCards around EnglishName.tsx:826
en826 = t.find("EnglishName.tsx:826")
(out_dir/"en826.txt").write_text(t[en826-2500:en826+2200], encoding="utf-8")

en1038 = t.find("EnglishName.tsx:1038")
(out_dir/"en1038.txt").write_text(t[en1038-400:en1038+500], encoding="utf-8")

# Td references: count 'Td[' and 'Td='
(out_dir/"td_refs.txt").write_text(
    f"Td={{ count={t.count('Td={')} Td[ count={t.count('Td[')} ,Td count={t.count(',Td')} \n"
    f"Nd[={t.count('Nd[')} A6[={t.count('A6[')} R6[={t.count('R6[')}\n"
    f"j6={j6} b6={b6} td={td} nd={nd} a6={a6} r6={r6} r6_end={r6_end}\n"
    f"td in j6..B6: {j6 < td < b6}\n"
    f"functions between j6 and B6: {len(funcs)}\n"
    + "\n".join(f"{p} {n}" for p,n in funcs[:40]),
    encoding="utf-8",
)

# 상생 관계 copy in Home
for label, needle in [
    ("sangsaeng_home", "양부모·관청"),
    ("wealth", "재물운 보존력"),
    ("bully", "왕따"),
]:
    i = t.find(needle)
    (out_dir/f"{label}.txt").write_text(t[max(0,i-300):i+800] if i>=0 else "NONE", encoding="utf-8")

print("done", len(funcs), "funcs; td_obj", len(td_obj))
