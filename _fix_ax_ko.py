# -*- coding: utf-8 -*-
"""Improve ax(): abbreviate ORIGINAL suri/gwe desc to ~2 Korean lines."""
import sys
import subprocess
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

old_ax = (
    'const ax=s=>{s=String(s||"").replace(/\\s+/g," ").trim();if(!s)return"";'
    'const parts=s.match(/[^.!?。]+[.!?。]?/g)||[s];let out=parts.slice(0,2).join("").trim();'
    'if(out.length>110){out=out.slice(0,108);const cut=Math.max(out.lastIndexOf("다"),out.lastIndexOf("요"),out.lastIndexOf("음"),out.lastIndexOf(" "));'
    'if(cut>40)out=out.slice(0,cut+(out[cut]==="다"||out[cut]==="요"||out[cut]==="음"?1:0));'
    'if(!/[다요음임.]$/.test(out))out+="…"}return out}'
)

# Better: split Korean sentences on 다/요/까/다. then take 2; hard cap ~90 chars (~2 mobile lines)
new_ax = (
    'const ax=s=>{s=String(s||"").replace(/\\s+/g," ").trim();if(!s)return"";'
    'const parts=[];let buf="";'
    'for(let i=0;i<s.length;i++){buf+=s[i];'
    'if(/[다요까임]/.test(s[i])&&(i===s.length-1||/[.。\\s]/.test(s[i+1])||/[가-힣]/.test(s[i+1])&&i+1<s.length&&/[.。]/.test(s[i+1]))){parts.push(buf.trim());buf="";i++;while(i<s.length&&/[\\s.。]/.test(s[i]))i++;i--;}'
    'else if(/[.!?。]/.test(s[i])){parts.push(buf.trim());buf=""}}'
    'if(buf.trim())parts.push(buf.trim());'
    'let out=(parts.length?parts.slice(0,2):[s]).join(" ").trim();'
    'if(out.length>90){out=out.slice(0,88);'
    'const cut=Math.max(out.lastIndexOf("다"),out.lastIndexOf("요"),out.lastIndexOf("까"),out.lastIndexOf(" "),out.lastIndexOf(","),out.lastIndexOf("，"));'
    'out=(cut>30?out.slice(0,cut+(out[cut]==="다"||out[cut]==="요"||out[cut]==="까"?1:0)):out).trim();'
    'if(!/[다요까임.…]/.test(out.slice(-1)))out+="…"}'
    'return out}'
)

# The loop logic above is fragile. Use simpler reliable approach:
new_ax = (
    'const ax=s=>{s=String(s||"").replace(/\\s+/g," ").trim();if(!s)return"";'
    'const parts=s.split(/(?<=다)\\s+|(?<=요)\\s+|(?<=까)\\s+|(?<=[.!?。])\\s+/).map(x=>x.trim()).filter(Boolean);'
    'let out=(parts.length?parts.slice(0,2):[s]).join(" ").trim();'
    'if(out.length>90){let cut=out.slice(0,88);'
    'const k=Math.max(cut.lastIndexOf("다"),cut.lastIndexOf("요"),cut.lastIndexOf("까"),cut.lastIndexOf(" "));'
    'cut=(k>28?cut.slice(0,k+(cut[k]==="다"||cut[k]==="요"||cut[k]==="까"?1:0)):cut).trim();'
    'if(!/[다요까임.]/.test(cut.slice(-1)))cut+="…";out=cut}'
    'return out}'
)

if old_ax not in kw:
    # find current ax
    i = kw.find("const ax=s=>")
    Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\ax_now.txt").write_text(kw[i:i+700], encoding="utf-8")
    raise SystemExit("old ax miss — see ax_now.txt")

kw = kw.replace(old_ax, new_ax, 1)
p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-500:])
else:
    print("OK", "parts.slice(0,2)" in kw, "out.length>90" in kw)
    # quick unit test of ax logic via node
    test = r'''
const ax=s=>{s=String(s||"").replace(/\s+/g," ").trim();if(!s)return"";const parts=s.split(/(?<=다)\s+|(?<=요)\s+|(?<=까)\s+|(?<=[.!?。])\s+/).map(x=>x.trim()).filter(Boolean);let out=(parts.length?parts.slice(0,2):[s]).join(" ").trim();if(out.length>90){let cut=out.slice(0,88);const k=Math.max(cut.lastIndexOf("다"),cut.lastIndexOf("요"),cut.lastIndexOf("까"),cut.lastIndexOf(" "));cut=(k>28?cut.slice(0,k+(cut[k]==="다"||cut[k]==="요"||cut[k]==="까"?1:0)):cut).trim();if(!/[다요까임.]/.test(cut.slice(-1)))cut+="…";out=cut}return out};
const long="산을 찌렁 찌렁 울릴 정도의 큰 우뢰 소리에 모두 놀라 우뢰가 떨어진 곳을 가보니 큰 변화가 일어난다. 이어서 긴 설명이 더 붙는다. 세 번째 문장은 잘리면 안 된다.";
console.log(ax(long));
console.log("len", ax(long).length);
'''
    Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\_test_ax.js").write_text(test, encoding="utf-8")
    r2 = subprocess.run(["node", r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\_test_ax.js"], capture_output=True, text=True)
    print(r2.stdout)
    print(r2.stderr)
