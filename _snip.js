const fs = require('fs');
for (const fn of ['index-kw5.js', 'index-eTNXNndF.js']) {
  const s = fs.readFileSync('assets/' + fn, 'utf8');
  console.log('===', fn, '===');
  console.log('bn scroll:', s.includes('bn=()=>{t.name.trim().length<2||(ao(!0),a("result"),setTimeout'));
  console.log('ae scroll:', s.includes('ne.mutate({last:n.trim(),first:s.trim(),middle:u.trim()||void 0}),setTimeout(()=>{var el=document.getElementById("result-full-capture")'));
  console.log('en result id:', s.includes('EnglishName.tsx:723",id:"result-full-capture"'));
}
