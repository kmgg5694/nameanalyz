# -*- coding: utf-8 -*-
import pathlib, re
s = pathlib.Path('assets/index-kw5.js').read_text(encoding='utf-8')
m = re.search(r'id:\d+,name:"지수사"[^}]+desc:"([^"]+)"', s)
pathlib.Path('_jisusa_verify.txt').write_text(m.group(1), encoding='utf-8')
print('ok', len(m.group(1)))
