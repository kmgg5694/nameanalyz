import os

path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
out_dir = r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips"
CTX = 800

with open(path, "r", encoding="utf-8") as f:
    data = f.read()

def write_after(fname, needle):
    idx = data.find(needle)
    if idx < 0:
        return False
    snippet = needle + data[idx + len(needle) : idx + len(needle) + CTX]
    with open(os.path.join(out_dir, fname), "w", encoding="utf-8") as out:
        out.write(snippet)
    return True

# 1 - name label: anchor on full label pattern
write_after("name_label.txt", "한글 이름 ")

# 2 - warn: unicode escaped in source
warn_needle = "\u26A0 \uACBD\uACE0"
if not write_after("warn_box.txt", warn_needle):
    write_after("warn_box.txt", "\uC608\uBA85")

# 3 - dueum: search decoded in file via loc 581
idx581 = data.find("Home.tsx:581", data.find("Home.tsx:577"))
chunk = data[idx581 : idx581 + 1200]
# find dueum title in chunk
dueum_title = "\uB450\uC74C\uBC95\uCE59"
pos = chunk.find(dueum_title)
if pos >= 0:
    # include some context before for uniqueness
    start = max(0, pos - 20)
    snippet = chunk[start : start + len("\u26A0 \uB450\uC74C\uBC95\uCE59") + CTX]
    with open(os.path.join(out_dir, "dueum_box.txt"), "w", encoding="utf-8") as out:
        out.write(snippet)
else:
    write_after("dueum_box.txt", "581")

write_after("hanja_section.txt", "한자 자원오행 선택")

idx577 = data.find('m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:577"')
if idx577 < 0:
    idx577 = data.find("Home.tsx:577")
with open(os.path.join(out_dir, "form_start.txt"), "w", encoding="utf-8") as out:
    out.write(data[idx577 : idx577 + CTX + 200])

print("ok")
