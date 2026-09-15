const fs = require("fs");
const p = "C:/Users/a8071/Projects/nameanalyz/assets/index-kw5.js";
let t = fs.readFileSync(p, "utf8");
if (t.includes("Home.tsx:sumAge")) {
  console.log("already patched");
  process.exit(0);
}

const iife = '(()=>{const ho=vo=>vo==="taboo"||vo==="bad"||vo==="caution"?"#cc0000":"#1c1917",bo=vo=>vo?vo.isTaboo?"#cc0000":vo.isBest?"#1a56db":"#1c1917":"#1c1917",fmtNm=';
if (!t.includes(iife)) throw new Error("iife head missed");
t = t.replace(
  iife,
  '(()=>{const ho=vo=>vo==="taboo"||vo==="bad"||vo==="caution"?"#cc0000":"#1c1917",bo=vo=>vo?vo.isTaboo?"#cc0000":vo.isBest?"#1a56db":"#1c1917":"#1c1917",sAge=["1~23세","24~40세","41~55세","56세~"],gAge=["1~30세","31~50세","51~55세","56세~"],ageSt={display:"block",fontSize:"8px",fontWeight:600,color:"#78716c",marginTop:"1px",whiteSpace:"nowrap",letterSpacing:"-0.2px"},oneNm=n=>String(n||"").replace(/\\([^)]*\\)/g,"").replace(/\\s+/g,"").trim()||"-",fmtNm='
);

const heads = [
  ['children:"원(元)"', 'children:"초년"'],
  ['children:"형(亨)"', 'children:"장년"'],
  ['children:"이(利)"', 'children:"중년"'],
  ['children:"정(貞)"', 'children:"말년"'],
];
for (const [a, b] of heads) {
  const i = t.indexOf(a);
  if (i < 0) throw new Error("head missed " + a);
  // only first in Home summary: 1128-1131
  t = t.replace(a, b);
}

t = t.replace('children:"한글수리"', 'children:"이름 - 수리"');
t = t.replace('children:"한글주역"', 'children:"이름 - 주역"');

const suriOld = 'children:snBtn(vo.suri+"수 · "+String(vo.data.name||"").replace(/\\([^)]*\\)/g,""),vo.data.desc||vo.data.shortDesc||"",ho(vo.data.type),fmtNm(vo.data.name).map((nm,ii)=>m.jsx("span",{style:{display:"block",whiteSpace:"nowrap",textDecoration:"underline",textUnderlineOffset:"2px"},children:nm},ii)))}';
const suriNew = 'children:[snBtn(vo.suri+"수 · "+oneNm(vo.data.name),vo.data.desc||vo.data.shortDesc||"",ho(vo.data.type),oneNm(vo.data.name)),m.jsx("span",{"data-loc":"client/src/pages/Home.tsx:sumAge",style:ageSt,children:sAge[Xo]})]}';
if (!t.includes(suriOld)) {
  // try without extra escapes as they appear in file
  const suriOld2 = 'children:snBtn(vo.suri+"수 · "+String(vo.data.name||"").replace(/\\([^)]*\\)/g,""),vo.data.desc||vo.data.shortDesc||"",ho(vo.data.type),fmtNm(vo.data.name).map((nm,ii)=>m.jsx("span",{style:{display:"block",whiteSpace:"nowrap",textDecoration:"underline",textUnderlineOffset:"2px"},children:nm},ii)))}';
  console.log("suriOld found", t.includes(suriOld), "suri in file sample search");
}

// Search live snippet
const si = t.indexOf("fmtNm(vo.data.name).map");
console.log("fmtNm map idx", si, t.slice(si - 160, si + 220));
