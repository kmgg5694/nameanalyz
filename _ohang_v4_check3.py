# -*- coding: utf-8 -*-
from pathlib import Path
etnx = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_ohang_v4_check3.txt")
i = etnx.find('[R,D]=j.useState("en")')
out.write_text(etnx[i - 600 : i + 80], encoding="utf-8")
print("ok", i)
