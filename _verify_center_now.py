# -*- coding: utf-8 -*-
from pathlib import Path
t = Path("assets/index-kw5.js").read_text(encoding="utf-8")
for s in ["justify-center py-2", "minWidth:\"8.5rem\"", "gap-1.5", "padding:\"10px 6px\"", "Home.tsx:980"]:
    print(s, t.find(s))
i = t.find("Home.tsx:980")
print(t[i:i+220])
