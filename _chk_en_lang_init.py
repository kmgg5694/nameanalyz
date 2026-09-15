# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
t = open(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js", encoding="utf-8").read()
i = t.find('[R,D]=j.useState')
print("R", i)
print(repr(t[i : i + 150]))
# search lang from URL
for s in ['get("lang")', "get('lang')", 'lang===', 'R==="ko"', 'useState("en")', 'useState("ko")']:
    print(s, t.find(s))
