# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
r = subprocess.run(["node", "--check", r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"], capture_output=True)
print("syntax", r.returncode)
i = kw.find("Home.tsx:1044")
print(kw[i-100:i+220])
print("---")
i = kw.find("Home.tsx:1063")
print(kw[i-100:i+220])
