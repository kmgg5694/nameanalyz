# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\suri8b.txt")
i = kw.find('8,name:"수복겸전(壽福兼全)"')
out.write_text(
    "idx %s\nBEFORE\n%s\n---ENTRY---\n%s\n"
    % (i, kw[i-80:i], kw[i:i+800]),
    encoding="utf-8",
)
print("idx", i)
