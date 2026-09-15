# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(r"C:\Users\a8071\Projects\nameanalyz\english\index.html")
s = p.read_text(encoding="utf-8")

old_style = """    <style>
      .intro-sec{padding:14px 12px;margin-bottom:1rem;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:12px;text-align:center;}
      .intro-ttl{font-size:14px;font-weight:700;color:#6d28d9;letter-spacing:1px;margin-bottom:10px;}
      .intro-langs{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;}
      .intro-btn{padding:8px 14px;min-height:40px;font-size:13px;font-weight:700;border:1px solid #ddd6fe;border-radius:8px;background:#fff;color:#5b21b6;cursor:pointer;font-family:inherit;}
      .intro-btn.on{background:#7c3aed;color:#fff;border-color:#6d28d9;}
      .intro-player{margin-top:12px;border-radius:8px;overflow:hidden;background:#000;}
      .intro-player video{width:100%;height:auto;display:block;vertical-align:top;}
    </style>"""

new_style = """    <style>
      html,body{margin:0;padding:0;width:100%;max-width:100%;overflow-x:hidden;}
      *,*::before,*::after{box-sizing:border-box;}
      [data-loc="client/src/pages/EnglishName.tsx:564"]{width:100%;max-width:100%;overflow-x:hidden;}
      [data-loc="client/src/pages/EnglishName.tsx:566"]{flex-wrap:wrap;gap:8px;box-sizing:border-box;}
      [data-loc="client/src/pages/EnglishName.tsx:567"]{min-width:0;flex:1 1 auto;flex-wrap:wrap;}
      [data-loc="client/src/pages/EnglishName.tsx:568"]{font-size:1.05rem !important;line-height:1.3 !important;white-space:normal !important;}
      [data-loc="client/src/pages/EnglishName.tsx:595"]{
        width:100% !important;max-width:800px !important;
        margin-left:auto !important;margin-right:auto !important;
        box-sizing:border-box !important;
      }
      .intro-sec{padding:14px 12px;margin-bottom:1rem;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:12px;text-align:center;}
      .intro-ttl{font-size:14px;font-weight:700;color:#6d28d9;letter-spacing:1px;margin-bottom:10px;}
      .intro-langs{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;}
      .intro-btn{padding:8px 14px;min-height:40px;font-size:13px;font-weight:700;border:1px solid #ddd6fe;border-radius:8px;background:#fff;color:#5b21b6;cursor:pointer;font-family:inherit;}
      .intro-btn.on{background:#7c3aed;color:#fff;border-color:#6d28d9;}
      .intro-player{margin-top:12px;border-radius:8px;overflow:hidden;background:#000;}
      .intro-player video{width:100%;height:auto;display:block;vertical-align:top;}
      @media (max-width:640px){
        [data-loc="client/src/pages/EnglishName.tsx:602"],
        [data-loc="client/src/pages/EnglishName.tsx:646"]{grid-template-columns:1fr !important;}
        [data-loc="client/src/pages/EnglishName.tsx:604"],
        [data-loc="client/src/pages/EnglishName.tsx:616"]{white-space:normal !important;}
        [data-loc="client/src/pages/EnglishName.tsx:1052"],
        [data-loc="client/src/pages/EnglishName.tsx:1092"]{grid-template-columns:1fr 1fr !important;}
      }
    </style>"""

if old_style not in s:
    raise SystemExit("style block not found")
s = s.replace(old_style, new_style, 1)

intro_js = r'''
    <script>
      window.playIntro = function (lang) {
        var files = {
          ko: "이름풀이_한국어단독_39초_볼륨업3.mp4",
          en: "영어이름풀이_영어단독_21초_볼륨업4.mp4"
        };
        var wrap = document.getElementById("introPlayerWrap");
        var v = document.getElementById("introVideo");
        var btns = document.querySelectorAll(".intro-btn");
        if (!wrap || !v || !files[lang]) return false;
        for (var i = 0; i < btns.length; i++) {
          btns[i].classList.toggle("on", btns[i].getAttribute("data-lang") === lang);
        }
        v.muted = true;
        v.playsInline = true;
        v.setAttribute("playsinline", "");
        v.setAttribute("webkit-playsinline", "");
        function start() {
          v.muted = true;
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        }
        if (v.getAttribute("data-lang") !== lang) {
          v.setAttribute("data-lang", lang);
          v.src = "/nameanalyz/videos/" + encodeURIComponent(files[lang]);
          v.onloadeddata = start;
        } else {
          try { v.currentTime = 0; } catch (e) {}
          start();
        }
        return true;
      };
      (function startIntroOnOpen() {
        function tryStart() {
          var v = document.getElementById("introVideo");
          if (!v) return false;
          if (v.getAttribute("data-lang") && v.getAttribute("src")) return true;
          return window.playIntro("en");
        }
        if (tryStart()) return;
        var obs = new MutationObserver(function () {
          if (tryStart()) obs.disconnect();
        });
        obs.observe(document.documentElement, { childList: true, subtree: true });
        setTimeout(function () { obs.disconnect(); }, 15000);
      })();
    </script></body>'''

if "window.playIntro" in s:
    print("playIntro already present")
else:
    needle = "		</script></body>"
    if needle not in s:
        raise SystemExit("body close not found")
    s = s.replace(needle, "		</script>" + intro_js, 1)

p.write_text(s, encoding="utf-8")
print("english/index.html patched", "playIntro" in s)
