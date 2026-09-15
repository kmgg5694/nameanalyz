# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# sample object for 价
i = kw.find('char:"价"')
print("价", i)
if i>=0:
    (out/"jia_obj.txt").write_text(kw[i-80:i+400], encoding="utf-8")

# picker list item
for needle in ['이 목록만 스크롤하세요', 'Home.tsx:150"', 'height:"72px"', 'rowHeight']:
    print(needle, kw.find(needle), kw.count(needle) if len(needle)<40 else "")

i = kw.find('이 목록만 스크롤하세요')
(out/"picker_list.txt").write_text(kw[i:i+2500] if i>=0 else "MISS", encoding="utf-8")
