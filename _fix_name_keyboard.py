# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import re
import sys
sys.stdout.reconfigure(encoding="utf-8")

root = Path(r"C:\Users\a8071\Projects\nameanalyz")
js = (root / "assets/index-kw5.js").read_text(encoding="utf-8")

old = (
    'onFocus:G=>{const y=window.scrollY||window.pageYOffset||0;const pin=()=>window.scrollTo(0,y);pin();requestAnimationFrame(()=>{pin();requestAnimationFrame(pin)});const t1=setTimeout(pin,50),t2=setTimeout(pin,150),t3=setTimeout(pin,300);G.target._koPin={t1,t2,t3,pin,y};window.visualViewport&&window.visualViewport.addEventListener("resize",pin);G.target.addEventListener("blur",()=>{const s=G.target._koPin;if(!s)return;clearTimeout(s.t1);clearTimeout(s.t2);clearTimeout(s.t3);window.visualViewport&&window.visualViewport.removeEventListener("resize",s.pin);delete G.target._koPin},{once:!0})}'
)
new = 'onFocus:G=>liftKoField(G.target)'

if old not in js:
    i = js.find('id:"koNameInput"')
    print(repr(js[i:i+500]))
    raise SystemExit("onFocus block miss")

js = js.replace(old, new, 1)

# Also add onTouchStart lift for iOS (keyboard often opens on touch before focus settles)
# Check if already has onTouchStart near koNameInput
snip = js[js.find('id:"koNameInput"')-80:js.find('id:"koNameInput"')+200]
if "onTouchStart" not in snip:
    js = js.replace(
        'id:"koNameInput",value:t.name,onKeyDown:',
        'id:"koNameInput",value:t.name,onTouchStart:G=>liftKoField(G.currentTarget),onKeyDown:',
        1,
    )
    print("added onTouchStart")
else:
    print("onTouchStart already present")

(root / "assets/index-kw5.js").write_text(js, encoding="utf-8")
r = subprocess.run(["node", "--check", str(root / "assets/index-kw5.js")], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-400:])
    raise SystemExit(1)

# Fix scroll-margin in index.html via bytes (keep UTF-8 intact)
html = (root / "index.html").read_bytes()
old_css = b"#koNameInput{scroll-margin-top:0;scroll-margin-bottom:0;}"
new_css = b"#koNameInput{scroll-margin-top:140px;scroll-margin-bottom:320px;}"
if old_css not in html:
    print("css miss", html.find(b"#koNameInput"))
else:
    html = html.replace(old_css, new_css, 1)
    print("css updated")

# bump cache version
html2, n = re.subn(br'index-kw5\.js\?v=[^"]+', b'index-kw5.js?v=20260911n', html, count=1)
if n != 1:
    raise SystemExit("cache bump fail")
(root / "index.html").write_bytes(html2)
print("title ok", b"</title>" in html2)
print("script", [ln for ln in html2.split(b"\n") if b"index-kw5" in ln][0].decode())
print("focus now", "onFocus:G=>liftKoField(G.target)" in (root/"assets/index-kw5.js").read_text(encoding="utf-8"))
