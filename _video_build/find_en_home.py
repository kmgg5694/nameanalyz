# -*- coding: utf-8 -*-
from pathlib import Path
s = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
# find EnglishName.tsx first screen around heading
for loc in range(400, 560):
    needle = f'data-loc":"client/src/pages/EnglishName.tsx:{loc}"'
    i = s.find(needle)
    if i >= 0:
        snippet = s[i : i + 180].replace("\n", " ")
        Path(r"C:\Users\a8071\Projects\nameanalyz\_video_build\en_locs.txt").write_text("", encoding="utf-8")
        break
hits = []
for loc in range(380, 620):
    needle = f'data-loc":"client/src/pages/EnglishName.tsx:{loc}"'
    i = s.find(needle)
    if i >= 0:
        hits.append(f"{loc}: {s[i:i+220].replace(chr(10),' ')}")
Path(r"C:\Users\a8071\Projects\nameanalyz\_video_build\en_locs.txt").write_text("\n\n".join(hits[:40]), encoding="utf-8")
print("hits", len(hits))
