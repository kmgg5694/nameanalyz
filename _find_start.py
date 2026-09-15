# -*- coding: utf-8 -*-
import pathlib, re
out = []
for fn in ['index-kw5.js', 'index-eTNXNndF.js']:
    s = pathlib.Path('assets', fn).read_text(encoding='utf-8')
    out.append('=== ' + fn + ' ===')
    for pat in [
        r'bn=\(\)=>\{[^}]+\}',
        r'result-full-capture',
        r'EnglishName\.tsx:7\d\d',
        r'EnglishName\.tsx:8\d\d',
        r'gold-glow',
        r'이름풀이시작',
        r'풀이 시작',
        r'Start Reading',
        r'Get My Reading',
        r'Analyze Name',
        r'disabled:[^,]{0,80}length',
    ]:
        for m in re.finditer(pat, s):
            out.append(pat + ' @' + str(m.start()))
            out.append(s[m.start():m.start()+250])
            out.append('---')
pathlib.Path('_find_start.txt').write_text('\n'.join(out), encoding='utf-8')
print('done', len(out))
