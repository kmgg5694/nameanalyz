# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

# Find 요약보기 section
for s in ["요약보기", "한글수리", "한글주역", "한문수리", "한문주역", "Home.tsx:1136", "snBtn", "setTip"]:
    print(s, kw.find(s), kw.count(s) if s in ("한글수리", "한문수리", "snBtn") else "")

a = kw.find("요약보기")
# find the summary IIFE / table
i = kw.find("Home.tsx:1136")
print("\n1136", repr(kw[i:i+500]) if i>=0 else None)

# search for summary table labels
for lab in ["한글수리", "한문수리", "한글주역", "한문주역"]:
    j = kw.find(f'children:"{lab}"')
    print(lab, j, repr(kw[j-80:j+200]) if j>=0 else None)
