const fs = require("fs");
const t = fs.readFileSync("C:/Users/a8071/Projects/nameanalyz/assets/index-eTNXNndF.js", "utf8");
const i = t.indexOf("EnglishName.tsx:1068");
console.log(t.slice(i - 20, i + 550));
const j = t.indexOf("[tip,setTip]");
console.log("tip state", j);
const k = t.indexOf("EnglishName.tsx:tipMask");
console.log("mask", t.slice(k, k + 200));
