# -*- coding: utf-8 -*-
"""제미나이 오행자료표 관련 실험분 제거 → 하늘(기존 staffUp/Dn) 오행 기준으로 복귀."""
import sys
import subprocess
import re
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

# 1) Remove sangbi/dir/trip card block inserted before ohangFemale
female = (
    'if(t.gender==="female"&&!isCeo&&(upHg==="sanggeuk"||q&&upHj==="sanggeuk")&&!(upHg==="sanggeuk"&&upHj==="sanggeuk"))'
    'mk("ohangFemale","배우자운","결혼 적령기 여성의 경우 위쪽 오행이 상극이면 배우자운이 막혀 결혼이 잘 되지 않는 원인이 될 수 있습니다.",-1);'
)

# Find block starting with if(!isCeo){const gBad= ... ending right before female
marker = 'if(!isCeo){const gBad=g=>!!(g&&g.isTaboo),gGood=g=>!!(g&&g.isBest);'
if marker in kw and female in kw:
    a = kw.find(marker)
    b = kw.find(female, a)
    if a >= 0 and b > a:
        removed = kw[a:b]
        print("removing cards len", len(removed), "has DirYoung", "ohangDirYoung" in removed)
        kw = kw[:a] + kw[b:]
    else:
        print("card block bounds miss", a, b)
elif "ohangBiUpOk" in kw:
    print("ohangBi present but marker mismatch")
else:
    print("no sangbi/dir cards")

# 2) Revert verdict biBad upBlk to simple sanggeuk check (하늘 기준)
# Also strip 연하/연상 directional pushes if present
old_up = None
# find upBlk=(()=>{const gBad
i = kw.find('upBlk=(()=>{const gBad=')
if i >= 0:
    # find ,dnOpen= after this IIFE
    j = kw.find(',dnOpen=', i)
    if j > i:
        # may have upHit,dnHit after dnOpen
        # pattern: upBlk=(()=>{...})(),dnOpen=...,upHit=...,dnHit=...,ps=[];
        # or upBlk=(()=>{...})(),dnOpen=...,ps=[];
        end = kw.find(',ps=[];', i)
        if end > i:
            old_seg = kw[i:end]
            print("verdict seg", old_seg[:120], "...", old_seg[-80:])
            kw = kw[:i] + 'upBlk=W==="sanggeuk"||L==="sanggeuk",dnOpen=_==="sangsaeng"||eo==="sangsaeng"' + kw[end:]
            print("reverted upBlk")
else:
    print("no biBad upBlk")

# Remove directional verdict lines if any
for line in [
    'if(upHit==="top_takes"&&dnHit==="me_gives_down")ps.push("위에서 나를 치고 아래는 내가 생해주는 형국이라, 연하와 결혼·사업을 해야 궁합이 맞아 들어갑니다.");',
    'else if(upHit==="me_fights_up"&&dnHit==="down_drains")ps.push("내가 위를 치고 아래쪽은 생을 받는 형국이라, 연상·윗사람과 궁합이 맞고 아래에게서 도움을 받습니다.");',
]:
    if line in kw:
        kw = kw.replace(line, "", 1)
        print("removed dir verdict line")

# 3) Ensure no 金 hardcode
if 'e===a&&e==="金"?"sanggeuk"' in kw:
    kw = kw.replace(
        'function dk(e,a){return!e||!a?"bihwa":e===a&&e==="金"?"sanggeuk":Nr[e]===a?"sangsaeng":_r[e]===a?"sanggeuk":Nr[a]===e?"sangsaeng":_r[a]===e?"sanggeuk":"bihwa"}',
        'function dk(e,a){return!e||!a?"bihwa":Nr[e]===a?"sangsaeng":_r[e]===a?"sanggeuk":Nr[a]===e?"sangsaeng":_r[a]===e?"sanggeuk":"bihwa"}',
        1,
    )
    print("cleared dk 金 hardcode")

# 4) Delete junk scripts that tried to bake Gemini/experimental ohang
junk = [
    "_patch_ohang_dir_sangbi.py",
    "_patch_geumgeum_sanggeuk.py",
    "_patch_geumgeum_sangbi.py",
    "_chk_ohang_dir.py",
    "_dump_ohang_dir2.py",
    "_chk_sangbi_scope.py",
    "_chk_kim_ohang.py",
    "_chk_kim_ohang2.py",
    "_chk_u6.py",
]
root = Path(r"C:\Users\a8071\Projects\nameanalyz")
for name in junk:
    f = root / name
    if f.exists():
        f.unlink()
        print("deleted", name)

p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-500:])
else:
    for s in ["ohangBiUpOk", "ohangDirYoung", "biBad", "연하와 결혼", "staffUp", "설령 결혼을", "본기운 55세"]:
        print(s, s in kw)
