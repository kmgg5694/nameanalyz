# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

# Find Wo= in summary IIFE (near snBtn)
sn = kw.find("snBtn=(ttl,bdy,col,kids)=>")
# Wo assignment before return in that IIFE
i = kw.find("Wo=", sn)
print("Wo at", i)
print(kw[i:i+1200])

print("\n==== 1193 text ====")
j = kw.find("Home.tsx:1193")
print(repr(kw[j:j+500]))

# Also find patch_sum_verdict or related
print("\n==== red gwe note ====")
k = kw.find("주역괘의")
print(repr(kw[k-80:k+200]) if k>0 else "no")
