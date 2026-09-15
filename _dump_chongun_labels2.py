# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path("assets/index-kw5.js").read_text(encoding="utf-8")
out = []
for pos in [2247880, 2315745, 2248608, 2316393]:
    out.append(f"\n==== {pos} ====\n")
    out.append(kw[pos-700:pos+500])
Path("_chongun_labels_out.txt").write_text("".join(out), encoding="utf-8")
print("wrote", len(out))
