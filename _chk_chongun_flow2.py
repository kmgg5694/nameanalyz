# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# dump from 1307 through end of period sections
i = t.find('data-loc":"client/src/pages/Home.tsx:1307"')
j = t.find('data-loc":"client/src/pages/Home.tsx:978"')  # ohang bar might be before
# find 말년 section and what follows
k = t.find("말년(56")
if k < 0:
    k = t.find("말년(")
print("말년 at", k)
(out / "malnyeon_onward.txt").write_text(t[k:k+6000] if k>=0 else "miss", encoding="utf-8")

# find birth period commentary
for s in ["탄생일의", "사주 초년", "탄생 초년", "bW.data", "birthSuri?.won", "탄생일 풀이"]:
    print(s, t.find(s), t.count(s))

# sample suri desc length
i = t.find('name:"대길"')
print("sample", t[i:i+200] if i>=0 else None)
# Eo function
i = t.find("function Eo(")
print("Eo", t[i:i+200] if i>=0 else "no")

# find where 중년 and 말년 blocks are
for loc in ["1370", "1400", "1420", "1430", "1440", "1450", "1460", "1470", "1480"]:
    s = f'Home.tsx:{loc}"'
    print(loc, t.find(s))
