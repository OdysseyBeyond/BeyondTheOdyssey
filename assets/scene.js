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

    // Idempotent: raster mode calls this again after swapping in the artwork.
    var tip = scene.querySelector(".tip");
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "tip";
      tip.setAttribute("role", "tooltip");
      tip.id = "scene-tip";
      scene.appendChild(tip);
    }

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
      if (spot.dataset.wired) return;      // don't double-bind on re-init
      spot.dataset.wired = "1";
      var href = spot.getAttribute("data-href");

      if (spot.tagName !== "A") {
        spot.setAttribute("tabindex", "0");
        spot.setAttribute("role", "link");
      }
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

      if (spot.tagName !== "A") {
        var go = function () { if (href) window.location.href = href; };
        spot.addEventListener("click", go);
        spot.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
        });
      }
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
        swapMobileArt(candidates[i]);
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

  // Measured from assets/hero.png (1536x1024) by locating the painted controls.
  var PAINTED = {
    search: { left: 25.98, top: 20.61, width: 49.54, height: 6.54 },
    nav: [
      { href: "research.html",     label: "Research",     cx: 33.33 },
      { href: "publications.html", label: "Publications", cx: 42.48 },
      { href: "cv.html",           label: "CV",           cx: 51.56 },
      { href: "teaching.html",     label: "Teaching",     cx: 60.61 },
      { href: "contact.html",      label: "Contact",      cx: 69.66 }
    ],
    navTop: 30.18, navWidth: 8.0, navHeight: 13.2,

    // Clickable things inside the illustration (percentages of the artwork).
    objects: [
      { href: "research.html#threshold-fhe", title: "Threshold FHE",
        sub: "Distributed decryption & parameters", cta: "Read the research \u2192",
        left: 17.0, top: 56.0, width: 14.5, height: 13.5 },
      { href: "research.html#lattices", title: "Lattices & reduction",
        sub: "LWE \u00b7 SIS \u00b7 Coppersmith \u00b7 Module-LLL", cta: "Read the research \u2192",
        left: 3.5, top: 71.5, width: 11.0, height: 13.0 },
      { href: "research.html#number-theory", title: "Algebraic number theory",
        sub: "Arakelov reduction \u00b7 module lattices", cta: "Read the research \u2192",
        left: 14.0, top: 75.5, width: 18.0, height: 14.5 },
      { href: "research.html#cryptanalysis", title: "Cryptanalysis & side channels",
        sub: "Leakage, faults and what proofs assume", cta: "Read the research \u2192",
        left: 61.5, top: 44.5, width: 9.0, height: 12.0 },
      { href: "research.html#lattices", title: "Discrete Gaussian sampling",
        sub: "Noise, tail bounds & parameter choice", cta: "Read the research \u2192",
        left: 70.5, top: 61.5, width: 12.5, height: 20.0 },
      { href: "publications.html", title: "The archive",
        sub: "Papers, preprints & technical reports", cta: "Go to Publications \u2192",
        left: 81.5, top: 41.0, width: 11.5, height: 14.0 },
      { href: "teaching.html", title: "The lecture hall",
        sub: "Courses & teaching material", cta: "Go to Teaching \u2192",
        left: 18.0, top: 35.0, width: 7.0, height: 11.5 }
    ]
  };

  // The mobile layout gets the same illustration, cropped to its lower half.
  function swapMobileArt(src) {
    var art = document.querySelector(".home-mobile__art");
    if (!art) return;
    // A background box, not an <img>: the illustration is nearly the same aspect
    // ratio as the slot, so object-fit would show the whole page in miniature.
    // background-size: 100% auto + bottom anchoring crops to the landscape band.
    var box = document.createElement("div");
    box.className = "home-mobile__art home-mobile__art--raster";
    box.style.backgroundImage = 'url("' + src + '")';
    box.setAttribute("aria-hidden", "true");
    art.parentNode.replaceChild(box, art);
  }

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
               '%;width:' + PAINTED.navWidth + '%;height:' + PAINTED.navHeight + '%"></a></li>';
      }).join("");
    }

    // Re-create the clickable illustrated objects over the raster artwork.
    PAINTED.objects.forEach(function (o) {
      var a = document.createElement("a");
      a.className = "obj hotspot";
      a.href = o.href;
      a.setAttribute("data-href", o.href);
      a.setAttribute("data-title", o.title);
      a.setAttribute("data-sub", o.sub);
      a.setAttribute("data-cta", o.cta);
      a.setAttribute("aria-label", o.title + " \u2014 " + o.sub);
      a.style.left = o.left + "%";
      a.style.top = o.top + "%";
      a.style.width = o.width + "%";
      a.style.height = o.height + "%";
      ui.appendChild(a);
    });
    initHotspots();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHotspots();
    initRaster();
  });
})();
