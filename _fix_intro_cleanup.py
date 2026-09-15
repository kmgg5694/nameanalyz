# -*- coding: utf-8 -*-
"""Clean leftover intro CSS and restore EN liftInputs."""
from pathlib import Path
import re
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8")

# --- Korean index.html style fix ---
ko = Path(r"C:\Users\a8071\Projects\nameanalyz\index.html")
t = ko.read_text(encoding="utf-8")
# replace broken style block between <style> and </style> in head (first one)
new_style = """    <style>
      body, p, span, div, h1, h2, h3, h4, h5, h6, li, td, th, label, a, button {
        word-break: keep-all;
        overflow-wrap: break-word;
        -webkit-hyphens: none;
        -ms-hyphens: none;
        hyphens: none;
      }
      #koNameInput{scroll-margin-top:120px;scroll-margin-bottom:24px;}
      #result-full-capture{scroll-margin-top:112px;}
    </style>"""
t2, n = re.subn(r"    <style>[\s\S]*?</style>", new_style, t, count=1)
if n != 1:
    raise SystemExit(f"ko style replace count={n}")
ko.write_text(t2, encoding="utf-8")
print("ko style cleaned")

# --- English index.html style + liftInputs ---
en = Path(r"C:\Users\a8071\Projects\nameanalyz\english\index.html")
t = en.read_text(encoding="utf-8")

# Rebuild style: keep non-intro rules from HEAD via git, simpler: fix broken parts
# Remove orphan keyframe remnant and intro media rules
t = re.sub(r"100%\{transform:translateX\(-100%\)\}\s*\}\s*", "", t)
t = re.sub(
    r"\s*\.intro-sec\{[\s\S]*?\.intro-media-btn svg\{[^}]*\}\s*",
    "\n",
    t,
    count=1,
)
en.write_text(t, encoding="utf-8")

# restore liftInputs from HEAD
raw = subprocess.check_output(
    ["git", "show", "HEAD:english/index.html"],
    cwd=r"C:\Users\a8071\Projects\nameanalyz",
).decode("utf-8")
a = raw.find("(function liftInputsAboveKeyboard()")
b = raw.find("})();", a) + 5
lift = raw[a:b]
t = en.read_text(encoding="utf-8")
if "liftInputsAboveKeyboard" not in t:
    needle = '    <script src="../pwa-install.js"></script>'
    if needle not in t:
        raise SystemExit("en pwa needle miss")
    insert = f"    <script>\n      {lift}\n    </script>\n{needle}"
    t = t.replace(needle, insert, 1)
    en.write_text(t, encoding="utf-8")
    print("en liftInputs restored")
else:
    print("en liftInputs already present")

# verify
for p in [ko, en]:
    txt = p.read_text(encoding="utf-8")
    print(
        p.name,
        "intro-sec",
        "intro-sec" in txt,
        "bindIntro",
        "bindIntro" in txt,
        "broken keyframe",
        "translateX(-100%)" in txt,
        "lift",
        "liftInputsAboveKeyboard" in txt if p.name.startswith("english") or "english" in str(p) else "n/a",
    )

# bundles still clean
for p in [
    Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"),
    Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js"),
]:
    txt = p.read_text(encoding="utf-8")
    r = subprocess.run(["node", "--check", str(p)], capture_output=True)
    print(p.name, "intro", 'className:"intro-sec"' in txt, "syntax", r.returncode)
