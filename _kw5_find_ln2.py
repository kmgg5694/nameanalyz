import os

path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
out_dir = r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips"

with open(path, "r", encoding="utf-8") as f:
    data = f.read()

# Ln=b6 and b6 definition
ln_idx = data.find("Ln=b6")
b6_idx = data.rfind("b6=", 0, ln_idx)
print("Ln=b6 at", ln_idx, "b6= before at", b6_idx)
print(data[b6_idx : b6_idx + 200])

# x6 wiring - onSearchClick:Se
wire = data.find("onSearchClick:Se")
print("onSearchClick:Se at", wire)
print(data[wire - 300 : wire + 400])

# se handler - onHanjaChange:se
se_wire = data.find("onHanjaChange:se")
print("onHanjaChange:se at", se_wire)

# Update ln_filter_logic with Ln=b6
with open(os.path.join(out_dir, "ln_filter_logic.txt"), "w", encoding="utf-8") as f:
    f.write("/* Ln module alias */\n")
    f.write(data[ln_idx - 50 : ln_idx + 80])
    f.write("\n\n/* b6 source (truncated) */\n")
    f.write(data[b6_idx : b6_idx + 300])
    f.write("\n\n/* Ge helper + Vn filter IIFE */\n")
    ge = data.find("const Ge=G=>")
    f.write(data[ge : ge + 2400])
    f.write("\n\n/* x6 Ln.find usage */\n")
    xf = data.find("i?Ln.find(ao=>ao.char===i)")
    f.write(data[xf - 150 : xf + 250])

print("done")
