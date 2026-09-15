# -*- coding: utf-8 -*-
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
i = t.find("EnglishName.tsx:sumTable")
print("sumTable idx", i)
chunk = t[i:i+12000] if i >= 0 else ""
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\now_sum_table.txt").write_text(chunk, encoding="utf-8")
print("len", len(chunk))
for s in [
    "매우 좋았음", "나쁜 사주에 비해", "간위산 30", "이산파멸",
    "strip(Y&&Y.name)", "strip(K&&K.name)", "de(N,Y&&Y.name)",
    "Subok", "joinS", "joinG", "총평", "note", "nowrap",
    "whiteSpace", "fontSize", "overflow",
]:
    print(f"{s!r}: {chunk.find(s)}")
