# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
j = kw.find('className:"birth-ymd"')
print(repr(kw[j-60:j+80]))
print("count", kw.count('className:"birth-ymd"'))
# lift function still old?
i = kw.find("function liftKoField")
print(kw[i:i+200])
