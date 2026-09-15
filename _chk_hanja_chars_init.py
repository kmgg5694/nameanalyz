# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

# find hanjaChars initial state
for s in ['hanjaChars:[', 'hanjaChars:["","",""]', "hanjaChars:Array", "hanjaChars:t", 'hanjaChars:', "hanjaOhang:["]:
    print(s, kw.find(s), kw.count(s) if len(s)<20 else "")

i = kw.find("hanjaChars:")
print(kw[i:i+200])
i2 = kw.find('hanjaChars:["')
print("array init", i2, kw[i2:i2+80] if i2>=0 else None)

# useState initial for form
i = kw.find("hanjaChars")
# find first useState with hanja
import re
m = re.search(r"hanjaChars:\[[^\]]*\]", kw)
print("regex", m.group(0) if m else None)
ms = list(re.finditer(r"hanjaChars:\[[^\]]*\]", kw))
for x in ms[:8]:
    print(x.start(), x.group(0))
