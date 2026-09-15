# -*- coding: utf-8 -*-
from pathlib import Path

js = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
# find all gridTemplateColumns near EnglishName
idx = 0
out = []
while True:
    n = js.find("gridTemplateColumns", idx)
    if n < 0:
        break
    loc_back = js.rfind("EnglishName.tsx:", max(0, n-400), n)
    loc = js[loc_back:loc_back+40] if loc_back >= 0 else "?"
    out.append(f"{n} {loc}\n{js[n:n+80]}\n")
    idx = n + 20
Path(r"C:\Users\a8071\Projects\nameanalyz\_video_build\en_grids.txt").write_text("".join(out), encoding="utf-8")
print("grids", len(out))

# DOB section loc
i = js.find("Date of Birth")
print("dob", i)
if i >= 0:
    Path(r"C:\Users\a8071\Projects\nameanalyz\_video_build\en_dob.txt").write_text(js[i-500:i+800], encoding="utf-8")
