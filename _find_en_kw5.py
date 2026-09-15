# -*- coding: utf-8 -*-
import pathlib
s = pathlib.Path('assets/index-kw5.js').read_text(encoding='utf-8')
idx = s.find('EnglishName.tsx:700')
out = [s[idx-2500:idx+600]]
pathlib.Path('_find_en_kw5.txt').write_text('\n'.join(out), encoding='utf-8')
print('idx', idx)
