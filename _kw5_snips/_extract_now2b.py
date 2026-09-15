path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find('id:"koNameInput"')
print("koNameInput idx:", idx)

# Walk backward from id to find onFocus for this input
chunk_start = max(0, idx - 3000)
chunk = content[chunk_start:idx + 200]

# Find last onFocus before id within reasonable window (same jsx props)
onfocus_pos = chunk.rfind("onFocus:")
if onfocus_pos != -1:
    abs_start = chunk_start + onfocus_pos
    rest = content[abs_start:]
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
    print("ONFOCUS distance from id:", idx - abs_start)
    print("ONFOCUS LEN:", len(onfocus_str))
    with open(
        r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\name_focus_now2.txt",
        "w",
        encoding="utf-8",
    ) as out:
        out.write(onfocus_str)

# Show context around koNameInput
print("CONTEXT BEFORE ID (last 500 chars):")
print(repr(content[idx-500:idx+100]))
