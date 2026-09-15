# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
en = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
ko = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

i = en.find("EnglishName.tsx:1042m")
print("EN insert around 1042m..781:")
print(en[i-40:i+60])
j = en.find("EnglishName.tsx:781")
print("...781", en[j-50:j+40])

i = en.find('EnglishName.tsx:1042"')
print("\nEN old 1042 children start:")
print(en[i:i+180])

i = ko.find("Home.tsx:1112")
print("\nKO 1112 prev:", ko[i-50:i+40])
j = ko.find("Home.tsx:978")
print("KO 978 prev:", ko[j-60:j+40])
k = ko.find("Home.tsx:1201")
print("KO 1201 prev:", ko[k-50:k+40])
