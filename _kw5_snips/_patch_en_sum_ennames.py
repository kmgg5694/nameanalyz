# -*- coding: utf-8 -*-
"""Patch English summary IIFE: English suri/gwe names + new verdict texts."""
from pathlib import Path

path = Path("assets/index-eTNXNndF.js")
t = path.read_text(encoding="utf-8")

old_suri = 'const suriCell=(item,ii)=>{const Y=item.data,N=item.suri,I=suriBad(Y),nm=strip(Y&&Y.name);'
new_suri = 'const suriCell=(item,ii)=>{const Y=item.data,N=item.suri,I=suriBad(Y),nm=strip(S?Y&&Y.name:(C(N)&&C(N).nameEn||Y&&Y.name));'

old_gwe = 'const gweCell=(K,ii)=>{if(!K)return E.jsx("td",{style:td,children:"-"},ii);const nm=strip(K.name);'
new_gwe = 'const gweCell=(K,ii)=>{if(!K)return E.jsx("td",{style:td,children:"-"},ii);const nm=strip(H(K.name,K.id)||K.name);'

old_lists = (
    'const listSuriBad=arr=>arr.map((item,ii)=>item.data&&suriBad(item.data)?periods[ii]+" 「"+strip(item.data.name)+"」("+sAge[ii]+")":null).filter(Boolean);'
    'const listGweBad=arr=>arr.map((K,ii)=>K&&K.isTaboo?periods[ii]+" 「"+strip(K.name)+"」("+gAge[ii]+")":null).filter(Boolean);'
    'const listGweBlue=arr=>arr.map((K,ii)=>K&&K.isBest?periods[ii]+" 「"+strip(K.name)+"」("+gAge[ii]+")":null).filter(Boolean);'
)
new_lists = (
    'const listSuriBad=arr=>arr.map((item,ii)=>item.data&&suriBad(item.data)?periods[ii]+" 「"+strip(S?item.data.name:(C(item.suri)&&C(item.suri).nameEn||item.data.name))+"」("+sAge[ii]+")":null).filter(Boolean);'
    'const listGweBad=arr=>arr.map((K,ii)=>K&&K.isTaboo?periods[ii]+" 「"+strip(H(K.name,K.id)||K.name)+"」("+gAge[ii]+")":null).filter(Boolean);'
    'const listGweBlue=arr=>arr.map((K,ii)=>K&&K.isBest?periods[ii]+" 「"+strip(H(K.name,K.id)||K.name)+"」("+gAge[ii]+")":null).filter(Boolean);'
)

checks = [
    (old_suri, new_suri, "suriCell"),
    (old_gwe, new_gwe, "gweCell"),
    (old_lists, new_lists, "lists"),
]
for old, new, label in checks:
    c = t.count(old)
    print(label, "count", c)
    if c != 1:
        raise SystemExit(f"expected 1 for {label}, got {c}")
    t = t.replace(old, new, 1)

# Find verdict AFTER other replacements so indices stay valid
marker = 'let verdict="";if(!hasB)'
vi = t.find(marker)
if vi < 0:
    raise SystemExit("verdict marker not found")
vend = t.find('return E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:sumTable"', vi)
if vend < 0:
    raise SystemExit("sumTable return not found")
print("verdict span", vi, vend, "len", vend - vi)

new_verdict = (
    'let verdict="";'
    'if(!hasB)verdict=S?"결론: 생년월일이 없어 이름만으로 풀이했습니다.":"Conclusion: no birth date — this reading is from the name only.";'
    'else if(nBad<bBad||nBad===bBad&&nBlue>bBlue)verdict=S?"결론 :이름이 탄생일 보다 좋으니 좋은 이름을 가졌습니다.":"Conclusion: the name is better than the birth date — you have a good name.";'
    'else if(nBad>bBad||nBad===bBad&&nBlue<bBlue)verdict=S?"이름기운이 사주를 도와주질 못하고 오히려 방해가 됩니다.":"The name\'s energy does not support the birth chart and instead hinders it.";'
    'else verdict=S?"결론: 이름과 사주의 흉·재물 무게가 비슷합니다.":"Conclusion: the name and birth chart are of similar weight.";'
)

t = t[:vi] + new_verdict + t[vend:]
path.write_text(t, encoding="utf-8")
print("patched ok")

t2 = path.read_text(encoding="utf-8")
assert "탄생일 보다 좋으니" in t2
assert "방해가 됩니다" in t2
assert "C(N)&&C(N).nameEn" in t2
assert t2.count("let verdict=") == 1
# ensure no leftover corruption markers
assert "no blue wealth let verdict" not in t2
assert "ous periods more closely" not in t2
print("verify ok")
