path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
with open(path, "r", encoding="utf-8") as f:
    data = f.read()

start = 0
hits = []
while len(hits) < 15:
    i = data.find("Ln=", start)
    if i == -1:
        break
    hits.append((i, data[i : i + 100]))
    start = i + 1

for i, ctx in hits:
    print(i, ctx)

print("---")
for pat in ["Ln=[", "const Ln", "var Ln", "10622", "char:", "wonHoek"]:
    idx = data.find(pat)
    print(f"{pat!r} first at {idx}")
    if idx >= 0 and pat in ("Ln=[", "const Ln"):
        print(data[idx : idx + 400])
