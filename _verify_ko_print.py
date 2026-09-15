import pathlib
s=pathlib.Path('assets/index-kw5.js').read_text(encoding='utf-8')
i=s.find('Home.tsx:728')
open('_verify_ko_print.txt','w',encoding='utf-8').write(s[i:i+400])
