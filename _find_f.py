# -*- coding: utf-8 -*-
import pathlib, re
s = pathlib.Path('assets/index-kw5.js').read_text(encoding='utf-8')
# find j6 function start and variable f definition near result
i = s.find('function j6(){')
chunk = s[i:i+8000]
# find patterns like ,f= or [f, or const f
for m in re.finditer(r'(?:const |,)(f|ao)\s*=', chunk):
    start = max(0, m.start()-30)
    print(chunk[start:m.start()+80])
    print('---')
