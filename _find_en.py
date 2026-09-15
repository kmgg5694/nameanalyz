# -*- coding: utf-8 -*-
import pathlib
s = pathlib.Path('assets/index-eTNXNndF.js').read_text(encoding='utf-8')
idx = s.find('EnglishName.tsx:700')
out = []
out.append('before:')
out.append(s[idx-3000:idx+500])
pathlib.Path('_find_en.txt').write_text('\n'.join(out), encoding='utf-8')
print('idx', idx)
