# -*- coding: utf-8 -*-
from pathlib import Path
s = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
i = s.find('data-loc":"client/src/pages/Home.tsx:572')
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_video_build\home_snip.txt")
out.write_text(s[i - 500 : i + 2200], encoding="utf-8")
print("wrote", out, "start", i)
