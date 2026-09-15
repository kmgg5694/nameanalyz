from pathlib import Path

src = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
start = src.find("x6=ko.memo(function")
end = src.find("});function v6")
comp = src[start:end]
comp_with_close = src[start:end+3]

out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\x6_now.txt")
out.write_text(comp, encoding="utf-8")

prefix = "const ko={memo:f=>f}; const m={jsx:()=>null,jsxs:()=>null,Fragment:1}; const N={useState:()=>[]}; const Ln=[]; const Rn={}; let x6; "
wrapped = prefix + comp + ";"
wrapped2 = prefix + comp_with_close + ";"

Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\x6_wrap_test.js").write_text(wrapped, encoding="utf-8")
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\x6_wrap_close.js").write_text(wrapped2, encoding="utf-8")

print("WROTE x6_now.txt len", len(comp))
print("ENDING_EXCL", repr(comp[-20:]))
print("ENDING_INCL", repr(comp_with_close[-20:]))
print("END_MATCH", comp_with_close.endswith("})]})]})});"))

print("HANJA_IN_X6", "hanja" in comp)
print("A_HANJA_DQ", 'a("hanja")' in comp)
print("A_HANJA_SQ", "a('hanja')" in comp)

idx = 0
n = 0
while True:
    i = comp.lower().find("focus", idx)
    if i < 0:
        break
    n += 1
    print("FOCUS_HIT", n, repr(comp[max(0, i-50):i+60]))
    idx = i + 5
print("FOCUS_COUNT", n)

print("X6_HEAD")
print(comp[:2500])
print("---HEAD_END---")

idx = 0
n = 0
while True:
    i = src.find("pickerOpen", idx)
    if i < 0:
        break
    n += 1
    print("PICKER", n, repr(src[max(0, i-80):i+80]))
    idx = i + 10
print("PICKER_COUNT", n)

print("PICKER_EXACT", "pickerOpen:v===G" in src)
print("PICKER_SPACED", "pickerOpen: v===G" in src)

for needle in ["jsx(x6", "jsxs(x6", "m.jsx(x6", "createElement(x6"]:
    i = src.find(needle)
    print("NEEDLE", needle, i)
    if i >= 0:
        print(repr(src[i:i+500]))

print("AFTER_X6")
print(src[end:end+800])
print("---AFTER_END---")

# look for se= or ,se= in x6 with simple find
for needle in ["se=", ",se=", "function se", "const se", "let se", "se(", "Se=", "SE="]:
    i = comp.find(needle)
    print("SE_NEEDLE", repr(needle), i)
    if i >= 0:
        print(repr(comp[max(0,i-40):i+200]))
