# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")
i = kw.find("Math.floor(S/72)")
print("virt", i)
# find nearby render of meaning
(out/"virt_row.txt").write_text(kw[i:i+3500], encoding="utf-8")
# also find first hanja object structure
i2 = kw.find('{char:"')
print("first char", i2)
(out/"first_hanja.txt").write_text(kw[i2:i2+500], encoding="utf-8")
# count meaning vs detail fields
print("meaning:", kw.count("meaning:"))
print("detail:", kw.count("detail:"))
print("gloss:", kw.count("gloss:"))
print("descMean:", kw.count("descMean"))
# Ln= array start
print("Ln=", kw.find("const Ln="), kw.find("Ln=["))
