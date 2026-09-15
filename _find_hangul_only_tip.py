# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
t = Path("assets/index-kw5.js").read_text(encoding="utf-8")
for s in ["easyTip", "호적", "한글만", "한문에서", "성씨", "Home.tsx:581", "Home.tsx:602", "예명", "본명"]:
    print(s, t.find(s), "count", t.count(s))

i = t.find('Home.tsx:easyTip')
print("\n=== easyTip ===")
print(t[i:i+800] if i>0 else "miss")

j = t.find("Home.tsx:581b")
print("\n=== 581b ===")
print(t[j:j+700] if j>0 else "miss")
