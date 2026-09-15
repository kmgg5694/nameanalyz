import os

path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
out_dir = r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips"
CTX = 800

with open(path, "r", encoding="utf-8") as f:
    data = f.read()

def write_after(fname, needle):
    idx = data.find(needle)
    if idx < 0:
        return False, needle
    snippet = needle + data[idx + len(needle) : idx + len(needle) + CTX]
    with open(os.path.join(out_dir, fname), "w", encoding="utf-8") as out:
        out.write(snippet)
    return True, needle

write_after("name_label.txt", "한글 이름 ")
write_after("warn_box.txt", r"\u26A0 \uACBD\uACE0")
write_after("dueum_box.txt", r"\uB450\uC74C\uBC95\uCE59")
write_after("hanja_section.txt", "한자 자원오행 선택")

idx577 = data.find('m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:577"')
with open(os.path.join(out_dir, "form_start.txt"), "w", encoding="utf-8") as out:
    out.write(data[idx577 : idx577 + CTX + 200])

print("done")
