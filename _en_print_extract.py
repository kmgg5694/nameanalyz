# -*- coding: utf-8 -*-
import pathlib
s = pathlib.Path('assets/index-eTNXNndF.js').read_text(encoding='utf-8')
i = s.find('EnglishName.tsx:1253')
pathlib.Path('_en_print.txt').write_text(s[i-500:i+1500], encoding='utf-8')
s2 = pathlib.Path('assets/index-kw5.js').read_text(encoding='utf-8')
# Korean English section print in same bundle
i2 = s2.find('EnglishName.tsx:1106')
pathlib.Path('_kw5_en_print.txt').write_text(s2[i2-200:i2+1500], encoding='utf-8')
print('done')
