import os

path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
out_dir = r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips"
os.makedirs(out_dir, exist_ok=True)

with open(path, "r", encoding="utf-8") as f:
    data = f.read()

print("File length:", len(data))


def dump(name, start, end, note=""):
    snippet = data[max(0, start) : min(len(data), end)]
    fp = os.path.join(out_dir, name)
    with open(fp, "w", encoding="utf-8") as out:
        out.write(snippet)
    print(f"{name}: start={start}, end={end}, len={len(snippet)} {note}")


# 1. x6_start.txt
loc88 = data.find('data-loc":"client/src/pages/Home.tsx:88')
loc150 = data.find('data-loc":"client/src/pages/Home.tsx:150')
print(f"Home.tsx:88 at {loc88}, :150 at {loc150}")

search_start = loc88
x6_start = -1
x6_pat = None
for pattern in ["function x6({", "function x6("]:
    idx = data.rfind(pattern, 0, search_start)
    if idx > x6_start:
        x6_start = idx
        x6_pat = pattern
if x6_start == -1:
    idx = data.rfind("function x6", 0, search_start)
    if idx != -1:
        x6_start = idx
        x6_pat = "function x6"

print(f"x6_start={x6_start} pattern={x6_pat}")

next_func = data.find("function ", loc150 + 1) if loc150 != -1 else -1
x6_end = (
    next_func
    if next_func != -1 and next_func > loc150
    else (loc150 + 5000 if loc150 != -1 else x6_start + 15000)
)
if loc150 != -1:
    x6_end = max(x6_end, loc150)

dump_start = max(0, x6_start - 200) if x6_start >= 0 else loc88 - 5000
dump("x6_start.txt", dump_start, x6_end, f"x6 at {x6_start}")

# 2. se_handler.txt
se_exact = (
    'Se=N.useCallback((G,mo)=>{G&&b(G),Q(mo),a("hanja"),'
    "setTimeout(()=>{w.current?.focus();const co=w.current;"
    "if(co){const wo=co.value.length;co.setSelectionRange(wo,wo)}},100)},[])"
)
se_idx = data.find(se_exact)
print(f"Se exact at {se_idx}")
if se_idx == -1:
    se_idx = data.find("Se=N.useCallback((G,mo)=>")
    print(f"Se fuzzy at {se_idx}")
    if se_idx != -1:
        end = data.find("},[])", se_idx) + 4
        se_exact = data[se_idx:end]

dump(
    "se_handler.txt",
    se_idx - 800 if se_idx >= 0 else 0,
    se_idx + len(se_exact) if se_idx >= 0 else 100,
)

# 3. vn_filter.txt
vn_len = data.find("Vn.length")
print(f"Vn.length at {vn_len}")

vn_eq = -1
pos = vn_len
while pos > 0:
    idx = data.rfind("Vn=", max(0, pos - 50000), pos)
    if idx == -1:
        break
    vn_eq = idx
    break

if vn_eq == -1:
    vn_eq = data.rfind("Vn=", 0, vn_len)
print(f"Vn= at {vn_eq}")

loc1596 = data.find('data-loc":"client/src/pages/Home.tsx:1596')
loc1610 = data.find('data-loc":"client/src/pages/Home.tsx:1610')
loc1650 = data.find('data-loc":"client/src/pages/Home.tsx:1650')
print(f"1596={loc1596}, 1610={loc1610}, 1650={loc1650}")

parts = []
if vn_eq >= 0:
    parts.append(("vn_def", vn_eq - 2500, vn_eq + 2500))
if loc1596 >= 0:
    parts.append(("list", loc1596 - 2000, loc1596 + 2000))
for loc in [loc1610, loc1650]:
    if loc >= 0:
        parts.append(("row", loc - 2000, loc + 2000))

vn_content = ""
seen = set()
for name, s, e in parts:
    s = max(0, s)
    e = min(len(data), e)
    key = (s, e)
    if key not in seen:
        seen.add(key)
        vn_content += f"\n/* === {name} [{s}:{e}] === */\n"
        vn_content += data[s:e]

with open(os.path.join(out_dir, "vn_filter.txt"), "w", encoding="utf-8") as f:
    f.write(vn_content)
print(f"vn_filter.txt len={len(vn_content)}")

# 4. q_state.txt
q_state_idx = data.find("Q=N.useState")
se_idx2 = data.find("Se=N.useCallback((G,mo)=>")
print(f"Q=N.useState at {q_state_idx}, Se at {se_idx2}")

q_content = ""
if q_state_idx >= 0:
    q_content += "/* Q=N.useState */\n" + data[q_state_idx - 500 : q_state_idx + 500]
if se_idx2 >= 0:
    q_content += "\n\n/* Near Se handler */\n" + data[max(0, se_idx2 - 3000) : se_idx2 + 500]

with open(os.path.join(out_dir, "q_state.txt"), "w", encoding="utf-8") as f:
    f.write(q_content)

# 5. ln_filter_logic.txt
ln_eq = data.find("Ln=")
print(f"first Ln= at {ln_eq}")

collected = []
for term in ["Ln.filter", "soundOhang", ".name.includes", "Ln="]:
    start = 0
    while True:
        i = data.find(term, start)
        if i == -1:
            break
        collected.append((term, i))
        start = i + 1

collected.sort(key=lambda x: x[1])
merged = []
for term, i in collected:
    s, e = i - 1500, i + 1500
    if merged and s <= merged[-1][2]:
        merged[-1] = (merged[-1][0], merged[-1][1], max(merged[-1][2], e))
    else:
        merged.append((term, s, e))

ln_content = ""
if ln_eq >= 0:
    ln_content += f"/* first Ln= at {ln_eq} */\n" + data[ln_eq : ln_eq + 800] + "\n"
for term, s, e in merged[:10]:
    s = max(0, s)
    e = min(len(data), e)
    ln_content += f"\n/* === {term} [{s}:{e}] === */\n"
    ln_content += data[s:e]

with open(os.path.join(out_dir, "ln_filter_logic.txt"), "w", encoding="utf-8") as f:
    f.write(ln_content)

print("done")
