/* ==========================================================================
   Homepage scene behaviour:
     1. tooltips + keyboard access for the clickable illustrated objects
     2. optional raster override — drop assets/hero.webp|png to use the
        original illustration instead of the vector scene
   ========================================================================== */

(function () {
  "use strict";

  /* ---- 1. Illustrated object hotspots ----------------------------------- */

  function initHotspots() {
    var scene = document.querySelector(".scene");
    if (!scene) return;

    var spots = scene.querySelectorAll(".hotspot");
    if (!spots.length) return;

    var tip = document.createElement("div");
    tip.className = "tip";
    tip.setAttribute("role", "tooltip");
    tip.id = "scene-tip";
    scene.appendChild(tip);

    var hideTimer = null;

    function show(spot) {
      clearTimeout(hideTimer);
      var title = spot.getAttribute("data-title") || "";
      var sub   = spot.getAttribute("data-sub") || "";
      var cta   = spot.getAttribute("data-cta") || "View →";

      tip.innerHTML =
        '<div class="tip__title"></div>' +
        (sub ? '<div class="tip__sub"></div>' : "") +
        '<div class="tip__cta"></div>';
      tip.querySelector(".tip__title").textContent = title;
      if (sub) tip.querySelector(".tip__sub").textContent = sub;
      tip.querySelector(".tip__cta").textContent = cta;

      var sceneBox = scene.getBoundingClientRect();
      var spotBox  = spot.getBoundingClientRect();

      var left = spotBox.left - sceneBox.left + spotBox.width / 2;
      var top  = spotBox.top  - sceneBox.top - 14;

      tip.style.left = left + "px";
      tip.style.top  = "0px";
      tip.classList.add("is-open");

      // Flip below when there is no room above; clamp inside the scene.
      var tipBox = tip.getBoundingClientRect();
      var wanted = top - tipBox.height;
      if (wanted < 6) wanted = spotBox.bottom - sceneBox.top + 14;
      tip.style.top = wanted + "px";

      var half = tipBox.width / 2;
      if (left - half < 8) tip.style.left = (half + 8) + "px";
      else if (left + half > sceneBox.width - 8) tip.style.left = (sceneBox.width - half - 8) + "px";
    }

    function hide() {
      hideTimer = setTimeout(function () { tip.classList.remove("is-open"); }, 80);
    }

    spots.forEach(function (spot) {
      var href = spot.getAttribute("data-href");

      spot.setAttribute("tabindex", "0");
      spot.setAttribute("role", "link");
      spot.setAttribute("aria-describedby", "scene-tip");
      if (!spot.getAttribute("aria-label")) {
        spot.setAttribute(
          "aria-label",
          (spot.getAttribute("data-title") || "") +
          (spot.getAttribute("data-sub") ? " — " + spot.getAttribute("data-sub") : "")
        );
      }

      spot.addEventListener("mouseenter", function () { show(spot); });
      spot.addEventListener("mouseleave", hide);
      spot.addEventListener("focus", function () { show(spot); });
      spot.addEventListener("blur", hide);

      function go() { if (href) window.location.href = href; }
      spot.addEventListener("click", go);
      spot.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
      });
    });

    window.addEventListener("resize", function () { tip.classList.remove("is-open"); });
  }

  /* ---- 2. Optional raster override -------------------------------------- */

  function initRaster() {
    var scene = document.querySelector(".scene");
    if (!scene) return;

    var candidates = ["assets/hero.webp", "assets/hero.png", "assets/hero.jpg"];

    function tryNext(i) {
      if (i >= candidates.length) return;
      var probe = new Image();
      probe.onload = function () {
        var img = document.createElement("img");
        img.className = "scene__raster";
        img.src = candidates[i];
        img.alt = "";
        img.setAttribute("aria-hidden", "true");
        scene.insertBefore(img, scene.querySelector(".scene__ui"));
        requestAnimationFrame(function () { img.classList.add("is-loaded"); });

        // The original illustration already has the name, the search bar and the
        // five menu buttons painted into it. Drawing our own on top would double
        // them up, so switch to "raster mode": the artwork stays untouched and we
        // lay invisible, fully functional controls exactly over the painted ones.
        scene.classList.add("scene--raster");
        var art = scene.querySelector(".scene__art");
        if (art) art.remove();          // vector scene is redundant now
        buildRasterOverlay(scene);
      };
      probe.onerror = function () { tryNext(i + 1); };
      probe.src = candidates[i];
    }
    tryNext(0);
  }


  /* ---- Raster mode: invisible controls over the painted ones -------------- */

  // Percentages of the 1664x928 artwork. Tune these to your image if it differs.
  var PAINTED = {
    search: { left: 29.1, top: 22.6, width: 44.4, height: 7.0 },
    nav: [
      { href: "research.html",     label: "Research",     cx: 34.5 },
      { href: "publications.html", label: "Publications", cx: 42.7 },
      { href: "cv.html",           label: "CV",           cx: 50.9 },
      { href: "teaching.html",     label: "Teaching",     cx: 59.1 },
      { href: "contact.html",      label: "Contact",      cx: 67.2 }
    ],
    navTop: 33.9, navSize: 9.4
  };

  function buildRasterOverlay(scene) {
    var ui = scene.querySelector(".scene__ui");
    if (!ui) return;

    // Keep the heading for screen readers and search engines, but let the
    // painted title show through.
    var mark = ui.querySelector(".wordmark");
    if (mark) mark.classList.add("visually-hidden");
    var tag = ui.querySelector(".tagline");
    if (tag) tag.classList.add("visually-hidden");
    var foot = ui.querySelector(".scene__footer");
    if (foot) foot.classList.add("visually-hidden");

    // Move the real search form on top of the painted search bar.
    var form = ui.querySelector(".search");
    if (form) {
      form.classList.add("search--overlay");
      form.style.left   = PAINTED.search.left + "%";
      form.style.top    = PAINTED.search.top + "%";
      form.style.width  = PAINTED.search.width + "%";
      form.style.height = PAINTED.search.height + "%";
    }

    // Replace the drawn nav with transparent links over the painted circles.
    var orbit = ui.querySelector(".orbit");
    if (orbit) {
      orbit.classList.add("orbit--overlay");
      orbit.innerHTML = PAINTED.nav.map(function (n) {
        return '<li><a class="orbit__hit" href="' + n.href + '" aria-label="' + n.label +
               '" style="left:' + n.cx + '%;top:' + PAINTED.navTop +
               '%;width:' + PAINTED.navSize + '%"></a></li>';
      }).join("");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHotspots();
    initRaster();
  });
})();
