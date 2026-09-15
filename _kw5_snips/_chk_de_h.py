# -*- coding: utf-8 -*-
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = []
# function de( at 39575 - might be React scheduler, skip
# const de= at 91965 - likely the name helper inside dy
i = t.find("const de=")
out.append("=== const de= @%d ===\n%s" % (i, t[i:i+400]))
# second const de=
j = t.find("const de=", i+10)
out.append("=== const de=2 @%d ===\n%s" % (j, t[j:j+400]))
i = t.find("const H=")
out.append("=== const H= @%d ===\n%s" % (i, t[i:i+400]))
j = t.find("const H=", i+10)
out.append("=== const H=2 @%d ===\n%s" % (j, t[j:j+400]))
# nameEn sample
k = t.find("nameEn:")
out.append("=== nameEn @%d ===\n%s" % (k, t[k:k+200]))
# C= around 86120
out.append("=== C @86120 ===\n%s" % t[86120:86520])
# P around 341157
out.append("=== P @341157 ===\n%s" % t[341157:341557])
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\en_name_helpers.txt").write_text("\n\n".join(out), encoding="utf-8")
print("wrote")
