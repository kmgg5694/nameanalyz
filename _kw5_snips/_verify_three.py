# -*- coding: utf-8 -*-
from pathlib import Path
text = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
for spec in [(36,"풍뢰익"), (9,"택천쾌"), (5,"천풍구")]:
    needle = f'{{id:{spec[0]},name:"{spec[1]}"'
    idx = text.find(needle)
    print(spec[1], "idx", idx)
    if idx >= 0:
        snippet = text[idx:idx+500]
        print(snippet[:500])
        print("---")
