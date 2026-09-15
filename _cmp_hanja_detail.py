# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
bak = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\_kw5_before_hanja_cut.js")
b = bak.read_text(encoding="utf-8")
print("bak 한문이름의", b.count("한문이름의"), b.find("한문이름의"))
print("bak 한글이름의", b.count("한글이름의"))
# live
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
print("live 한글이름의", kw.count("한글이름의"))
# list all 한글이름의 phrases
idx=0
while True:
    j=kw.find("한글이름의", idx)
    if j<0: break
    print(j, kw[j:j+40])
    idx=j+1

# Find end of hangul detail section - where next major section starts
i = kw.find('children:["한글이름의 총운은 "')
# find next section after last 한글이름
last = kw.rfind("한글이름의")
print("last 한글이름", last, kw[last:last+80])
print("after block start", kw[last:last+2500][:2000])
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\after_hangul_detail.txt").write_text(kw[last:last+5000], encoding="utf-8")
