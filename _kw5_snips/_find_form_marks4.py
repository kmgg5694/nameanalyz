# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
t = Path("assets/index-kw5.js").read_text(encoding="utf-8")

# Structure around intro and form
i = t.find("intro-sec")
print("intro-sec", i)
print(t[i-200:i+400])
print("---")
# from 676 header through 703
i = t.find('"한자 자원오행 선택"')
print("hanja title", i, t[i-120:i+200])
print("---")
i = t.find('Home.tsx:703')
print("btn", t[i-80:i+280])
print("---")
# where does name card close before hanja?
i = t.find("Home.tsx:676")
print("before 676", t[i-150:i+80])
