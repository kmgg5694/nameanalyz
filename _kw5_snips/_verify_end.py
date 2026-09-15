path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
out = r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\_verify_out.txt"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

start_marker = 'ro.length>0&&m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:602"'
end_marker = 'm.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:655"'

s = content.find(start_marker)
e = content.find(end_marker, s)
block = content[s:e]

with open(out, "w", encoding="utf-8") as f:
    f.write("between end of block and gender (200 chars):\n")
    f.write(repr(content[e - 200 : e + 80]) + "\n")
    f.write("LAST 60 of block:\n")
    f.write(repr(block[-60:]) + "\n")
