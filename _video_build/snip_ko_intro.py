# -*- coding: utf-8 -*-
from pathlib import Path
s = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
i = s.find('className:"intro-sec"')
print("idx", i)
if i >= 0:
    Path(r"C:\Users\a8071\Projects\nameanalyz\_video_build\ko_intro_snip.txt").write_text(s[i-80:i+1200], encoding="utf-8")
    print("wrote")
