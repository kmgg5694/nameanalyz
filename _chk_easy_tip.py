# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
t = Path("assets/index-kw5.js").read_text(encoding="utf-8")
i = t.find("한글만")
print(t[i-100:i+200])
print("---")
i2 = t.find("한문 없이도")
print("한문 없이도", i2)
print(t[i2-80:i2+120] if i2>0 else "")
print("---")
i3 = t.find("이렇게만 하세요")
print(t[i3-50:i3+250])
