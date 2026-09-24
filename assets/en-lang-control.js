/**
 * English page — language + intro video (single source of truth).
 * React UI must call window.enLang.set("ko"|"en") / .get()
 * Video is owned here only (not by React).
 */
(function () {
  "use strict";

  var KEY = "na_en_lang";
  var FILES = {
    ko: "이름풀이_한국어단독.mp4",
    en: "영어이름풀이_영어단독.mp4",
  };
  var VIDEO_BASE = "https://kmgg5694.github.io/nameanalyz/videos/";

  var reactSetter = null;
  var current = "en";

  function readStored() {
    try {
      var s = sessionStorage.getItem(KEY);
      if (s === "ko" || s === "en") return s;
    } catch (e) {}
    return "en";
  }

  function writeStored(lang) {
    try {
      sessionStorage.setItem(KEY, lang);
    } catch (e) {}
    try {
      document.documentElement.setAttribute("data-na-lang", lang);
    } catch (e) {}
  }

  function ensureVideo() {
    var wrap = document.getElementById("introPlayerWrap");
    if (!wrap) return null;
    var v = document.getElementById("introVideo");
    if (!v) {
      v = document.createElement("video");
      v.id = "introVideo";
      v.controls = true;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      v.setAttribute("webkit-playsinline", "");
      v.muted = true;
      v.preload = "auto";
      v.style.width = "100%";
      v.style.display = "block";
      wrap.innerHTML = "";
      wrap.appendChild(v);
    }
    return v;
  }

  function play(lang) {
    if (lang !== "ko" && lang !== "en") lang = "en";
    var v = ensureVideo();
    if (!v) return false;
    function start() {
      v.muted = !window.__introWantSound;
      if (window.__introWantSound) {
        try {
          v.volume = 1;
        } catch (e) {}
      }
      var p = v.play();
      if (p && p.catch) {
        p.catch(function () {
          v.muted = true;
          window.__introWantSound = false;
          var p2 = v.play();
          if (p2 && p2.catch) p2.catch(function () {});
        });
      }
    }
    if (v.getAttribute("data-lang") !== lang) {
      v.setAttribute("data-lang", lang);
      v.src = VIDEO_BASE + encodeURIComponent(FILES[lang]);
      v.onloadeddata = start;
    } else {
      try {
        v.currentTime = 0;
      } catch (e) {}
      start();
    }
    return true;
  }

  /** Set UI language + video together. */
  function setLang(lang) {
    if (lang !== "ko" && lang !== "en") lang = "en";
    current = lang;
    writeStored(lang);
    if (typeof reactSetter === "function") {
      try {
        reactSetter(lang);
      } catch (e) {}
    }
    play(lang);
    return lang;
  }

  function getLang() {
    return current;
  }

  /** React calls this once with its setState. */
  function bindReact(setter) {
    reactSetter = setter;
    // Push current stored lang into React on bind
    var lang = readStored();
    current = lang;
    writeStored(lang);
    try {
      setter(lang);
    } catch (e) {}
    // Start video after wrap exists
    var n = 0;
    (function waitWrap() {
      if (ensureVideo()) {
        play(lang);
        return;
      }
      if (++n < 50) setTimeout(waitWrap, 100);
    })();
  }

  // Rebind header pills if React recreated them (event delegation — never lost)
  document.addEventListener(
    "click",
    function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      var btn = t.closest("[data-loc='client/src/pages/EnglishName.tsx:578'],[data-loc='client/src/pages/EnglishName.tsx:578b']");
      if (!btn) return;
      ev.preventDefault();
      ev.stopPropagation();
      var loc = btn.getAttribute("data-loc") || "";
      if (loc.indexOf("578b") >= 0) setLang("en");
      else setLang("ko");
    },
    true
  );

  window.enLang = {
    get: getLang,
    set: setLang,
    play: play,
    bindReact: bindReact,
  };
  // Back-compat for older calls
  window.playIntro = function (lang) {
    return play(lang === "ko" ? "ko" : "en");
  };

  current = readStored();
  writeStored(current);
})();
