# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

# Update 탄생일 풀이 header to show calendar date
old = 'children:"탄생일은 음력기준입니다."}),m.jsx("div",{style:{textAlign:"center",fontSize:"13px",fontWeight:700,color:"#92400e",letterSpacing:"1px",marginBottom:"6px"},children:"탄생일 풀이"})'
# find exact
i = kw.find("탄생일은 음력")
print("note at", i)
print(repr(kw[i-80:i+280]))

new_title = (
    'children:"탄생일은 음력기준입니다."}),'
    'm.jsx("div",{style:{textAlign:"center",fontSize:"14px",fontWeight:700,color:"#78350f",marginBottom:"4px"},'
    'children:"음력 "+birth.lunar[0]+"."+(+birth.lunar[1])+"."+(+birth.lunar[2])}),'
    'm.jsx("div",{style:{textAlign:"center",fontSize:"13px",fontWeight:700,color:"#92400e",letterSpacing:"1px",marginBottom:"6px"},children:"탄생일 풀이"})'
)
# find and replace the note + title pair
marker = 'children:"탄생일은 음력기준입니다."}),m.jsx("div",{style:{textAlign:"center",fontSize:"13px",fontWeight:700,color:"#92400e",letterSpacing:"1px",marginBottom:"6px"},children:"탄생일 풀이"})'
if marker not in kw:
    # try find children for 풀이 after note
    j = kw.find('children:"탄생일은 음력기준입니다."')
    print("found note children", j)
    print(repr(kw[j:j+350]))
else:
    kw = kw.replace(marker, new_title, 1)
    Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").write_text(kw, encoding="utf-8")
    print("updated 풀이 header")

kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
print("773b box", "Home.tsx:773b" in kw and "children:\"탄생일\"" in kw)
print("풀이 date", 'children:"음력 "+birth.lunar[0]' in kw)
r = subprocess.run(["node", "--check", r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"], capture_output=True)
print("syntax", r.returncode)
