const fs = require("fs");
const t = fs.readFileSync("C:/Users/a8071/Projects/nameanalyz/assets/index-eTNXNndF.js", "utf8");
const i = t.indexOf("EnglishName.tsx:642");
fs.writeFileSync(
  "C:/Users/a8071/Projects/nameanalyz/_kw5_snips/en_dob_block.txt",
  t.slice(i, i + 2800)
);
console.log("wrote", i);
