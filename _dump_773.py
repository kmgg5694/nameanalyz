# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
j = kw.find('data-loc":"client/src/pages/Home.tsx:773"')
print(kw[j-200:j+900])

# also check if birthSuri section is gated and maybe missing from view because condition fails
j = kw.find("탄생일은 음력기준")
# find the condition wrapping it
print("\n=== gate before birth note ===")
print(kw[j-400:j])
