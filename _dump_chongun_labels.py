# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path("assets/index-kw5.js").read_text(encoding="utf-8")
for pos in [2247880, 2315745, 2248608, 2316393]:
    print("\n====", pos, "====")
    print(kw[pos-500:pos+400])
