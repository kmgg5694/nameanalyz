const fs = require('fs');
const s = fs.readFileSync('assets/index-kw5.js', 'utf8');
const i = s.indexOf('function j6(){');
const chunk = s.slice(i, i + 3000);
const idx = chunk.indexOf('useRef');
console.log(chunk.slice(idx - 20, idx + 120));
