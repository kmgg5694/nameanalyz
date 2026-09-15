import re
path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
with open(path, "r", encoding="utf-8") as f:
    s = f.read()

locs = ["623", "626", "632", "633", "641"]
for loc in locs:
    pat = f"Home.tsx:{loc}"
    i = s.find(pat)
    print(f"=== {pat} ===")
    print(s[i:i+350])
    print()
