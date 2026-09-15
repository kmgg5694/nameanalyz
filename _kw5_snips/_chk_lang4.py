from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
i = t.find('D(S?"en":"ko")')
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\en_lang_btn.txt").write_text(t[i-200:i+250], encoding="utf-8")
print("wrote", i)
