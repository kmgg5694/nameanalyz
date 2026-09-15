# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
checks = [
    'e===a&&e==="金"?"sanggeuk"',
    "ohangBiUpOk",
    "ohangDirYoung",
    "ohangDirElder",
    "상비로 해설",
    "연하와 결혼",
    "본기운 55세",
    "말년으로 이어지는",
    "사주(탄생일)",
    "biBad",
    "목목목",
    "오행해설",
]
for s in checks:
    print(f"{s}: {t.count(s)}")
# dk head
i = t.find("function dk(")
print("dk:", t[i:i+200])
