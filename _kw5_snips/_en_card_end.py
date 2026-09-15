# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
en = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
# after share button
i = en.find("EnglishName.tsx:shareNative")
print("share", i)
print(en[i:i+1800][-800:])
