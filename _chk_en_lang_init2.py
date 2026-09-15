# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
t = open(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js", encoding="utf-8").read()
i = t.find('useState("en")')
print("i", i)
print(repr(t[i - 150 : i + 200]))
