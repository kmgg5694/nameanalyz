# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
t = open(r"assets/index-kw5.js", encoding="utf-8").read()

# find verdict / 총평 IIFE and tip area after summary
for needle in [
    "Home.tsx:1193",
    "사주에 비해",
    "아주 나쁜 이름",
    "좋은 이름을 가졌",
    "자세한 이름풀이",
    "setTip",
    "sumVerdict",
    "verdict",
]:
    print(needle, t.find(needle), "count", t.count(needle))

# dump around 사주에 비해
i = t.find("사주에 비해")
print("\n=== around 사주에 비해 ===")
print(t[max(0,i-400):i+800])
