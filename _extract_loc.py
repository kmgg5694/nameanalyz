# -*- coding: utf-8 -*-
import pathlib
s = pathlib.Path('assets/index-kw5.js').read_text(encoding='utf-8')
for loc in ['Home.tsx:716', 'Home.tsx:725', 'Home.tsx:728', 'Home.tsx:527', 'Home.tsx:510', 'Home.tsx:570']:
    i = s.find(loc)
    if i >= 0:
        pathlib.Path(f'_loc_{loc.replace(":","_")}.txt').write_text(s[i-100:i+1200], encoding='utf-8')
        print('ok', loc)
