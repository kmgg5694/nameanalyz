# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

# Birth title style to mirror
i = kw.find("bdSumBox")
print("birth title sample:")
print(repr(kw[i:i+350]))

# sumNameBox currently: m.jsx("div",{sumNameBox, style, children: m.jsx("div",{overflow...
old = 'm.jsx("div",{"data-loc":"client/src/pages/Home.tsx:sumNameBox",style:{border:"1px solid #d97706",borderRadius:"8px",padding:"8px 6px",background:"#fffef9"},children:m.jsx("div",{className:"overflow-x-auto",children:'
new = (
    'm.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:sumNameBox",style:{border:"1px solid #d97706",borderRadius:"8px",padding:"8px 6px",background:"#fffef9"},children:['
    'm.jsx("div",{style:{textAlign:"center",fontSize:"12px",fontWeight:700,color:"#92400e",letterSpacing:"2px",marginBottom:"4px"},children:"한글한문 이름기운"}),'
    'm.jsx("div",{className:"overflow-x-auto",children:'
)

if old not in kw:
    j = kw.find("sumNameBox")
    print("MISS", repr(kw[j:j+280]))
    raise SystemExit(1)

kw = kw.replace(old, new, 1)

# After replacing m.jsx with m.jsxs and children:[ title, overflow ],
# the close of sumNameBox was `})}),` (close overflow, close box) before birthSuri
# Now need `})]}),` (close overflow, close children array+box)
# Find junction after name table closes before birthSuri
# Previously: ...한문주역...]})]})})}),birthSuri
# structure after name_rows: ]}) tbody ]}) table }) overflow }) box ,
# With jsxs children:[title, overflow]: ]}) tbody ]}) table }) overflow ]}) box ,

marker = 'birthSuri&&bW&&bH&&bI&&bJ&&m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:bdSumBox"'
j = kw.find(marker)
if j < 0:
    raise SystemExit("bdSumBox miss")
print("before birth", repr(kw[j-40:j+20]))

# Expect currently `})}),birthSuri` — need `})]}),birthSuri` if we opened children:[
old_junc = '})}),' + marker
new_junc = '})]}),' + marker
if old_junc not in kw:
    print("junc miss", repr(kw[j-60:j]))
    raise SystemExit(2)
kw = kw.replace(old_junc, new_junc, 1)

p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-300:])
else:
    print("title", "한글한문 이름기운" in kw)
    i = kw.find("한글한문 이름기운")
    print(repr(kw[i-80:i+120]))
