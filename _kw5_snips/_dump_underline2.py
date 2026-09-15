# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

def w(name, i, n=1500):
    (out/name).write_text(kw[i:i+n], encoding="utf-8")
    print(name, "ok")

# helpers around fmtNm
w("d_helpers.txt", 1912400, 1200)
# tip overlay
w("d_tipmask.txt", 1908200, 900)
# j6
w("d_j6.txt", 1890779, 500)
# 수리뜻 row
w("d_surimean.txt", 1918000, 1600)
# 주역 around 936
w("d_gwe.txt", 1919900, 1600)
# 요약보기 iife
w("d_sum_iife.txt", 1926535, 800)
# 한글수리 Home 요약 - find all
idx = 0
hits = []
while True:
    i = kw.find('children:"한글수리"', idx)
    if i < 0: break
    hits.append(i)
    idx = i+1
print("한글수리 hits", hits)
for n,i in enumerate(hits):
    w(f"d_hangul_suri_{n}.txt", i-200, 1800)

idx=0
hits2=[]
while True:
    i = kw.find("snBtn", idx)
    if i<0: break
    hits2.append(i)
    idx=i+1
print("snBtn hits", hits2)
for n,i in enumerate(hits2[:8]):
    w(f"d_snbtn_{n}.txt", max(0,i-80), 400)

# 8수 desc
w("d_suri8.txt", 1848800, 500)

# find second fmtNm
i1 = kw.find("fmtNm=")
i2 = kw.find("fmtNm=", i1+1)
print("fmtNm", i1, i2)
if i2>=0:
    w("d_fmtNm2.txt", i2-80, 600)
