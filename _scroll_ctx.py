# -*- coding: utf-8 -*-
import pathlib, re
s = pathlib.Path('assets/index-kw5.js').read_text(encoding='utf-8')
# find j6 function
i = s.find('function j6(){')
chunk = s[i:i+120000]
for pat in ['Je=N.useCallback', 'scrollIntoView', 'scrollTo', 'koNameInput', 'id:"koNameInput"', 'ao(!0)', 'bn()', 'result-full', 'hjShow', 'hanjaManualStrokes']:
    j = 0
    while True:
        k = chunk.find(pat, j)
        if k < 0: break
        pathlib.Path('_scroll_ctx.txt').open('a', encoding='utf-8').write(f'\n=== {pat} at {k} ===\n')
        pathlib.Path('_scroll_ctx.txt').open('a', encoding='utf-8').write(chunk[max(0,k-150):k+400])
        pathlib.Path('_scroll_ctx.txt').open('a', encoding='utf-8').write('\n')
        j = k + 1
