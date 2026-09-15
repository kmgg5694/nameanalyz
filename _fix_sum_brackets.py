# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

marker = 'Home.tsx:1163",className:"text-center font-bold",style:{color:"#aaa"},children:"미입력"},Xo)'
i = kw.find(marker)
if i < 0:
    raise SystemExit("marker miss")
# show exact chars after Xo)
start = i + len(marker)
snip = kw[start:start+40]
print("after Xo):", repr(snip))

# Expected after 한문주역 map: )]})]})}))),birthSuri
# Meaning: ) close map, ]}) close tr, ]}) close tbody, ]}) close table, }) close overflow, }) close box1
# Current bad likely: )]})]})}))),  (extra } ) and missing ])

# Find from Xo) to ,birthSuri&&bW
j = kw.find(",birthSuri&&bW&&bH&&bI&&bJ&&m.jsxs(\"div\",{\"data-loc\":\"client/src/pages/Home.tsx:bdSumBox\"", start)
print("junction", repr(kw[start:j]))

# Replace junction between end of map and birth box
old_junc = kw[start:j]
new_junc = ")]})]})}))),"
# wait - after marker we already have "},Xo)" consumed - marker ends with Xo)
# so junction starts with what follows Xo)
# Correct: )]})]})}))),
# = ) ]}) ]}) ]}) }) }) ,
new_junc = ")]})]})}))),"
print("old", repr(old_junc))
print("new", repr(new_junc))

kw2 = kw[:start] + new_junc + kw[j:]

# Also verify closing of birth box before 1172
k = kw2.find("bdSumGwe")
end = kw2.find('Home.tsx:1172"', k)
print("birth end", repr(kw2[end-120:end+20]))

p.write_text(kw2, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True, text=True, encoding="utf-8", errors="replace")
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr[-400:])
else:
    print("말년(총운)", kw2.count("말년(총운)"))
    print("말년 alone header", 'children:"말년"' in kw2)
    print("bdSumBox", "bdSumBox" in kw2)
