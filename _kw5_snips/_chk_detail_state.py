# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
print("detail after meaning", kw.find('meaning:"착할 개",detail:'))
print("meaning readings 价", "meaning:\"착할 개\",readings:" in kw)
i = kw.find('이 목록만 스크롤하세요')
print("picker", i)
print(kw[i:i+900] if i>=0 else "NO")
print("ao.meaning count", kw.count("ao.meaning"))
print("false detail", kw.find(",detail:"))
