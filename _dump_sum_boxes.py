# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

# Find compact 요약보기 IIFE (with snBtn and 초년)
i = kw.find('children:"초년"')
print("초년", i)
# find 말년
j = kw.find('children:"말년(총운)"')
print("말년(총운)", j)
print(repr(kw[j-80:j+40]) if j>0 else "")

# Find summary table structure - tbody with 한글수리 through 탄생주역
a = kw.find('children:"요약보기"')
# there may be multiple - find the live one near snBtn
sn = kw.find("snBtn=(ttl,bdy,col,kids)=>")
print("snBtn", sn)
# dump from 요약보기 near snBtn
# search backwards from snBtn for 요약보기 title in return
ret = kw.find('return m.jsxs("div"', sn)
print("return", ret)
chunk = kw[ret:ret+5500]
Path("_sum_struct.txt").write_text(chunk, encoding="utf-8")
print("wrote", len(chunk))
# markers
for n in ["한글수리", "한문주역", "탄생수리", "탄생주역", "1172", "ink-card"]:
    print(n, chunk.find(n))
