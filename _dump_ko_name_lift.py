# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
# find ko name input
i = kw.find('id:"koNameInput"')
print("koNameInput", i)
print(kw[i:i+900])
