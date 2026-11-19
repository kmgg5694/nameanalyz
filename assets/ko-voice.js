/* 이름풀이 결과 소리로 듣기 (휴대폰 내장 음성, 무료) — 풍백테크 */
(function () {
  "use strict";
  if (!("speechSynthesis" in window)) return;
  var RATE = 1, ON = false, Q = [];
  try { RATE = +localStorage.getItem("na_tts_rate") || 1; } catch (e) {}
  var RATES = [[0.8, "느리게"], [1, "보통"], [1.2, "빠르게"]];

  var css = document.createElement("style");
  css.textContent =
    "#naTts{position:fixed;right:12px;bottom:84px;z-index:9998;display:none;flex-direction:column;gap:6px;align-items:flex-end}" +
    "#naTts button{font-family:inherit;border:0;border-radius:999px;box-shadow:0 4px 14px rgba(0,0,0,.35);cursor:pointer;font-weight:900}" +
    "#naTtsBtn{background:#22a35a;color:#fff;font-size:18px;padding:14px 20px;min-height:56px}" +
    "#naTtsBtn.on{background:#d93025}" +
    "#naTtsRate{background:#fff;color:#1e2a4a;font-size:14px;padding:8px 14px;border:2px solid #1e2a4a!important}" +
    "@media print{#naTts{display:none!important}}";
  document.head.appendChild(css);

  var box = document.createElement("div");
  box.id = "naTts";
  box.innerHTML = '<button type="button" id="naTtsRate"></button><button type="button" id="naTtsBtn">🔊 소리로 듣기</button>';
  document.body.appendChild(box);
  var btn = box.querySelector("#naTtsBtn"), rb = box.querySelector("#naTtsRate");
  function rateLabel() { for (var i = 0; i < RATES.length; i++) if (RATES[i][0] === RATE) return RATES[i][1]; return "보통"; }
  rb.textContent = "빠르기: " + rateLabel();

  function voice() {
    var vs = speechSynthesis.getVoices().filter(function (v) { return /ko/i.test(v.lang); });
    for (var i = 0; i < vs.length; i++) if (/google|yuna|heami|sunhi|female/i.test(vs[i].name)) return vs[i];
    return vs[0] || null;
  }
  function clean(s) {
    return String(s)
      .replace(/\(([^()]*[㐀-鿿][^()]*)\)/g, "")      // (洪吉童) (土) 같은 한자 괄호 빼기
      .replace(/[㐀-鿿]+/g, "")                          // 남은 한자
      .replace(/(\d+)\s*~\s*(\d+)/g, "$1에서 $2")
      .replace(/(\d+)세\s*~/g, "$1세 이후")
      .replace(/⚠️?|🚨/g, " 주의, ")
      .replace(/[▪·•→←↔|]/g, " ")
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, " ")
      .replace(/[ \t]+/g, " ").trim();
  }
  function split(t) {
    var out = [];
    String(t).split(/\n+/).forEach(function (para) {
      para.split(/(?<=[.!?])\s+/).forEach(function (x) { x = clean(x); if (x && /[가-힣0-9]/.test(x)) out.push(x); });
    });
    return out;
  }
  function root() { return document.getElementById("result-full-capture"); }
  function collect() {
    var R = root(); if (!R) return [];
    var L = [], name = "";
    var ni = document.getElementById("koNameInput");
    var h = R.querySelector(".text-4xl"); name = (h && h.innerText.trim()) || (ni && ni.value.trim()) || "";
    L.push((name ? name + "님의 " : "") + "이름풀이를 읽어 드리겠습니다.");
    var all = R.querySelectorAll("div,p");
    var seen = {};
    function add(t) { split(t).forEach(function (x) { if (!seen[x]) { seen[x] = 1; L.push(x); } }); }
    // 1) 총평 한 줄
    function deepest(re) { var best = null; for (var q = 0; q < all.length; q++) { var tx = (all[q].innerText || "").trim(); if (re.test(tx) && (!best || tx.length <= best.length)) best = tx; } return best; }
    var i, s, v1 = deepest(/^이 이름과 사주를 보니/); if (v1) add(v1);
    // 2) 주의 시기
    var pc = document.getElementById("pr-card-capture");
    if (pc) {
      var lines = pc.innerText.split("\n").map(function (s) { return s.trim(); });
      var k = lines.indexOf("🚨 주의 시기");
      if (k >= 0) { add("주의 시기입니다."); for (var j = k + 1; j < lines.length && j < k + 8; j++) { if (/^본 분석은/.test(lines[j])) break; add(lines[j]); } }
    }
    // 3) 본 풀이
    var nar = R.querySelector(".ko-sum-narr");
    if (nar) {
      nar.innerText.split(/\n+/).forEach(function (p) {
        if (/^이름, 사주풀이표에 나온|요약보기에 밑줄/.test(p.trim())) return;
        add(p);
      });
    }
    // 4) 인덕·배우자·자녀·재물
    for (i = 0; i < all.length; i++) { s = (all[i].innerText || "").trim(); if (all[i].children.length === 0 && (/^[1-4]\. (인덕|배우자운|자녀운|재물운)/.test(s) || /^· (이름|사주)재물운/.test(s))) add(s.replace(/^\d\.\s*/, "")); }
    // 5) 이 이름에 해당
    var v5 = deepest(/^이 이름에 해당:/); if (v5) add(v5.split("\n")[0]);
    L.push("자세한 이름풀이와 작명 의뢰는 공일공, 오육구사, 칠팔일칠 로 연락 주세요.");
    return L;
  }
  function stop() { ON = false; Q = []; try { speechSynthesis.cancel(); } catch (e) {} btn.textContent = "🔊 소리로 듣기"; btn.classList.remove("on"); }
  function next() {
    if (!ON) return; var t = Q.shift(); if (t == null) { stop(); return; }
    var u = new SpeechSynthesisUtterance(t); u.lang = "ko-KR"; u.rate = RATE; var v = voice(); if (v) u.voice = v;
    u.onend = next; u.onerror = next; speechSynthesis.speak(u);
  }
  function start() {
    Q = collect(); if (!Q.length) return;
    try { var iv = document.getElementById("introVideo"); if (iv) iv.muted = true; } catch (e) {}
    ON = true; speechSynthesis.cancel(); btn.textContent = "⏹ 그만 듣기"; btn.classList.add("on"); setTimeout(next, 150);
  }
  btn.onclick = function () { ON ? stop() : start(); };
  rb.onclick = function () {
    var i = 0; for (; i < RATES.length; i++) if (RATES[i][0] === RATE) break;
    RATE = RATES[(i + 1) % RATES.length][0]; try { localStorage.setItem("na_tts_rate", RATE); } catch (e) {}
    rb.textContent = "빠르기: " + rateLabel(); if (ON) { stop(); start(); }
  };
  speechSynthesis.getVoices();
  // 결과 화면이 보일 때만 버튼 표시, 결과가 바뀌면 읽기 멈춤
  var last = null;
  setInterval(function () {
    var R = root(); var vis = !!(R && R.offsetParent !== null);
    box.style.display = vis ? "flex" : "none";
    var sig = R ? (R.innerText || "").length : 0;
    if (ON && (!vis || (last !== null && sig !== last))) stop();
    last = sig;
  }, 700);
  window.addEventListener("beforeunload", function () { try { speechSynthesis.cancel(); } catch (e) {} });
})();
