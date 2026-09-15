# -*- coding: utf-8 -*-
import pathlib, re
s = pathlib.Path('assets/index-kw5.js').read_text(encoding='utf-8')
# extract around Home.tsx:728 print button
for loc in ['Home.tsx:728', 'Home.tsx:725', 'Home.tsx:727']:
    i = s.find(loc)
    if i >= 0:
        pathlib.Path(f'_snip_{loc.replace(":","_")}.txt').write_text(s[i-200:i+800], encoding='utf-8')
        print('wrote', loc)
