# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
i = kw.find("Home.tsx:birthRead")
# dump full birthRead until next major sibling after birth table
j = kw.find("]})]})})}),", i)  # might be wrong
# find birthRead end - look for birthJeong or next section after table
chunk = kw[i:i+3500]
Path("_birth_read_full.txt").write_text(chunk, encoding="utf-8")
print(chunk)
