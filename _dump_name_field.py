# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
form_start = kw.find("[birth,setBirth]")
# name onFocus at +16833
j = form_start + 16833
print("=== name field region ===")
print(kw[j-800:j+900])

# Also dump birth table start to name
# find "탄생" or birth table
i = kw.find('className:"birth-ymd"')
# go back to find table wrapper
print("\n=== before first birth-ymd ===")
print(kw[i-600:i+100])
