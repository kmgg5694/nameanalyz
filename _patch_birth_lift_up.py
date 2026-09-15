# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
html_p = Path(r"C:\Users\a8071\Projects\nameanalyz\index.html")
kw = p.read_text(encoding="utf-8")
html = html_p.read_text(encoding="utf-8")

old_lift = (
    'function liftKoField(mo){const lift=()=>{const No=mo.getBoundingClientRect(),an=No.top-100;an>1&&window.scrollBy(0,an)};lift();let co=0;'
    'const wo=()=>{if(document.activeElement!==mo)return;lift();const _o=window.visualViewport,No=mo.getBoundingClientRect(),'
    'Mo=_o?_o.height:window.innerHeight,Ro=_o?_o.offsetTop:0,Tn="ontouchstart"in window?56:24,'
    'an=Math.max(0,No.bottom+Tn-Mo,No.bottom+Tn-(Ro+Mo));an>1&&window.scrollBy(0,an)};'
)
new_lift = (
    'function liftKoField(mo){const box=mo.closest&&(mo.closest(".birth-box")||mo.closest("table"))||mo;'
    'const lift=()=>{const No=box.getBoundingClientRect(),an=No.top-130;Math.abs(an)>1&&window.scrollBy(0,an)};lift();let co=0;'
    'const wo=()=>{if(document.activeElement!==mo)return;lift();const _o=window.visualViewport,No=mo.getBoundingClientRect(),'
    'Mo=_o?_o.height:window.innerHeight,Ro=_o?_o.offsetTop:0,Tn="ontouchstart"in window?160:48,'
    'an=Math.max(0,No.bottom+Tn-Mo,No.bottom+Tn-(Ro+Mo));an>1&&window.scrollBy(0,an)};'
)
if old_lift not in kw:
    raise SystemExit("lift miss")
kw = kw.replace(old_lift, new_lift, 1)

# lunar returns {...B,lunar}}}, solar {...B,solar}}}
old1 = ':{...B,lunar}})},className:"birth-ymd",style:'
new1 = ':{...B,lunar}})},onFocus:G=>liftKoField(G.target),className:"birth-ymd",style:'
old2 = ':{...B,solar}})},className:"birth-ymd",style:'
new2 = ':{...B,solar}})},onFocus:G=>liftKoField(G.target),className:"birth-ymd",style:'
print("lunar", kw.count(old1), "solar", kw.count(old2))
if kw.count(old1) != 3 or kw.count(old2) != 3:
    raise SystemExit("field count")
kw = kw.replace(old1, new1).replace(old2, new2)

old_box = '{"data-loc":"client/src/pages/Home.tsx:birthBox",style:{marginBottom:"6px"}'
new_box = '{"data-loc":"client/src/pages/Home.tsx:birthBox",className:"birth-box",style:{marginBottom:"6px"}'
if old_box not in kw:
    raise SystemExit("birthBox miss")
kw = kw.replace(old_box, new_box, 1)

p.write_text(kw, encoding="utf-8")

old_css = ".birth-ymd{scroll-margin-top:120px;scroll-margin-bottom:260px;}"
new_css = ".birth-ymd,.birth-box{scroll-margin-top:160px;scroll-margin-bottom:340px;}"
if old_css not in html:
    raise SystemExit("css miss: " + repr(html[html.find("birth"):html.find("birth")+100]))
html_p.write_text(html.replace(old_css, new_css, 1), encoding="utf-8")

r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
print("focus lifts", kw.count("onFocus:G=>liftKoField(G.target)"))
print("Tn160", "160:48" in kw, "birth-box", 'className:"birth-box"' in kw)
