# -*- coding: utf-8 -*-
import subprocess, sys
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
t = Path("assets/index-kw5.js").read_text(encoding="utf-8")
i = t.find("ohangRow")
print("ohang snippet:")
print(t[i:i+350])
print("---")
print("1fr auto 1fr auto 2fr", "1fr auto 1fr auto 2fr" in t)
print("본기운 55세", "본기운 55세" in t)
print("사주에 비해 좋은 이름", "사주에 비해 좋은 이름" in t)
print("gridTemplateColumns", "gridTemplateColumns" in t[i:i+2000] if i>0 else False)
r = subprocess.run(["git","diff","--numstat","HEAD","--","assets/index-kw5.js"], capture_output=True, text=True)
print("numstat", r.stdout)
r2 = subprocess.run(["git","diff","HEAD","--","assets/index-kw5.js"], capture_output=True)
# count changed hunks roughly
d = r2.stdout.decode("utf-8", errors="replace")
print("diff bytes", len(d))
print(d[:1500])
