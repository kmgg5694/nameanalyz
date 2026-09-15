# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

# Current lift uses Math.abs which pulls card back down when top < 130
old = (
    'function liftKoField(mo){const box=mo.closest&&(mo.closest(".birth-box")||mo.closest("table"))||mo;'
    'const lift=()=>{const No=box.getBoundingClientRect(),an=No.top-130;Math.abs(an)>1&&window.scrollBy(0,an)};lift();let co=0;'
    'const wo=()=>{if(document.activeElement!==mo)return;lift();const _o=window.visualViewport,No=mo.getBoundingClientRect(),'
    'Mo=_o?_o.height:window.innerHeight,Ro=_o?_o.offsetTop:0,Tn="ontouchstart"in window?160:48,'
    'an=Math.max(0,No.bottom+Tn-Mo,No.bottom+Tn-(Ro+Mo));an>1&&window.scrollBy(0,an)};'
)
# Only scroll up when covered; never pull back down. Prefer keeping birth-box in view above keyboard.
new = (
    'function liftKoField(mo){const box=mo.closest&&(mo.closest(".birth-box")||mo.closest("table"))||mo;'
    'const lift=()=>{const No=box.getBoundingClientRect();if(No.top>140)window.scrollBy(0,No.top-140)};'
    'lift();let co=0;'
    'const wo=()=>{if(document.activeElement!==mo)return;'
    'const _o=window.visualViewport,boxR=box.getBoundingClientRect(),No=mo.getBoundingClientRect(),'
    'Mo=_o?_o.height:window.innerHeight,Ro=_o?_o.offsetTop:0,visBottom=Ro+Mo,pad="ontouchstart"in window?120:40;'
    'if(No.bottom+pad>visBottom)window.scrollBy(0,No.bottom+pad-visBottom);'
    'else if(boxR.top>140)window.scrollBy(0,boxR.top-140)};'
)

if old not in kw:
    i = kw.find("function liftKoField")
    print(repr(kw[i:i+450]))
    raise SystemExit("miss")
kw = kw.replace(old, new, 1)
p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
print("Math.abs gone", "Math.abs(an)" not in kw[kw.find("function liftKoField"):kw.find("function liftKoField")+800])
print(kw[kw.find("function liftKoField"):kw.find("function liftKoField")+520])
