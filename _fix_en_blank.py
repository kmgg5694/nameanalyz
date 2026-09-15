# -*- coding: utf-8 -*-
"""Fix broken newline between sumTable IIFE verdict and return (white screen)."""
from pathlib import Path

p = Path(r"assets/index-eTNXNndF.js")
t = p.read_text(encoding="utf-8")

mark = 'return E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:sumTable"'
for nl in ("\r\n", "\n"):
    needle = nl + mark
    if needle in t:
        t = t.replace(needle, mark, 1)
        break
else:
    raise SystemExit("broken newline before sumTable return not found")

p.write_text(t, encoding="utf-8")
print("fixed, lines", t.count("\n") + 1)
