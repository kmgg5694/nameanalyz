# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
i = kw.find('{char:"价"')
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\jia_after.txt").write_text(kw[i:i+280], encoding="utf-8")
p = kw.find('이 목록만 스크롤하세요')
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\picker_after.txt").write_text(kw[p:p+1600], encoding="utf-8")
print("ok", kw.count("ao.detail"), kw.count('meaning:"착할 개",detail:'))
