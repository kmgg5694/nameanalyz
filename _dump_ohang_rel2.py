# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

# Find W,_ assignment for hangul up/down relations
i = kw.find(',W=')
# better search near oo=
j = kw.find("uo?[W,_,L,eo]:[W,_]")
print("oo area", j)
print(kw[j-800:j+200])

print("\n==== Tn full ====")
t = kw.find('Tn=ho=>ho==="sangsaeng"')
print(repr(kw[t:t+120]))

# Find pair relation function - often named like getRel(a,b)
for needle in ["목생화", "sangbi", "\"sangbi\"", "상비", "生", "ohRel", "relOhang", "pairRel"]:
    print(needle, kw.find(needle))
