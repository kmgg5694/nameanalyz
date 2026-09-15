# -*- coding: utf-8 -*-
import pathlib, re

out = []
for fname in ['assets/index-kw5.js', 'assets/index-eTNXNndF.js']:
    s = pathlib.Path(fname).read_text(encoding='utf-8')
    out.append(f'=== {fname} ===')
    for pat in ['인쇄', 'Print', 'window.print', 'no-print', '@media print', 'print-area', 'printable']:
        idx = 0
        hits = []
        while True:
            i = s.find(pat, idx)
            if i < 0: break
            hits.append(i)
            idx = i + 1
        out.append(f'  {pat}: {len(hits)} hits')
        for i in hits[:5]:
            out.append('   ' + s[max(0,i-80):i+150])
    for m in re.finditer(r'Home\.tsx:(\d+)[^"]{0,300}', s):
        chunk = m.group(0)
        if '인쇄' in chunk or 'print' in chunk.lower():
            out.append(f'  Home line {m.group(1)}: {chunk[:250]}')
    out.append('')

pathlib.Path('_print_dump.txt').write_text('\n'.join(out), encoding='utf-8')
print('done')
