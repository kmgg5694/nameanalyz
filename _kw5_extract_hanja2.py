import os
import re

path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
out_dir = r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips"

with open(path, "r", encoding="utf-8") as f:
    data = f.read()

# Fix x6_start from x6=ko.memo
x6 = data.find("x6=ko.memo(function({")
loc150 = data.find('data-loc":"client/src/pages/Home.tsx:150')
end = data.find("});", loc150) + 3
print("x6 at", x6, "end at", end)
with open(os.path.join(out_dir, "x6_start.txt"), "w", encoding="utf-8") as f:
    f.write(data[max(0, x6 - 200) : end])

# j6 state including v,Q
j6 = data.find("function j6(){")
print("j6 at", j6)
j6_chunk = data[j6 : j6 + 120000]
m = re.search(
    r"function j6\(\)\{const\[e,a\]=N\.useState\(\"input\"\).*?(?=,go=t\.hanjaChars)",
    j6_chunk,
    re.DOTALL,
)
with open(os.path.join(out_dir, "q_state.txt"), "w", encoding="utf-8") as f:
    f.write("/* j6 state declarations (partial) */\n")
    if m:
        block = m.group(0)
        f.write(block[:8000])
        for pat in ["[v,Q]", "[c,b]", "w=N.useRef", "Se=N.useCallback"]:
            idx = block.find(pat)
            f.write(f"\n\n/* {pat} at offset {idx} */\n")
            if idx >= 0:
                f.write(block[max(0, idx - 200) : idx + 300])
    else:
        f.write("NOT FOUND\n")

# Ln + Vn filter
ln_patterns = ["Ln=[{", "const Ln=[", ",Ln=[{"]
ln_idx = -1
for pat in ln_patterns:
    i = data.find(pat)
    if i >= 0:
        ln_idx = i
        ln_pat = pat
        break
print("Ln at", ln_idx, ln_pat if ln_idx >= 0 else "")

vn_idx = data.find("Vn=(()=>{")
print("Vn at", vn_idx)

with open(os.path.join(out_dir, "ln_filter_logic.txt"), "w", encoding="utf-8") as f:
    if ln_idx >= 0:
        f.write(f"/* Ln module definition ({ln_pat}) at {ln_idx} */\n")
        f.write(data[ln_idx : ln_idx + 600])
    f.write("\n\n/* Vn filter IIFE */\n")
    f.write(data[vn_idx : vn_idx + 2200])
    xf = data.find("i?Ln.find(ao=>ao.char===i)")
    f.write("\n\n/* x6 Ln.find usage */\n")
    f.write(data[xf - 150 : xf + 250])

# vn_filter row onClick append
row = data.find("onClick:()=>{v!==null?")
print("row onClick at", row)
with open(os.path.join(out_dir, "vn_filter.txt"), "a", encoding="utf-8") as f:
    f.write("\n\n/* === row_onClick complete === */\n")
    f.write(data[row - 800 : row + 1500])

# Print key symbols near j6
for sym in ["[c,b]=", "[v,Q]=", "w=N.useRef", "Se=N.useCallback", "onSearchClick:Se"]:
    idx = data.find(sym, j6, j6 + 80000) if j6 >= 0 else -1
    print(f"  {sym} -> {idx}")

print("done")
