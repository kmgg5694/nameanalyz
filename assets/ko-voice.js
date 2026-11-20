/* 이름풀이 결과 소리로 듣기 (휴대폰 내장 음성, 무료) — 풍백테크 */
(function () {
  "use strict";
  var HAS = !!window.speechSynthesis;
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
  function inApp() { return /KAKAOTALK|NAVER\(inapp|Instagram|FBAN|FBAV|Line\/|DaumApps|; wv\)/i.test(navigator.userAgent); }
  function openExternal() {
    var url = location.href;
    if (/KAKAOTALK/i.test(navigator.userAgent)) { location.href = "kakaotalk://web/openExternal?url=" + encodeURIComponent(url); return; }
    if (/Android/i.test(navigator.userAgent)) { location.href = "intent://" + url.replace(/^https?:\/\//, "") + "#Intent;scheme=https;package=com.android.chrome;end"; return; }
    alert("오른쪽 위 메뉴에서 [Safari로 열기] 또는 [다른 브라우저로 열기]를 눌러 주세요.");
  }
  function help() {
    var msg = (inApp() || !HAS ? "카톡·네이버 같은 앱 안에서 열린 화면에서는 휴대폰 음성 기능이 막혀 있습니다.\n크롬(또는 삼성 인터넷)으로 열면 소리가 나옵니다.\n\n[확인]을 누르면 크롬으로 엽니다.\n\n" : "") +
      "그래도 소리가 안 나면:\n① 휴대폰 볼륨(소리) 버튼을 올려 주세요(무음·진동이면 안 납니다).\n② [설정] → [일반] → [텍스트 음성 변환(TTS)]에서 언어를 한국어, 엔진을 삼성 또는 구글로 맞춰 주세요.";
    if (inApp() || !HAS) { if (confirm(msg)) openExternal(); } else alert(msg);
  }
  var OK = false, WL = null, KA = null, CUR = null;
  function wake(on) {
    try {
      if (on) { if ("wakeLock" in navigator && !WL) navigator.wakeLock.request("screen").then(function (l) { WL = l; l.addEventListener("release", function () { WL = null; }); }).catch(function () {}); }
      else if (WL) { WL.release().catch(function () {}); WL = null; }
    } catch (e) {}
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && ON) {
      wake(true);
      setTimeout(function () { try { if (ON && !speechSynthesis.speaking && !speechSynthesis.pending) { if (CUR) Q.unshift(CUR); next(); } else speechSynthesis.resume(); } catch (e) {} }, 300);
    }
  });
  function stop() { wake(false); if (KA) { clearInterval(KA); KA = null; } CUR = null; ON = false; Q = []; try { if (HAS) speechSynthesis.cancel(); } catch (e) {} btn.textContent = "🔊 소리로 듣기"; btn.classList.remove("on"); }
  function next() {
    if (!ON) return; var t = Q.shift(); if (t == null) { stop(); return; } CUR = t;
    var u = new SpeechSynthesisUtterance(t); u.lang = "ko-KR"; u.rate = RATE; u.volume = 1; var v = voice(); if (v) u.voice = v;
    u.onstart = function () { OK = true; }; u.onend = function () { CUR = null; next(); };
    u.onerror = function (e) { if (e && !OK && /not-allowed|synthesis-unavailable|audio-hardware/.test(e.error || "")) { stop(); help(); return; } next(); };
    try { speechSynthesis.resume(); } catch (e) {} speechSynthesis.speak(u);
  }
  function start() {
    if (!HAS) { help(); return; }
    Q = collect(); if (!Q.length) return; OK = false;
    try { var iv = document.getElementById("introVideo"); if (iv) iv.muted = true; } catch (e) {}
    ON = true; try { if (speechSynthesis.speaking || speechSynthesis.pending) speechSynthesis.cancel(); } catch (e) {}
    btn.textContent = "⏹ 그만 듣기"; btn.classList.add("on"); wake(true);
    if (KA) clearInterval(KA); KA = setInterval(function () { try { if (ON && speechSynthesis.speaking) speechSynthesis.resume(); } catch (e) {} }, 5000);
    next();
    setTimeout(function () { if (ON && !OK && !speechSynthesis.speaking) { stop(); help(); } }, 4000);
  }
  btn.onclick = function () { ON ? stop() : start(); };
  rb.onclick = function () {
    var i = 0; for (; i < RATES.length; i++) if (RATES[i][0] === RATE) break;
    RATE = RATES[(i + 1) % RATES.length][0]; try { localStorage.setItem("na_tts_rate", RATE); } catch (e) {}
    rb.textContent = "빠르기: " + rateLabel(); if (ON) { stop(); start(); }
  };
  try { if (HAS) speechSynthesis.getVoices(); } catch (e) {}
  // 결과 화면이 보일 때만 버튼 표시, 결과가 바뀌면 읽기 멈춤
  var last = null;
  setInterval(function () {
    var R = root(); var vis = !!(R && R.offsetParent !== null);
    box.style.display = vis ? "flex" : "none";
    var sig = R ? (R.innerText || "").length : 0;
    if (ON && !R) stop();
    last = sig;
  }, 700);
  window.addEventListener("beforeunload", function () { try { if (HAS) speechSynthesis.cancel(); } catch (e) {} });
})();
