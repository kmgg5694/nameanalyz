# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
t = open(r"assets/index-kw5.js", encoding="utf-8").read()
i = t.find('"data-loc":"client/src/pages/Home.tsx:1193"')
print("1193", i)
# walk back to start of IIFE containing verdict
j = t.rfind("(()=>{", 0, i)
print("iife start", j)
print(t[j:j+3500])
print("\n...\n")
# find end - look for return ps.join
k = t.find("return ps.join", j)
print(t[k:k+400])
