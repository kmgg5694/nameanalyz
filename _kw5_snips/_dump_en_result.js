const fs = require("fs");
const en = fs.readFileSync("C:/Users/a8071/Projects/nameanalyz/assets/index-eTNXNndF.js", "utf8");
const i = en.indexOf("이름풀이 요약보기");
// walk back to find function start / useState cluster
const start = en.lastIndexOf("function ", i);
fs.writeFileSync(
  "C:/Users/a8071/Projects/nameanalyz/_kw5_snips/en_result_head.txt",
  en.slice(start, start + 900)
);
const r = en.lastIndexOf("return E.jsxs", i);
fs.writeFileSync(
  "C:/Users/a8071/Projects/nameanalyz/_kw5_snips/en_result_ret.txt",
  en.slice(Math.max(0, r - 200), i + 80)
);
console.log("fn", start, en.slice(start, start + 80));
console.log("return", r);
// find desc fields
console.log("wonData.desc", en.includes("wonData"));
const d1 = en.indexOf("Y.desc");
const d2 = en.indexOf(".shortDesc");
console.log("Y.desc", d1, "shortDesc", d2);
const g = en.indexOf("K.desc");
console.log("K.desc", g);
// function de and H
const de = en.indexOf("function de(");
const H = en.indexOf("function H(");
console.log("de", de, en.slice(de, de + 120));
console.log("H", H, en.slice(H, H + 120));
