# -*- coding: utf-8 -*-
import pathlib

PRINT_BLOCK = pathlib.Path('_print_css_block.css').read_text(encoding='utf-8')
# ensure pwa overlays hidden
PRINT_BLOCK = PRINT_BLOCK.replace(
    '.no-print,header,nav,[role=tablist],.tab-nav{display:none!important}',
    '.no-print,header,nav,[role=tablist],.tab-nav,#pwaSheet,#pwaBar{display:none!important}',
)

for fname in ['assets/index-bsqWv9Bg.css']:
    p = pathlib.Path(fname)
    css = p.read_text(encoding='utf-8')
    if '@media print' not in css:
        css = css.rstrip() + PRINT_BLOCK
        p.write_text(css, encoding='utf-8')
        print('appended print css to', fname)
    else:
        print('already has print', fname)

OLD_KO = 'onClick:()=>{a("result"),setTimeout(()=>{window.print()},100)}'
NEW_KO = 'onClick:()=>{a("result");var ps=document.getElementById("pwaSheet"),pb=document.getElementById("pwaBar");if(ps)ps.style.display="none";if(pb)pb.style.display="none";setTimeout(()=>{var el=document.getElementById("result-full-capture");if(el)el.scrollIntoView({block:"start"});window.print()},300)}'

OLD_EN = 'Y=()=>{window.print()}'
NEW_EN = 'Y=()=>{var ps=document.getElementById("pwaSheet"),pb=document.getElementById("pwaBar");if(ps)ps.style.display="none";if(pb)pb.style.display="none";setTimeout(()=>{window.print()},200)}'

for fname in ['assets/index-kw5.js', 'assets/index-eTNXNndF.js']:
    p = pathlib.Path(fname)
    s = p.read_text(encoding='utf-8')
    changed = False
    if OLD_KO in s:
        s = s.replace(OLD_KO, NEW_KO, 1)
        changed = True
        print('patched KO print in', fname)
    n = s.count(OLD_EN)
    if n:
        s = s.replace(OLD_EN, NEW_EN)
        changed = True
        print('patched EN print x', n, 'in', fname)
    if changed:
        p.write_text(s, encoding='utf-8')
    else:
        print('no js patch in', fname)
