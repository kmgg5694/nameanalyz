# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
i = kw.find("탄생수리")
print("탄생수리", i)
print(repr(kw[i-100:i+500]))
print("---")
j = kw.find("bdSumGwe")
print(repr(kw[j:j+400]))
