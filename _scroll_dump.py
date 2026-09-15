# -*- coding: utf-8 -*-
import pathlib, re
s = pathlib.Path('assets/index-kw5.js').read_text(encoding='utf-8')
out = []
for pat in ['scrollIntoView', 'scrollTo', 'scrollMargin', 'scrollPadding', 'Je(', 'hanjaChars', 'hjShow', 'result-full-capture', 'Home.tsx:6', 'Home.tsx:7', 'Home.tsx:8', 'Home.tsx:9', 'Home.tsx:10', 'Home.tsx:11', 'Home.tsx:12', 'Home.tsx:13', 'Home.tsx:14', 'Home.tsx:15']:
    hits = []
    idx = 0
    while True:
        i = s.find(pat, idx)
        if i < 0: break
        hits.append(i)
        idx = i + 1
    out.append(f'{pat}: {len(hits)}')
    for i in hits[:3]:
        if pat.startswith('Home.tsx'):
            out.append('  ' + s[i:i+200])
        else:
            out.append('  ' + s[max(0,i-80):i+120])
pathlib.Path('_scroll_dump.txt').write_text('\n'.join(out), encoding='utf-8')
print('wrote', len(out), 'lines')
