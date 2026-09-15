# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
needle = '(()=>{const ho=vo=>vo==="taboo"'
a = kw.find("snBtn=(ttl,bdy,col,kids)=>")
a = kw.rfind(needle, 0, a)
b = kw.find('Home.tsx:1172"', a) + len('Home.tsx:1172"')
block = kw[a:b]
Path(r"C:\Users\a8071\Projects\nameanalyz\_sum_chk.txt").write_text(block, encoding="utf-8")
print("wrote", len(block))
print("탄생수리", block.count("탄생수리"), "탄생주역", block.count("탄생주역"))
print("slice", block.count("slice(0,2)"), "FF", block.count("#FF0000"), "blue", block.count("#0000FF"))
# show end of tbody area
i = block.find("탄생수리")
print(block[i-60:i+200] if i>=0 else "no birth")
