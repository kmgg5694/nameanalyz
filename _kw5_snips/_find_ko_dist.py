# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
# Home-only region
a, b = t.find("Home.tsx:716"), t.find("Home.tsx:718")
chunk = t[a:b]
print("home result chunk", a, b, "len", len(chunk))
for s in ["전체 오행", "오행 분포", "목화토금수", '["木","火","土","金","水"]', "ohangCounts", "기운이 강합니다", "음령오행", "오행분포"]:
    print(s, chunk.find(s), chunk.count(s))

# 1031 second row of 오행 section
i = t.find("Home.tsx:1031")
print("\n1031", t[i:i+500])
# 1063
i = t.find("Home.tsx:1063")
print("\n1063", t[i:i+400])
