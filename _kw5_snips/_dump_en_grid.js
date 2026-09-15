const fs = require("fs");
const t = fs.readFileSync("C:/Users/a8071/Projects/nameanalyz/assets/index-eTNXNndF.js", "utf8");
const keys = ["EnglishName.tsx:602", "EnglishName.tsx:646", "gridTemplateColumns"];
for (const k of keys) {
  let idx = 0, n = 0;
  while ((idx = t.indexOf(k, idx)) >= 0 && n < 6) {
    console.log("---", k, idx);
    console.log(t.slice(idx, idx + 180));
    idx += k.length;
    n++;
  }
}
