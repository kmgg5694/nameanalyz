const fs = require("fs");
const p = "C:/Users/a8071/Projects/nameanalyz/assets/index-eTNXNndF.js";
let t = fs.readFileSync(p, "utf8");
if (t.includes("EnglishName.tsx:tipMask")) {
  console.log("already patched");
  process.exit(0);
}

const a = '[q,ee]=j.useState(!1),ne=$f.name.toHangul.useMutation';
const a2 = '[q,ee]=j.useState(!1),[tip,setTip]=j.useState(null),ne=$f.name.toHangul.useMutation';
if (!t.includes(a)) throw new Error("useState insert missed");
t = t.replace(a, a2);

const overlay =
  `tip&&E.jsx("div",{"data-loc":"client/src/pages/EnglishName.tsx:tipMask",onClick:()=>setTip(null),style:{position:"fixed",inset:0,zIndex:80,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1.2rem"},children:E.jsxs("div",{onClick:x=>x.stopPropagation(),style:{background:"#faf5ff",border:"2px solid #7c3aed",borderRadius:"0.75rem",maxWidth:"28rem",width:"100%",maxHeight:"80vh",overflow:"auto",padding:"1rem 1.1rem"},children:[E.jsx("div",{style:{fontWeight:700,fontSize:"1.05rem",color:tip.col||"#5b21b6",marginBottom:"0.5rem"},children:tip.ttl}),E.jsx("p",{style:{fontSize:"0.9rem",lineHeight:1.7,color:"#1c1917",margin:0,whiteSpace:"pre-wrap"},children:tip.bdy||(S?"해설이 없습니다.":"No commentary available.")}),E.jsx("button",{type:"button",onClick:()=>setTip(null),style:{marginTop:"0.9rem",width:"100%",padding:"0.55rem",borderRadius:"0.45rem",border:"none",background:"#7c3aed",color:"#fff",fontWeight:700,cursor:"pointer"},children:S?"닫기":"Close"})]})}),`;

const b = 'return E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:564",style:{minHeight:"100vh",backgroundColor:"#ffffff",fontFamily:\'"Noto Serif KR", serif\'},children:[';
if (!t.includes(b)) throw new Error("564 insert missed");
t = t.replace(b, b + overlay);

const c = 'children:["📋 ",S?"이름풀이 요약보기":"Reading Summary"]}),E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:1048"';
const c2 = 'children:["📋 ",S?"이름풀이 요약보기":"Reading Summary"]}),E.jsx("p",{"data-loc":"client/src/pages/EnglishName.tsx:1043n",style:{fontSize:"0.8rem",color:"#6d28d9",margin:"-0.35rem 0 0.75rem",lineHeight:1.55},children:S?"요약보기의 밑줄 친 수리와 주역괘를 누르면 뜻을 전부 볼 수 있습니다.":"Tap an underlined number name or hexagram to read the full meaning."}),E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:1048"';
if (!t.includes(c)) throw new Error("hint insert missed");
t = t.replace(c, c2);

const name1068 = 'E.jsx("div",{"data-loc":"client/src/pages/EnglishName.tsx:1068",style:{fontSize:"0.75rem",color:I?"#FF0000":"#000000",marginBottom:"0.3rem"},children:S?Y.name:de(N,Y.name)})';
const name1068b = 'E.jsx("button",{type:"button","data-loc":"client/src/pages/EnglishName.tsx:1068",onClick:()=>setTip({ttl:S?N+"수 · "+Y.name:"No."+N+" · "+de(N,Y.name),bdy:(S?Y.desc:C(N)&&C(N).descEn||Y.desc)||Y.shortDesc||"",col:I?"#FF0000":"#5b21b6"}),style:{fontSize:"0.75rem",color:I?"#FF0000":"#000000",marginBottom:"0.3rem",background:"transparent",border:"none",padding:0,cursor:"pointer",textAlign:"left",textDecoration:"underline",textUnderlineOffset:"2px",font:"inherit",fontWeight:700,width:"100%"},children:S?Y.name:de(N,Y.name)})';
if (!t.includes(name1068)) throw new Error("1068 missed");
t = t.replace(name1068, name1068b);

const gwe1072 = 'K&&E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:1072",style:{fontSize:"0.72rem",color:K.isTaboo?"#FF0000":K.isBest?"#0000FF":"#000000",fontWeight:K.isTaboo||K.isBest?700:400},children:[S?K.name:H(K.name,K.id),K.isTaboo&&E.jsxs("span",{"data-loc":"client/src/pages/EnglishName.tsx:1074",children:[" ",S?"⚠흉":"⚠Bad"]}),K.isBest&&E.jsxs("span",{"data-loc":"client/src/pages/EnglishName.tsx:1075",children:[" ",S?"★재물":"★Wealth"]})]})';
const gwe1072b = 'K&&E.jsxs("button",{type:"button","data-loc":"client/src/pages/EnglishName.tsx:1072",onClick:()=>setTip({ttl:S?K.name:H(K.name,K.id),bdy:(S?K.desc:P(K.id)&&P(K.id).descEn||K.desc)||"",col:K.isTaboo?"#FF0000":K.isBest?"#0000FF":"#5b21b6"}),style:{fontSize:"0.72rem",color:K.isTaboo?"#FF0000":K.isBest?"#0000FF":"#000000",fontWeight:K.isTaboo||K.isBest?700:400,background:"transparent",border:"none",padding:0,cursor:"pointer",textAlign:"left",textDecoration:"underline",textUnderlineOffset:"2px",font:"inherit",width:"100%"},children:[S?K.name:H(K.name,K.id),K.isTaboo&&E.jsxs("span",{"data-loc":"client/src/pages/EnglishName.tsx:1074",children:[" ",S?"⚠흉":"⚠Bad"]}),K.isBest&&E.jsxs("span",{"data-loc":"client/src/pages/EnglishName.tsx:1075",children:[" ",S?"★재물":"★Wealth"]})]})';
if (!t.includes(gwe1072)) throw new Error("1072 missed");
t = t.replace(gwe1072, gwe1072b);

const name1108 = 'E.jsx("div",{"data-loc":"client/src/pages/EnglishName.tsx:1108",style:{fontSize:"0.75rem",color:I?"#FF0000":"#000000",marginBottom:"0.3rem"},children:S?Y.name:de(N,Y.name)})';
const name1108b = 'E.jsx("button",{type:"button","data-loc":"client/src/pages/EnglishName.tsx:1108",onClick:()=>setTip({ttl:S?N+"수 · "+Y.name:"No."+N+" · "+de(N,Y.name),bdy:(S?Y.desc:C(N)&&C(N).descEn||Y.desc)||Y.shortDesc||"",col:I?"#FF0000":"#0369a1"}),style:{fontSize:"0.75rem",color:I?"#FF0000":"#000000",marginBottom:"0.3rem",background:"transparent",border:"none",padding:0,cursor:"pointer",textAlign:"left",textDecoration:"underline",textUnderlineOffset:"2px",font:"inherit",fontWeight:700,width:"100%"},children:S?Y.name:de(N,Y.name)})';
if (!t.includes(name1108)) throw new Error("1108 missed");
t = t.replace(name1108, name1108b);

const gwe1112 = 'K&&E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:1112",style:{fontSize:"0.72rem",color:K.isTaboo?"#FF0000":K.isBest?"#0000FF":"#000000",fontWeight:K.isTaboo||K.isBest?700:400},children:[S?K.name:H(K.name,K.id),K.isTaboo&&E.jsxs("span",{"data-loc":"client/src/pages/EnglishName.tsx:1114",children:[" ",S?"⚠흉":"⚠Bad"]}),K.isBest&&E.jsxs("span",{"data-loc":"client/src/pages/EnglishName.tsx:1115",children:[" ",S?"★재물":"★Wealth"]})]})';
const gwe1112b = 'K&&E.jsxs("button",{type:"button","data-loc":"client/src/pages/EnglishName.tsx:1112",onClick:()=>setTip({ttl:S?K.name:H(K.name,K.id),bdy:(S?K.desc:P(K.id)&&P(K.id).descEn||K.desc)||"",col:K.isTaboo?"#FF0000":K.isBest?"#0000FF":"#0369a1"}),style:{fontSize:"0.72rem",color:K.isTaboo?"#FF0000":K.isBest?"#0000FF":"#000000",fontWeight:K.isTaboo||K.isBest?700:400,background:"transparent",border:"none",padding:0,cursor:"pointer",textAlign:"left",textDecoration:"underline",textUnderlineOffset:"2px",font:"inherit",width:"100%"},children:[S?K.name:H(K.name,K.id),K.isTaboo&&E.jsxs("span",{"data-loc":"client/src/pages/EnglishName.tsx:1114",children:[" ",S?"⚠흉":"⚠Bad"]}),K.isBest&&E.jsxs("span",{"data-loc":"client/src/pages/EnglishName.tsx:1115",children:[" ",S?"★재물":"★Wealth"]})]})';
if (!t.includes(gwe1112)) throw new Error("1112 missed");
t = t.replace(gwe1112, gwe1112b);

fs.writeFileSync(p, t);
console.log("patched", t.includes("EnglishName.tsx:tipMask"), t.includes("1043n"));
