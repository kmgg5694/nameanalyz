# -*- coding: utf-8 -*-
import pathlib, re
s = pathlib.Path('assets/index-kw5.js').read_text(encoding='utf-8')
for pat in [r'name:"산뢰이"[^}]+desc:"([^"]+)"', r'id:52,name:"산뢰이"[^}]+desc:"([^"]+)"']:
    m = re.search(pat, s)
    if m:
        print('CURRENT:', m.group(1))
        break
# sample other gwe with story intro
for nm in ['산택손', '산화비', '산풍고', '뢰뢰']:
    m = re.search(rf'name:"{nm}"[^}}]+desc:"([^"]+)"', s)
    if m:
        print(f'\n{nm}:', m.group(1)[:120])
