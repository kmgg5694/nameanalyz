import os

path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
out_dir = r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips"
os.makedirs(out_dir, exist_ok=True)

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

start_marker = 'm.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:581b"'
end_marker = 'ro.length>0&&m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:602"'
hanja_marker = '})]}),m.jsx("button",{"data-loc":"client/src/pages/Home.tsx:703"'

start = content.find(start_marker)
if start == -1:
    raise SystemExit("581b not found")
end = content.find(end_marker, start)
if end == -1:
    raise SystemExit("602 not found after 581b")

warn_chunk = content[start:end]
warn_before = content[start - 80 : start]

hanja_pos = content.find(hanja_marker)
if hanja_pos == -1:
    raise SystemExit("703 not found")
hanja_end = content[hanja_pos - 100 : hanja_pos]

with open(os.path.join(out_dir, "warn_chunk.txt"), "w", encoding="utf-8") as f:
    f.write(warn_chunk)
with open(os.path.join(out_dir, "warn_before.txt"), "w", encoding="utf-8") as f:
    f.write(warn_before)
with open(os.path.join(out_dir, "hanja_end.txt"), "w", encoding="utf-8") as f:
    f.write(hanja_end)

print("warn_chunk length:", len(warn_chunk))
print("first 120:", repr(warn_chunk[:120]))
print("last 80:", repr(warn_chunk[-80:]))
print("80 before 581b:", repr(warn_before))
print("581b count in warn_chunk:", warn_chunk.count("581b"))
print("581 count in warn_chunk:", warn_chunk.count("581"))
print("581b appears once:", warn_chunk.count("581b") == 1)
print("581 appears once:", warn_chunk.count("581") == 1)
print("start pos:", start, "end pos:", end, "hanja pos:", hanja_pos)
