import re
p = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
s = open(p, encoding="utf-8").read()
keywords = [
    "ohangInn", "ohangExt", "ohangUpHj", "ohangDnHj", "selfHj",
    'children:"?"', 'el||"?"', "ze[", "nm={", "hjO[", "t.hanjaOhang",
]
out = []
for kw in keywords:
    count = 0
    for m in re.finditer(re.escape(kw), s):
        i = m.start()
        out.append(f"=== {kw} @ {i} ===\n{s[max(0,i-250):i+500]}\n")
        count += 1
        if count >= 3:
            break
open(r"C:\Users\a8071\Projects\nameanalyz\_dump_ohang2.txt", "w", encoding="utf-8").write("\n".join(out))
print("done", len(out))
