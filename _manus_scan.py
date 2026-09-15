# -*- coding: utf-8 -*-
import pathlib,re
html = pathlib.Path('index.html').read_text(encoding='utf-8')
# after manus script ends
root = html.find('<div id="root">')
manus = html[html.find('manus-runtime'):root]
out = []
for pat in ['overlay','Overlay','pointer-events','z-index','zIndex','appendChild','createPortal','fixed','inset']:
    out.append(f'{pat}: {manus.count(pat)}')
pathlib.Path('_manus_scan.txt').write_text('\n'.join(out), encoding='utf-8')

# extract print css from korean
css = pathlib.Path('assets/index-D-uQpcUF.css').read_text(encoding='utf-8')
i = css.find('@media print')
j = css.find('}', i)
# find matching close - the block has nested braces? no nested in print block
# count braces
depth=0
for k in range(i, len(css)):
    if css[k]=='{': depth+=1
    elif css[k]=='}':
        depth-=1
        if depth==0:
            j=k+1
            break
pathlib.Path('_print_css_block.css').write_text(css[i:j], encoding='utf-8')
print('print block len', j-i)
