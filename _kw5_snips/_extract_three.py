# -*- coding: utf-8 -*-
from pathlib import Path

path = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
text = path.read_text(encoding="utf-8")
names = ["풍뢰익", "택천쾌", "천풍구"]
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\_three_gwe_objs.txt")

lines = []
for name in names:
    needle = f'name:"{name}"'
    idx = text.find(needle)
    if idx == -1:
        lines.append(f"NOT FOUND: {name}")
        continue
    start = text.rfind("{id:", 0, idx)
    sub = text[start:]
    depth = 0
    end = None
    for i, ch in enumerate(sub):
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                end = start + i + 1
                break
    obj = text[start:end]
    lines.append(f"=== {name} ===")
    lines.append(obj)
    lines.append("")

out.write_text("\n".join(lines), encoding="utf-8")
print("done", out)
