# -*- coding: utf-8 -*-
from pathlib import Path
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")
bak = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\_kw5_before_hanja_cut.js")
if not bak.exists():
    bak.write_text(kw, encoding="utf-8")
    print("backup ok")

a = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:1150"')
b = kw.find('m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1172"', a)
print("a,b", a, b)
print("BEFORE a", kw[a-60:a])
print("REGION", kw[a:b])

# delete 한문 rows: from the comma before 1150 through the 한문주역 tr close, keep tbody/table/overflow close
# BEFORE a should end with 주역 ]}),
print("a-8", repr(kw[a-8:a]))
assert kw[a-1] == ','
# find 한문주역 tr close: after 1162 map
# region = two trs + tbody/table/overflow close
region = kw[a:b]
# region should start with m.jsxs 1150 and end with ]})]})}),
print("region end", repr(region[-20:]))
assert region.endswith(']})]})}),')
# two trs: drop until the last tr's close, keep ]})]})}),
# Last tr closes just before ]})]})}),
# The last tr close is ]})  then tbody ]}) table ]}) overflow }),
# So two-trs end at len(region)-len(']})]})}),')
# But the last tr's ]}) is NOT part of tbody close...
# region = tr1 + tr2_including_its_]}) + tbody_table_overflow
# tr2 ends with ]})  which is 3 chars ]})
# Then ]})]})}), remains
# If we remove both trs, we need to also remove the comma before a (the one after 주역)

# Easier: find unique 한문 block without the tbody close.
idx_hanja = kw.find('children:"한문수리"', a)
print("한문수리 in home", idx_hanja)
# take from comma before 1150
comma = a - 1
assert kw[comma] == ','
# end of 한문주역 tr: search children:"한문주역" then find `},Xo))]})`
hj = kw.find('children:"한문주역"', a)
print("한문주역", hj)
end_tr = kw.find('},Xo))]})', hj)
print("end_tr", end_tr, kw[end_tr:end_tr+20])
# `},Xo))]})` includes tr close ]})
end_tr_close = end_tr + len('},Xo))]})')
print("after tr close", repr(kw[end_tr_close:end_tr_close+20]))
assert kw[end_tr_close:end_tr_close+9] == ']})]})}),'

new = kw[:comma] + kw[end_tr_close:]
print("removed", end_tr_close-comma, "chars")
assert new.count('Home.tsx:1150')==0
assert new.count('Home.tsx:1151')==0
assert new[comma-30:comma+80].find('한문수리')<0
print("join", new[comma-50:comma+40])

# strip unused 종합표 snBtn (first def only)
i1 = new.find("snBtn=(ttl,bdy,col,kids)")
i2 = new.find("snBtn=(ttl,bdy,col,kids)", i1+1)
print("defs", i1, i2)
assert i1>=0 and i2>i1
start = i1 - 1
assert new[start] == ','
end = new.find("}),Tn=ho=>", i1)
print("strip 종합표 snBtn", start, end, repr(new[start:start+12]), repr(new[end:end+12] if end>=0 else None))
assert end>start
new2 = new[:start] + new[end+2:]
assert new2.count("snBtn=(ttl,bdy,col,kids)")==1
assert new2.count("snBtn(")==2  # two uses in 요약보기 수리+주역

p.write_text(new2, encoding="utf-8")
print("written", len(new2), "delta", len(kw)-len(new2))
