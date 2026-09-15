
const ax=s=>{s=String(s||"").replace(/\s+/g," ").trim();if(!s)return"";const parts=s.split(/(?<=다)\s+|(?<=요)\s+|(?<=까)\s+|(?<=[.!?。])\s+/).map(x=>x.trim()).filter(Boolean);let out=(parts.length?parts.slice(0,2):[s]).join(" ").trim();if(out.length>90){let cut=out.slice(0,88);const k=Math.max(cut.lastIndexOf("다"),cut.lastIndexOf("요"),cut.lastIndexOf("까"),cut.lastIndexOf(" "));cut=(k>28?cut.slice(0,k+(cut[k]==="다"||cut[k]==="요"||cut[k]==="까"?1:0)):cut).trim();if(!/[다요까임.]/.test(cut.slice(-1)))cut+="…";out=cut}return out};
const long="산을 찌렁 찌렁 울릴 정도의 큰 우뢰 소리에 모두 놀라 우뢰가 떨어진 곳을 가보니 큰 변화가 일어난다. 이어서 긴 설명이 더 붙는다. 세 번째 문장은 잘리면 안 된다.";
console.log(ax(long));
console.log("len", ax(long).length);
