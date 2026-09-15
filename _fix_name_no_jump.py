# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
html_p = Path(r"C:\Users\a8071\Projects\nameanalyz\index.html")
kw = p.read_text(encoding="utf-8")
html = html_p.read_text(encoding="utf-8")

# Find scrollPadding near input form
idx = 0
while True:
    j = kw.find("scrollPadding", idx)
    if j < 0:
        break
    print(repr(kw[j-60:j+100]))
    idx = j + 1

# Also scroll-padding in style strings
idx = 0
while True:
    j = kw.find("scroll-padding", idx)
    if j < 0:
        break
    print("css-pad", repr(kw[j-40:j+80]))
    idx = j + 1

# Patch: on focus of koNameInput, lock scroll position so browser can't jump it up
old = 'id:"koNameInput",value:t.name,onKeyDown:G=>{if(G.key==="Enter"&&t.name.trim().length>=2){G.preventDefault();bn()}},onChange:G=>{const mo=G.target.value;mo[0]==="김"?u(co=>{const wo=[...co.hanjaOhang];return wo[0]="金",{...co,name:mo,hanjaOhang:wo}}):u(co=>({...co,name:mo}))},className:"w-full'
if old not in kw:
    raise SystemExit("koNameInput block miss")

# Lock scroll on focus; clear on blur. Also preventScroll where possible.
new = (
    'id:"koNameInput",value:t.name,onKeyDown:G=>{if(G.key==="Enter"&&t.name.trim().length>=2){G.preventDefault();bn()}},'
    'onChange:G=>{const mo=G.target.value;mo[0]==="김"?u(co=>{const wo=[...co.hanjaOhang];return wo[0]="金",{...co,name:mo,hanjaOhang:wo}}):u(co=>({...co,name:mo}))},'
    'onFocus:G=>{const y=window.scrollY||window.pageYOffset||0;const pin=()=>window.scrollTo(0,y);pin();'
    'requestAnimationFrame(()=>{pin();requestAnimationFrame(pin)});'
    'const t1=setTimeout(pin,50),t2=setTimeout(pin,150),t3=setTimeout(pin,300);'
    'G.target._koPin={t1,t2,t3,pin,y};'
    'window.visualViewport&&window.visualViewport.addEventListener("resize",pin);'
    'G.target.addEventListener("blur",()=>{const s=G.target._koPin;if(!s)return;clearTimeout(s.t1);clearTimeout(s.t2);clearTimeout(s.t3);'
    'window.visualViewport&&window.visualViewport.removeEventListener("resize",s.pin);delete G.target._koPin},{once:!0})},'
    'className:"w-full'
)
kw = kw.replace(old, new, 1)

# Soften container scrollPaddingTop that pulls focused fields under sticky header
# Only the input page container - change 110 to 0 for less jump, or keep small
# Actually scrollPaddingTop causes MORE upward scroll when focusing. Set to 0 on input container.
old_pad = 'className:"container py-6",style:{scrollPaddingTop:"110px"}'
new_pad = 'className:"container py-6",style:{scrollPaddingTop:"0px"}'
if old_pad not in kw:
    print("pad miss", repr(kw[kw.find("container py-6")-20:kw.find("container py-6")+80]))
else:
    kw = kw.replace(old_pad, new_pad, 1)
    print("pad cleared")

# Check nested scrollPadding on input max-w-lg
i = kw.find('Home.tsx:570"')
print("570", repr(kw[i:i+200]) if i>0 else "no")

html = html.replace(
    "#koNameInput{scroll-margin-top:0;scroll-margin-bottom:24px;}",
    "#koNameInput{scroll-margin-top:0;scroll-margin-bottom:0;}",
)

p.write_text(kw, encoding="utf-8")
html_p.write_text(html, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
print("pin focus", "_koPin" in kw)
