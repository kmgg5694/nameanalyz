const fs = require("fs");
const en = fs.readFileSync("C:/Users/a8071/Projects/nameanalyz/assets/index-eTNXNndF.js", "utf8");
const i = en.indexOf("function dy()");
const body = en.slice(i, i + 45000);
fs.writeFileSync("C:/Users/a8071/Projects/nameanalyz/_kw5_snips/en_dy_45k.txt", body);
const hits = [];
for (const k of ["const de=", "de=(", "function de", "const H=", "H=(", ".desc", "shortDesc", "gwe.desc", "wonData"]) {
  let p = 0, n = 0;
  while ((p = body.indexOf(k, p)) >= 0 && n < 3) {
    hits.push(k + " @" + p + " " + body.slice(p, p + 100).replace(/\n/g, " "));
    p += k.length;
    n++;
  }
}
fs.writeFileSync("C:/Users/a8071/Projects/nameanalyz/_kw5_snips/en_dy_hits.txt", hits.join("\n"));
console.log(hits.join("\n"));
