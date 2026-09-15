# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

i = t.find("이름풀이 종합표")
(out / "jonghap_table.txt").write_text(t[i:i+8000], encoding="utf-8")
print("jonghap wrote", i)

i2 = t.find("한글오행")
(out / "hangul_ohang_sum.txt").write_text(t[i2-300:i2+2000], encoding="utf-8")
print("hangul ohang", i2)

# ohang bar 978
i3 = t.find('Home.tsx:978"')
(out / "ohang_bar_978.txt").write_text(t[i3:i3+2500], encoding="utf-8")

# 1044
i4 = t.find('Home.tsx:1044"')
(out / "ohang_1044.txt").write_text(t[i4-100:i4+800], encoding="utf-8")
print("1044", i4)
