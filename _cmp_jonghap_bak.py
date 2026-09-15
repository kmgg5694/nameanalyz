# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
bak = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\_kw5_before_hanja_cut.js").read_text(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

bi = bak.find("이름풀이 종합표")
ki = kw.find("이름풀이 종합표")
# compare length of 종합표 section until 요약보기
be = bak.find("요약보기", bi)
ke = kw.find("요약보기", ki)
print("bak 종합 len", be-bi, "live", ke-ki)
print("bak has |", bak[bi:be].count('children:"|"'), "live", kw[ki:ke].count('children:"|"'))
print("bak hjShow", bak[bi:be].count("hjShow"), "live", kw[ki:ke].count("hjShow"))

# Was there a separate 한문 종합 table below?
for s in ["한문이름풀이", "【한문】", "【한글】", "한문 종합", "한글이름풀이"]:
    print(s, "bak", bak.count(s), "live", kw.count(s))

# Check 1172 area for 한문 총운 completeness live
j = kw.find("Home.tsx:1172")
print(kw[j:j+1200])
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\sum_after_table.txt").write_text(kw[j:j+2500], encoding="utf-8")
