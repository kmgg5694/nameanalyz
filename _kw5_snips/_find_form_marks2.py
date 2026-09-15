# -*- coding: utf-8 -*-
import re
from pathlib import Path
t = Path("assets/index-kw5.js").read_text(encoding="utf-8")
# around name input
i = t.find('id:"koNameInput"')
print("=== around name ===")
print(t[i:i+2500])
print("\n=== locs near form ===")
# find Home.tsx locs between 570-720
for m in re.finditer(r'Home\.tsx:([0-9a-zA-Z]+)', t[2267000:2275000]):
    print(m.group(0), 2267000+m.start())
