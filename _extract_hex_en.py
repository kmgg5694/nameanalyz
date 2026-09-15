# -*- coding: utf-8 -*-
import re
from pathlib import Path

t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = []

# Find hexagram name display - look near 건위천 object
pos = t.find('"건위천"')
out.append(f"geon @{pos}\n")
# Find English hex name maps - maybe name: after hangul keys in a compact map
# Search for patterns like 건위천:" something english
m = re.search(r'"건위천"\s*:\s*"([^"]+)"', t)
out.append(f"direct map {m.group(1) if m else None}\n")

# Look for gwa / hex title fields used in summary
for pat in [r"gwaName", r"hexTitle", r"guaName", r"trigram", r"hexagramName", r"nameKo", r"nameHangul", r"hanjaName"]:
    ms = list(re.finditer(pat, t))
    out.append(f"{pat}: {len(ms)}\n")
    for mm in ms[:3]:
        out.append(t[mm.start() : mm.start() + 200] + "\n---\n")

# Find summary table cell that shows suri/gwa - look for Early / Youth / nameEn usage in JSX
for pat in [r"Early Years", r"Youth", r"Midlife", r"Later Years", r"초년", r"nameEn", r"shortDescEn"]:
    pass

# Extract a dict that maps Korean hex keys to something with En
# Perhaps: {건위천:{nameEn:"...", ...}}
m = re.search(r'"건위천"\s*:\s*\{[^}]{0,200}nameEn:"([^"]+)"', t)
out.append(f"geon nameEn in obj: {m.group(1) if m else None}\n")

m = re.search(r'"건위천"\s*:\s*\{[^}]{0,300}', t)
if m:
    out.append("geon obj: " + m.group(0) + "\n")

# Search romanized hangul for hex (CamelCase two+ syllables common in korean romanization)
# Look near "upper:1,lower:1"
idx = t.find("upper:1,lower:1")
out.append(f"upper lower @{idx}\n")
out.append(t[idx - 100 : idx + 300] + "\n")

# Find all nameEn that are NOT in sy block (hex might use different field)
# Count nameEn total was 149, sy has 81, so ~68 more - could be hex!
all_nameen = [(m.start(), m.group(1)) for m in re.finditer(r'nameEn:"([^"]+)"', t)]
out.append(f"total nameEn={len(all_nameen)}\n")
# ones after sy block end
sy_start = t.find('sy={1:{nameEn:"')
# find sy end roughly after 81st
positions = [p for p, _ in all_nameen]
# split: first 81 are suri, rest are ?
out.append("nameEn 82-149 (possible hex):\n")
for i, (p, n) in enumerate(all_nameen[81:], 82):
    out.append(f"{i}\t{n}\n")

Path(r"C:\Users\a8071\Projects\nameanalyz\_hex_nameen_list.txt").write_text("".join(out), encoding="utf-8")
print("done", len(all_nameen))
