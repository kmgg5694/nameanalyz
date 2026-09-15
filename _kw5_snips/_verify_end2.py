path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
out = r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\_verify_out2.txt"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

start_marker = 'ro.length>0&&m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:602"'
end_marker = 'm.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:655"'

s = content.find(start_marker)
e = content.find(end_marker, s)

with open(out, "w", encoding="utf-8") as f:
    f.write("500 chars before preview start:\n")
    f.write(content[s - 500 : s] + "\n\n")
    f.write("full gap before gender (500 chars):\n")
    f.write(content[e - 500 : e + 120] + "\n")
