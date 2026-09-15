const fs=require('fs'); const vm=require('vm');
const s=fs.readFileSync(process.argv[1],'utf8');
try { new vm.Script(s,{filename:'en.js'}); console.log('OK'); }
catch(e) { console.log(String(e.message).slice(0,300)); const m=/:(\d+):(\d+)/.exec(e.stack||''); if(m) console.log('loc', m[1], m[2]); }
