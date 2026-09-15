(function liftInputsAboveKeyboard() {
        function isField(el) {
          if (!el || el.tagName !== "INPUT") return false;
          var loc = el.getAttribute("data-loc") || "";
          return /EnglishName\.tsx:(607|619|631|652|668|684)/.test(loc);
        }
        function lift(el) {
          if (!isField(el)) return;
          var vv = window.visualViewport;
          var vh = vv ? vv.height : window.innerHeight;
          var off = vv ? vv.offsetTop : 0;
          var r = el.getBoundingClientRect();
          var target = off + Math.max(48, vh * 0.12);
          var delta = r.top - target;
          if (Math.abs(delta) > 4) {
            var top = Math.max(0, (window.scrollY || document.documentElement.scrollTop || 0) + delta);
            document.documentElement.scrollTop = top;
            window.scrollTo(0, top);
          }
        }
        document.addEventListener("pointerdown", function (e) {
          if (isField(e.target)) document.documentElement.classList.add("kb-open");
        }, true);
        document.addEventListener("focusin", function (e) {
          if (!isField(e.target)) return;
          document.documentElement.classList.add("kb-open");
          setTimeout(function () { lift(e.target); }, 50);
          setTimeout(function () { lift(e.target); }, 280);
          setTimeout(function () { lift(e.target); }, 550);
        });
        document.addEventListener("focusout", function () {
          setTimeout(function () {
            if (!isField(document.activeElement)) document.documentElement.classList.remove("kb-open");
          }, 0);
        });
        if (window.visualViewport) {
          window.visualViewport.addEventListener("resize", function () {
            if (isField(document.activeElement)) lift(document.activeElement);
          });
        }
      })();