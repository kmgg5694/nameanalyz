# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
t = open(r"assets/index-eTNXNndF.js", encoding="utf-8").read()
marker = '(()=>{const strip=x=>String(x||"").replace'
start = t.find(marker)
print("start", start)
end = t.find("]})})(),", start)
print("end", end)
snip = t[start : end + 8]
open(r"_kw5_snips/en_sum_iife_live.js", "w", encoding="utf-8").write(snip)
print("len", len(snip))
# show suriCell / gweCell / verdict
for key in ["const suriCell=", "const gweCell=", "const listSuriBad=", "let verdict="]:
    i = snip.find(key)
    print("\n===", key, "===")
    print(snip[i : i + 450])
