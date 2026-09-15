const fs = require("fs");
const t = fs.readFileSync("C:/Users/a8071/Projects/nameanalyz/assets/index-eTNXNndF.js", "utf8");
const keys = ["EnglishName.tsx:642", "EnglishName.tsx:646", "EnglishName.tsx:649", "Date of Birth", "탄생일"];
for (const k of keys) {
  const idx = t.indexOf(k);
  console.log("===", k, idx);
  if (idx >= 0) console.log(t.slice(idx, idx + 420));
}
