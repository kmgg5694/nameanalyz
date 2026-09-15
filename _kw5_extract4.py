from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# routing: how B6 is used
for n in ["B6", "EnglishName", "createBrowserRouter", "path:\"/english", "path:'/english"]:
    pass

# find B6 references besides function B6(
hits = []
i = 0
while True:
    i = t.find("B6", i)
    if i < 0:
        break
    ctx = t[max(0,i-40):i+50]
    if "function B6" not in ctx[:50]:
        hits.append(f"{i}: ...{ctx}...")
    i += 2
    if len(hits) > 15:
        break
(out/"b6_refs.txt").write_text("\n\n".join(hits[:12]) + f"\n\ncount B6={t.count('B6')}", encoding="utf-8")

# 803 card exact start/end
s = t.find('m.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:803"')
# IIFE after it
iife = t.find('(()=>{const q=["木","火","土","金","水"],oo=q.filter(z=>f.ohangCounts[z]>=3)', s)
# IIFE ends with })()  then ]}),
end_marker = t.find("})()]}),m.jsxs(\"div\",{\"data-loc\":\"client/src/pages/EnglishName.tsx:850\"", iife)
(out/"b6_cut_info.txt").write_text(
    f"s803={s}\niife={iife}\nend850marker={end_marker}\n"
    f"from 803 to 850 len={end_marker-s if end_marker>s else -1}\n"
    f"between iife and 850: {t[end_marker-30:end_marker+80] if end_marker>0 else 'none'}\n"
    f"before 803: {t[s-80:s]}\n",
    encoding="utf-8",
)

# 1038 star line
s2 = t.find('m.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:1038"')
(out/"star_line.txt").write_text(t[s2-20:s2+450], encoding="utf-8")

# confirm eTNX still has 강합니다 (must not edit)
et = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
(out/"etnx_check.txt").write_text(
    f"강합니다={et.count('기운이 강합니다')} Td={{={et.count('Td={')} ohangCounts={et.count('ohangCounts')}\n",
    encoding="utf-8",
)

print("ok", s, iife, end_marker)
