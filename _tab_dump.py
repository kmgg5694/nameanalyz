# -*- coding: utf-8 -*-
import pathlib, re
s = pathlib.Path('assets/index-kw5.js').read_text(encoding='utf-8')
out = []
for pat in ['data-tab', 'dataTab', '"input"', 'e==="input"', 'e==="result"', 'a("result")', 'role:"tablist"', 'tab-nav']:
    hits = [m.start() for m in re.finditer(re.escape(pat) if pat.startswith('data') else pat, s)]
    out.append(f'{pat}: {len(hits)}')
    for i in hits[:2]:
        out.append('  ' + s[max(0,i-60):i+100])
pathlib.Path('_tab_dump.txt').write_text('\n'.join(out), encoding='utf-8')
