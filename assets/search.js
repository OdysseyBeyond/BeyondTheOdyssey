/* ==========================================================================
   Fuzzy search over RESEARCH / PUBLICATIONS / pages.
   Dependency-free: subsequence matching + field weighting, ~Fuse.js-lite.
   ========================================================================== */

(function () {
  "use strict";

  // Lowercase + strip diacritics, so an ASCII query reaches accented names.
  function fold(str) {
    return String(str).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  /* ---- Index ------------------------------------------------------------ */

  function buildIndex() {
    var items = [];

    [
      { t: "Research",     u: "research.html",     s: "Research areas and current projects" },
      { t: "Publications", u: "publications.html", s: "Papers, preprints and technical reports" },
      { t: "CV",           u: "cv.html",           s: "Education, experience and awards" },
      { t: "Teaching",     u: "teaching.html",     s: "Courses and teaching material" },
      { t: "Contact",      u: "contact.html",      s: "How to reach me" }
    ].forEach(function (p) {
      items.push({ group: "Pages", title: p.t, meta: p.s, url: p.u, hay: p.t + " " + p.s });
    });

    RESEARCH.forEach(function (r) {
      items.push({
        group: "Research",
        title: r.title,
        meta: r.tags.join(" · "),
        url: "research.html#" + r.id,
        hay: [r.title, r.blurb, r.tags.join(" "), r.highlights.join(" ")].join(" ")
      });
    });

    PUBLICATIONS.forEach(function (p, i) {
      if (p.status !== "published") return;   // never index unpublished work
      items.push({
        group: "Publications",
        title: p.title,
        meta: (p.venue || STATUS_LABEL[p.status]) + " · " + p.authors.join(", "),
        url: "publications.html#pub-" + i,
        hay: [p.title, p.authors.join(" "), p.venue, p.note, p.topics.join(" ")].join(" ")
      });
    });

    var topics = {};
    PUBLICATIONS.forEach(function (p) {
      p.topics.forEach(function (t) { topics[t] = (topics[t] || 0) + 1; });
    });
    RESEARCH.forEach(function (r) {
      r.tags.forEach(function (t) { if (!topics[t]) topics[t] = 0; });
    });
    Object.keys(topics).forEach(function (t) {
      items.push({
        group: "Topics",
        title: t,
        meta: topics[t] ? topics[t] + (topics[t] === 1 ? " paper" : " papers") : "Research topic",
        url: "publications.html?topic=" + encodeURIComponent(t),
        hay: t
      });
    });

    items.forEach(function (it) {
      it.hayLower = fold(it.hay);
      it.titleLower = fold(it.title);
    });
    return items;
  }

  // Tiebreak order when two groups score identically.
  var GROUP_RANK = { Research: 0, Publications: 1, Topics: 2, Pages: 3 };

  /* ---- Scoring ---------------------------------------------------------- */

  // Ordered-subsequence match; rewards contiguity and word-start hits.
  function fuzzyScore(needle, hay) {
    if (!needle) return 0;
    var n = needle.length, h = hay.length;
    if (n > h) return -1;

    var exact = hay.indexOf(needle);
    if (exact !== -1) {
      var atStart = exact === 0 || /[\s\-·(,./]/.test(hay.charAt(exact - 1));
      return 1000 + (atStart ? 260 : 0) - exact * 0.6;
    }

    var hi = 0, score = 0, streak = 0, matched = 0;
    for (var i = 0; i < n; i++) {
      var c = needle.charAt(i);
      if (c === " ") { streak = 0; continue; }
      var found = -1;
      for (var j = hi; j < h; j++) { if (hay.charAt(j) === c) { found = j; break; } }
      if (found === -1) return -1;
      var wordStart = found === 0 || /[\s\-·(,./]/.test(hay.charAt(found - 1));
      score += 12 + streak * 9 + (wordStart ? 22 : 0);
      streak = found === hi ? streak + 1 : 0;
      hi = found + 1;
      matched++;
    }
    return score + matched * 2;
  }

  function scoreItem(q, item) {
    var t = fuzzyScore(q, item.titleLower);
    var b = fuzzyScore(q, item.hayLower);
    if (t < 0 && b < 0) return -1;
    return Math.max(t * 2.2, b * 0.85);
  }

  function search(index, query, limit) {
    var q = fold(query.trim());
    if (!q) return [];
    var out = [];
    for (var i = 0; i < index.length; i++) {
      var s = scoreItem(q, index[i]);
      if (s > 0) out.push({ item: index[i], score: s });
    }
    out.sort(function (a, b) { return b.score - a.score; });
    out = out.slice(0, limit || 8);

    // Keep each group's heading contiguous, ordering groups by their best hit.
    // Exact-title matches across groups score identically, so GROUP_RANK breaks ties.
    var best = {};
    out.forEach(function (r) {
      if (!(r.item.group in best) || r.score > best[r.item.group]) best[r.item.group] = r.score;
    });
    out.sort(function (a, b) {
      var ga = a.item.group, gb = b.item.group;
      if (ga !== gb) {
        if (best[gb] !== best[ga]) return best[gb] - best[ga];
        return (GROUP_RANK[ga] || 9) - (GROUP_RANK[gb] || 9);
      }
      return b.score - a.score;
    });
    return out.map(function (r) { return r.item; });
  }

  /* ---- Rendering -------------------------------------------------------- */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function highlight(text, query) {
    var q = query.trim();
    if (!q) return esc(text);
    var i = fold(text).indexOf(fold(q));
    if (i === -1) return esc(text);
    return esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + q.length)) +
           "</mark>" + esc(text.slice(i + q.length));
  }

  function render(box, results, query) {
    if (!query.trim()) { box.classList.remove("is-open"); box.innerHTML = ""; return; }

    if (!results.length) {
      box.innerHTML = '<p class="results__empty">No matches for “' + esc(query) + '”.</p>';
      box.classList.add("is-open");
      return;
    }

    var html = "", lastGroup = null;
    results.forEach(function (r, i) {
      if (r.group !== lastGroup) {
        html += '<div class="results__group">' + esc(r.group) + "</div>";
        lastGroup = r.group;
      }
      html += '<a class="results__item" role="option" id="res-' + i + '" ' +
              'aria-selected="false" href="' + esc(r.url) + '">' +
              '<div class="results__title">' + highlight(r.title, query) + "</div>" +
              '<div class="results__meta">' + esc(r.meta) + "</div></a>";
    });
    box.innerHTML = html;
    box.classList.add("is-open");
  }

  /* ---- Wiring ----------------------------------------------------------- */

  function wire(form) {
    var input = form.querySelector(".search__input");
    var box   = form.querySelector(".results");
    if (!input || !box) return;

    var index = buildIndex();
    var current = [];
    var cursor = -1;

    function update() {
      current = search(index, input.value, 8);
      cursor = -1;
      render(box, current, input.value);
      input.setAttribute("aria-expanded", box.classList.contains("is-open") ? "true" : "false");
      input.removeAttribute("aria-activedescendant");
    }

    function move(delta) {
      var links = box.querySelectorAll(".results__item");
      if (!links.length) return;
      if (cursor > -1 && links[cursor]) links[cursor].setAttribute("aria-selected", "false");
      cursor = (cursor + delta + links.length + 1) % (links.length + 1) - 1;
      if (cursor === -1) { input.removeAttribute("aria-activedescendant"); return; }
      links[cursor].setAttribute("aria-selected", "true");
      links[cursor].scrollIntoView({ block: "nearest" });
      input.setAttribute("aria-activedescendant", links[cursor].id);
    }

    input.addEventListener("input", update);
    input.addEventListener("focus", function () { if (input.value) update(); });

    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown")      { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp")   { e.preventDefault(); move(-1); }
      else if (e.key === "Escape")    { input.value = ""; update(); input.blur(); }
      else if (e.key === "Enter") {
        var links = box.querySelectorAll(".results__item");
        var target = cursor > -1 ? links[cursor] : links[0];
        if (target) { e.preventDefault(); window.location.href = target.getAttribute("href"); }
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var first = box.querySelector(".results__item");
      if (first) window.location.href = first.getAttribute("href");
    });

    document.addEventListener("click", function (e) {
      if (!form.contains(e.target)) {
        box.classList.remove("is-open");
        input.setAttribute("aria-expanded", "false");
      }
    });

    // "/" focuses search from anywhere on the page.
    document.addEventListener("keydown", function (e) {
      var tag = (document.activeElement && document.activeElement.tagName) || "";
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        input.focus();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".search").forEach(wire);
  });

  window.SiteSearch = { buildIndex: buildIndex, search: search };
})();
