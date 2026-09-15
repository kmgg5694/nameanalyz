# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path("assets/index-kw5.js").read_text(encoding="utf-8")
# Find Tn= near summary / 978
i = kw.find('Home.tsx:978')
# search backward for Tn=
j = kw.rfind("Tn=", 0, i)
print("Tn at", j)
print(kw[j:j+250])
# also dump full 978 block end
k = kw.find('Home.tsx:1074', i)
print("\n978 block end", k)
Path("_ohang978_full.txt").write_text(kw[i:k+400], encoding="utf-8")
print("wrote", k-i)
