# -*- coding: utf-8 -*-
from pathlib import Path

en = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\_spec_status4.txt")
parts = []

# English sg conditions
for pat in ['up==="sg"', "up==='sg'", "I&&E.jsxs", "fe&&E.jsxs", "dn==="]:
    parts.append("%s -> %s" % (pat, en.count(pat)))

i = en.find('up==="ss"&&E.jsxs')
parts.append("\n=== EN relation cards (from up ss, 3500) ===")
parts.append(en[i : i + 3500] if i >= 0 else "NONE")

# share rk english
parts.append("\n=== EN rk share ===")
j = en.find('g.set("rk"')
parts.append("count g.set rk %s idx %s" % (en.count('g.set("rk"'), j))
if j >= 0:
    parts.append(en[j - 120 : j + 80])

# korean share native vs other
parts.append("\n=== KW5 g.set rk count %s ===" % kw.count('g.set("rk"'))
k = 0
idx = 0
while True:
    n = kw.find('g.set("rk"', idx)
    if n < 0:
        break
    k += 1
    parts.append("rk#%s at %s: %s" % (k, n, kw[n - 80 : n + 60]))
    idx = n + 1

# intro exact
t = "오행은 주변 사람들과 어떤 인간관계를 맺는지를 나타냅니다."
parts.append("\n=== intro idx %s ===" % kw.find(t))
parts.append(kw[kw.find(t) : kw.find(t) + 280])

# down dual exact
d = 'ohangDnDual'
parts.append("\n=== down dual ===")
parts.append(kw[kw.find(d) - 120 : kw.find(d) + 420])

out.write_text("\n".join(parts), encoding="utf-8")
print("ok", out.stat().st_size)
