from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
# find j6 calc order: go, x=, uo, hjShow, L=, eo=, oo=
keys = ["go=t.hanjaChars.map", "x=ro.map", "uo=go", "hjShow=", "L=t.hanjaOhang", "eo=t.hanjaOhang", "oo=uo?", "xo=uo?pd", "q=t.hanjaOhang"]
for k in keys:
    i = t.find(k)
    print(k, i)
    if i >= 0:
        print(t[i:i+min(200,len(t)-i)])
    print()
