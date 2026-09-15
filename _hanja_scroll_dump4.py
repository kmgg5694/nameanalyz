from pathlib import Path
kw5 = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

j = kw5.find('a("hanja")')
# dump all 3
start = 0
parts = []
for n in range(3):
    k = kw5.find('a("hanja")', start)
    parts.append(f"\n===== a(hanja) #{n+1} @{k} =====\n" + kw5[max(0,k-500):k+400])
    start = k + 1
(out/"ahanja_all.txt").write_text("\n".join(parts), encoding="utf-8")

# x6 definition
for n in ["function x6", "const x6=", "x6=e=>", "x6=({"]:
    print(n, kw5.find(n), kw5.count(n))

j = kw5.find("function x6")
print("function x6", j)
j = kw5.find("x6=({")
print("x6=({", j)

# search x6= 
j = 0
c = 0
while c < 6:
    k = kw5.find("x6", j)
    if k < 0:
        break
    ctx = kw5[max(0,k-20):k+40]
    if "function" in ctx or "=" in ctx[:25] or "const" in ctx:
        print("x6 ctx", k, ctx.replace("\n"," "))
        c += 1
    j = k + 1
    if k > 1900000:
        break

# Home.tsx:508 inline list
i = kw5.find("Home.tsx:508")
(out/"home508.txt").write_text(kw5[max(0,i-2500):i+2000] if i>=0 else "NONE", encoding="utf-8")

# Se= after j6
j6 = kw5.find("function j6(")
chunk = kw5[j6:j6+25000]
# find Se
idx = chunk.find("Se=")
print("Se= in j6+", idx)
if idx >= 0:
    (out/"se_in_j6.txt").write_text(chunk[max(0,idx-200):idx+800], encoding="utf-8")
# also SearchClick
idx = chunk.find("Search")
print("Search in first 25k", idx)
