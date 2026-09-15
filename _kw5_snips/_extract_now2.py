path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. koNameInput onFocus handler
idx = content.find('id:"koNameInput"')
print("koNameInput idx:", idx)

if idx != -1:
    pos = content.rfind("onFocus:", 0, idx)
    print("onFocus pos before id:", pos)
    rest = content[pos:]
    brace_start = rest.find("{")
    depth = 0
    end = None
    for i in range(brace_start, len(rest)):
        if rest[i] == "{":
            depth += 1
        elif rest[i] == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    onfocus_str = rest[:end]
    print("ONFOCUS LEN:", len(onfocus_str))
    with open(
        r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\name_focus_now2.txt",
        "w",
        encoding="utf-8",
    ) as out:
        out.write(onfocus_str)

# 2. Preview block
start_marker = 'ro.length>0&&m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:602"'
end_marker = 'm.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:655"'

s = content.find(start_marker)
e = content.find(end_marker, s)
print("preview start:", s, "end:", e)

if s != -1 and e != -1:
    block = content[s:e]
    print("BLOCK LEN:", len(block))
    with open(
        r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\preview_block.txt",
        "w",
        encoding="utf-8",
    ) as out:
        out.write(block)
    print("LAST 60:", repr(block[-60:]))
