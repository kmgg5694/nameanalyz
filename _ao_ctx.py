# -*- coding: utf-8 -*-
import pathlib, re
for fn in ['index-kw5.js', 'index-eTNXNndF.js']:
    s = pathlib.Path('assets', fn).read_text(encoding='utf-8')
    # find EnglishName component start - look for function before EnglishName.tsx:700
    idx = s.find('EnglishName.tsx:700')
    if idx < 0:
        idx = s.find('Start Reading')
    chunk = s[max(0,idx-8000):idx]
    # find ao= or similar handler definitions in last 8000 chars
    out = [f'=== {fn} ===']
    for pat in [r'ao=\(\)=>[^;]{0,200};', r'ao=\(\)=>[^}]{0,200}\}', r'const ao=', r',ao=', r'result-full']:
        for m in re.finditer(pat, chunk):
            out.append(f'{pat}: {s[m.start():m.start()+300]}')
    pathlib.Path('_ao_ctx.txt').open('a', encoding='utf-8').write('\n'.join(out)+'\n\n')
