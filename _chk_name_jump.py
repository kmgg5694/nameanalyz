# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
html = Path(r"C:\Users\a8071\Projects\nameanalyz\index.html").read_text(encoding="utf-8")

i = kw.find('id:"koNameInput"')
print("=== koNameInput handlers ===")
print(kw[i:i+500])
print()

# any remaining scroll near name
for n in ["scrollBy", "scrollTo", "scrollIntoView", "onTouchStart", "onFocus", "liftKo", "koNameInput", "scroll-margin", "scrollPadding", "scroll-padding"]:
    print(n, kw.count(n) if n in ("scrollBy","scrollTo","scrollIntoView","onTouchStart") else "", end=" ")
print()

# all onTouchStart in j6 form region
j6 = kw.find("function j6()")
form = kw[j6:j6+40000]
idx = 0
c = 0
while c < 15:
    j = form.find("onTouchStart", idx)
    if j < 0:
        break
    print(f"\n--- onTouchStart #{c} ---")
    print(form[j:j+200])
    idx = j + 1
    c += 1

idx = 0
c = 0
while c < 15:
    j = form.find("onFocus", idx)
    if j < 0:
        break
    print(f"\n--- onFocus #{c} ---")
    print(form[j:j+180])
    idx = j + 1
    c += 1

print("\n=== HTML CSS ===")
for line in html.splitlines():
    if "scroll" in line.lower() or "koName" in line or "birth" in line:
        print(line.strip())

# container scrollPadding near input
i = kw.find('scrollPaddingTop')
print("\nscrollPaddingTop hits", kw.count("scrollPaddingTop"))
idx = j6
while True:
    j = kw.find("scrollPadding", idx)
    if j < 0 or j > j6+50000:
        break
    print(repr(kw[j-40:j+80]))
    idx = j + 1
