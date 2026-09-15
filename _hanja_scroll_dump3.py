from pathlib import Path
kw5 = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# onSearchClick:Se
i = kw5.find("onSearchClick:Se")
(out/"onSearchClick.txt").write_text(kw5[max(0,i-200):i+80] if i>=0 else "NONE", encoding="utf-8")

# const Se=
for n in ["const Se=", "Se=(", "function Se(", "Se=G=>", "Se=()"]:
    j = kw5.find(n)
    print(n, j)

# look near j6 for Se assignment - search "a(\"hanja\"" or 'a("hanja"'
for n in ['a("hanja")', "a(\"hanja\")", 'e==="hanja"', ',"hanja"', "focus()", ".focus("]:
    print("count", n, kw5.count(n), "first", kw5.find(n))

# dump around a("hanja")
j = kw5.find('a("hanja")')
if j < 0:
    j = kw5.find("a(\"hanja\")")
(out/"set_hanja.txt").write_text(kw5[max(0,j-400):j+500] if j>=0 else "NONE a hanja", encoding="utf-8")

j = kw5.find(".focus(")
parts = []
start = 0
c = 0
while c < 8:
    k = kw5.find(".focus(", start)
    if k < 0:
        break
    c += 1
    parts.append(f"\n===== focus #{c} @{k} =====\n" + kw5[max(0,k-300):k+200])
    start = k + 1
(out/"focus_hits.txt").write_text("\n".join(parts), encoding="utf-8")

# x6 function definition
j = kw5.find("function x6(")
(out/"x6_fn.txt").write_text(kw5[j:j+2500] if j>=0 else "NONE", encoding="utf-8")
print("x6", j)
