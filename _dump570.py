# -*- coding: utf-8 -*-
from pathlib import Path
t = Path("assets/index-kw5.js").read_text(encoding="utf-8")
i = t.find("Home.tsx:570")
print("570", i)
Path("_ko_570.txt").write_text(t[i - 20 : i + 250], encoding="utf-8")
print(repr(t[i - 20 : i + 220]))
