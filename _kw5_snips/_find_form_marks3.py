# -*- coding: utf-8 -*-
from pathlib import Path
t = Path("assets/index-kw5.js").read_text(encoding="utf-8")
for s in ["성별", "현재 직위", "일반직", "사장·회장급", "👨 남성", "Home.tsx:rank", "gender"]:
    print(repr(s), t.count(s), t.find(s))

# extract from end of ohang to start button
i = t.find('Home.tsx:676')
j = t.find('Home.tsx:703')
print("\n=== 676 to 703 ===")
print(t[i-100:j+350])
