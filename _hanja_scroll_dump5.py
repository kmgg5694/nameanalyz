from pathlib import Path
kw5 = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# Q( setter near Se
i = kw5.find('Se=N.useCallback((G,mo)=>{G&&b(G),Q(mo),a("hanja")')
(out/"se_full.txt").write_text(kw5[i-2500:i+400], encoding="utf-8")

# find const[ ,Q] for search idx
# search Q=N.useState
j = 0
c = 0
parts = []
while c < 15:
    k = kw5.find("N.useState", j)
    if k < 0 or k > i:
        break
    parts.append(kw5[k-80:k+60])
    c += 1
    j = k + 1
(out/"usestate_near.txt").write_text("\n---\n".join(parts[-12:]), encoding="utf-8")

# x6 component - search "onSearchClick"
k = kw5.find("onSearchClick")
# first occurrence might be the destructure in x6
(out/"x6_destructure.txt").write_text(kw5[max(0,k-600):k+2200], encoding="utf-8")
print("onSearchClick first", k)

# how hanja is selected from table rows
k = kw5.find("onHanjaChange")
print("onHanjaChange count", kw5.count("onHanjaChange"), "first", k)

# click on table row to pick hanja
for n in ["Home.tsx:1610", "Home.tsx:1620", "Home.tsx:1630", "Home.tsx:1605"]:
    print(n, kw5.find(n))
