# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
t = Path("assets/index-kw5.js").read_text(encoding="utf-8")
for s in ["easyTip", "Home.tsx:602", "Home.tsx:676", "Home.tsx:703", "Home.tsx:581b"]:
    print(f"{t.find(s):8d}  {s}")
print("btn after hanja:", t.find("Home.tsx:703") > t.find("Home.tsx:676"))
# also check HEAD (committed) order
import subprocess
head = subprocess.check_output(["git", "show", "HEAD:assets/index-kw5.js"], cwd=r"C:\Users\a8071\Projects\nameanalyz").decode("utf-8")
print("HEAD btn after hanja:", head.find("Home.tsx:703") > head.find("Home.tsx:676"))
print("HEAD tip before btn:", head.find("easyTip"), head.find("Home.tsx:703"), head.find("Home.tsx:676"))
