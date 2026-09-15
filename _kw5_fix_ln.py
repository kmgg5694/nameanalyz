import os

path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
out_dir = r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips"

with open(path, "r", encoding="utf-8") as f:
    data = f.read()

ln_idx = data.find("Ln=b6")
b6_idx = data.rfind("b6=", 0, ln_idx)
ge = data.find("const Ge=G=>")
vn = data.find("Vn=(()=>{")
xf = data.find("i?Ln.find(ao=>ao.char===i)")

with open(os.path.join(out_dir, "ln_filter_logic.txt"), "w", encoding="utf-8") as f:
    f.write("/* Ln module alias (module-scoped, x6 can access) */\n")
    f.write(data[b6_idx : ln_idx + 10])
    f.write("\n\n/* Hn/Sn old-hangul map + Ge helper */\n")
    f.write(data[data.find("Hn={") : ge + 200])
    f.write("\n\n/* Vn filter IIFE (uses c search query + Ln) */\n")
    f.write(data[vn : vn + 900])
    f.write("\n\n/* x6 Ln.find usage */\n")
    f.write(data[xf - 200 : xf + 300])

print("written ln_filter_logic.txt")
