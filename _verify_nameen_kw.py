from pathlib import Path
import re
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
names = re.findall(r'nameEn:"([^"]+)"', t)
phonetic_hints = ("Wi ","Cheon","Hwa ","San ","Roe","Pung","Taek","Geon","Gwonwi","Bagyak","Hwaji","Chulbal","Bunri","Bakyak")
phonetic = [n for n in names if any(x in n for x in phonetic_hints)]
print("total nameEn", len(names))
print("phonetic leftovers", len(phonetic))
for p in phonetic[:30]:
    print(" ", p)
want = ["New Beginning","Hardship","Prosperity","Creative","Receptive","Progress","Abyss","Incomplete","Ultimate Peak","Power & Glory","Small Restraint","Biting Through"]
for w in want:
    print(w, "OK" if f'nameEn:"{w}"' in t else "MISSING")
for i in [1,2,3,5,12,33,81]:
    mm = re.search(rf"(?<![0-9]){i}:\{{nameEn:\"([^\"]+)\"", t)
    print("suri", i, mm.group(1) if mm else "?")
