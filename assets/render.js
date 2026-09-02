/* ==========================================================================
   Renders subpage content from assets/data.js.
   Each page supplies mount points; this file fills them.
   ========================================================================== */

(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function el(sel) { return document.querySelector(sel); }
  function isTodo(v) { return typeof v === "string" && v.indexOf("TODO") === 0; }

  /* ---- Shared chrome ---------------------------------------------------- */

  var SKY =
    '<svg viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
      '<g fill="#fff6d8">' +
        '<circle cx="90" cy="40" r="2.4" class="twinkle"/><circle cx="300" cy="26" r="2" class="twinkle" style="animation-delay:1.2s"/>' +
        '<circle cx="520" cy="54" r="2.2" class="twinkle" style="animation-delay:2.1s"/><circle cx="760" cy="30" r="1.9" class="twinkle" style="animation-delay:.6s"/>' +
        '<circle cx="980" cy="58" r="2.4" class="twinkle" style="animation-delay:2.8s"/><circle cx="1140" cy="34" r="2" class="twinkle" style="animation-delay:1.7s"/>' +
        '<circle cx="180" cy="96" r="1.7" class="twinkle" style="animation-delay:3.2s"/><circle cx="880" cy="104" r="1.8" class="twinkle" style="animation-delay:.9s"/>' +
      '</g>' +
      '<path d="M418 62 l4.5 12 12 4.5 -12 4.5 -4.5 12 -4.5 -12 -12 -4.5 12 -4.5z" fill="#ffe07a" class="twinkle" style="animation-delay:1.5s"/>' +
      '<path d="M1042 96 l3.6 10 10 3.6 -10 3.6 -3.6 10 -3.6 -10 -10 -3.6 10 -3.6z" fill="#ffe07a" class="twinkle" style="animation-delay:2.4s"/>' +
      '<g stroke="#fff4cf" stroke-width="1.3" opacity=".55" fill="none"><path d="M150 150 L214 122 L272 148 L318 118"/></g>' +
      '<g fill="#ffeeb0" opacity=".8"><circle cx="150" cy="150" r="3.4"/><circle cx="214" cy="122" r="4"/><circle cx="272" cy="148" r="3"/><circle cx="318" cy="118" r="3.4"/></g>' +
      '<path d="M0 214 q140 -34 300 -18 q160 16 300 -12 q150 -26 300 -4 q150 22 300 -14 V260 H0 Z" fill="#8bbb4f" opacity=".92"/>' +
      '<path d="M0 244 q180 -28 380 -8 q200 20 420 -10 q200 -22 400 6 V260 H0 Z" fill="#6b9a31"/>' +
    "</svg>";

  var PAGES = [
    { href: "index.html",        label: "Home" },
    { href: "research.html",     label: "Research" },
    { href: "publications.html", label: "Publications" },
    { href: "cv.html",           label: "CV" },
    { href: "teaching.html",     label: "Teaching" },
    { href: "contact.html",      label: "Contact" }
  ];

  function currentPage() {
    var f = window.location.pathname.split("/").pop();
    return f || "index.html";
  }

  function renderChrome() {
    var sky = el("[data-sky]");
    if (sky) sky.innerHTML = SKY;

    var nav = el("[data-pagenav]");
    if (nav) {
      var here = currentPage();
      nav.innerHTML =
        '<div class="page-nav__inner">' +
        PAGES.map(function (p) {
          return '<a href="' + p.href + '"' +
                 (p.href === here ? ' aria-current="page"' : "") + ">" + esc(p.label) + "</a>";
        }).join("") + "</div>";
    }

    var foot = el("[data-footer]");
    if (foot) {
      foot.innerHTML =
        '<div class="site-footer__inner">' +
          "<span>© " + SITE.year + " " + esc(SITE.name) + " · " + esc(SITE.affiliation) + "</span>" +
          "<nav>" + PAGES.slice(1).map(function (p) {
            return '<a href="' + p.href + '">' + esc(p.label) + "</a>";
          }).join("") + "</nav>" +
        "</div>";
    }
  }

  /* ---- Research --------------------------------------------------------- */

  var CARD_ART = {
    chalkboard:
      '<rect x="0" y="0" width="300" height="138" fill="#7556b3"/>' +
      '<rect x="72" y="30" width="156" height="92" rx="8" fill="#a67c52"/>' +
      '<rect x="81" y="39" width="138" height="74" rx="5" fill="#2f5c46"/>' +
      '<text x="94" y="82" font-size="22" fill="#f4f7e8" font-family="serif" font-style="italic">L = BZ<tspan font-size="14" dy="-8">n</tspan></text>' +
      '<g fill="#cfe7b6"><circle cx="182" cy="60" r="2.6"/><circle cx="200" cy="60" r="2.6"/><circle cx="182" cy="80" r="2.6"/><circle cx="200" cy="80" r="2.6"/></g>',
    lattice:
      '<rect x="0" y="0" width="300" height="138" fill="#5d4899"/>' +
      '<g stroke="#e8f0d4" stroke-width="2" fill="none"><path d="M104 96 L128 40 L196 56 L172 110 Z M104 96 L196 56 M128 40 L172 110"/></g>' +
      '<g fill="#f2c14e"><circle cx="104" cy="96" r="6"/><circle cx="128" cy="40" r="6"/><circle cx="196" cy="56" r="6"/><circle cx="172" cy="110" r="6"/></g>',
    padlock:
      '<rect x="0" y="0" width="300" height="138" fill="#d99ac1"/>' +
      '<path d="M128 58 v-14 a22 22 0 0 1 44 0 v14" fill="none" stroke="#f7e2ee" stroke-width="11" stroke-linecap="round"/>' +
      '<rect x="114" y="56" width="72" height="58" rx="13" fill="#8f5f80"/>' +
      '<circle cx="150" cy="80" r="8" fill="#f7e2ee"/><path d="M150 86 l-4 15h8z" fill="#f7e2ee"/>',
    temple:
      '<rect x="0" y="0" width="300" height="138" fill="#65a6dc"/>' +
      '<rect x="96" y="106" width="108" height="12" rx="4" fill="#e8f2fb"/>' +
      '<path d="M92 70 h116 l-10 -13 h-96 Z" fill="#f0f7ff"/><path d="M100 57 l50 -30 50 30 Z" fill="#cfe4f7"/>' +
      '<g fill="#f8fcff"><rect x="106" y="70" width="11" height="38" rx="4"/><rect x="128" y="70" width="11" height="38" rx="4"/>' +
      '<rect x="150" y="70" width="11" height="38" rx="4"/><rect x="172" y="70" width="11" height="38" rx="4"/></g>',
    books:
      '<rect x="0" y="0" width="300" height="138" fill="#739b35"/>' +
      '<rect x="96" y="88" width="108" height="17" rx="5" fill="#8f7ec9"/>' +
      '<rect x="102" y="68" width="108" height="17" rx="5" fill="#f2c14e"/>' +
      '<rect x="94" y="48" width="108" height="17" rx="5" fill="#d1608f"/>' +
      '<path d="M108 40 q40 -16 80 -2 v-14 q-40 -14 -80 2 Z" fill="#fffaf0"/>'
  };

  function renderResearch() {
    var grid = el("[data-research-grid]");
    if (grid) {
      grid.innerHTML = RESEARCH.map(function (r) {
        return '<a class="research-card" href="#' + esc(r.id) + '" style="--tint:' + esc(r.tint) + '">' +
          '<svg class="research-card__art" viewBox="0 0 300 138" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
            (CARD_ART[r.object] || "") + "</svg>" +
          '<div class="research-card__body"><h3>' + esc(r.title) + "</h3>" +
          "<p>" + esc(r.blurb.slice(0, 132).replace(/\s+\S*$/, "")) + "…</p></div>" +
          '<div class="tag-row">' + r.tags.slice(0, 3).map(function (t) {
            return '<span class="tag">' + esc(t) + "</span>";
          }).join("") + "</div></a>";
      }).join("");
    }

    var detail = el("[data-research-detail]");
    if (detail) {
      detail.innerHTML = RESEARCH.map(function (r) {
        return '<section class="section" id="' + esc(r.id) + '">' +
          '<h2 class="section__title">' + esc(r.title) + "</h2>" +
          '<div class="prose"><p>' + esc(r.blurb) + "</p><ul>" +
          r.highlights.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") +
          "</ul></div>" +
          '<div class="tag-row" style="padding:0">' + r.tags.map(function (t) {
            return '<span class="tag tag--muted">' + esc(t) + "</span>";
          }).join("") + "</div></section>";
      }).join("");
    }
  }

  /* ---- Publications ----------------------------------------------------- */

  function authorLine(p) {
    return p.authors.map(function (a) {
      return a === ME ? '<span class="me">' + esc(a) + "</span>" : esc(a);
    }).join(", ");
  }

  function pubHtml(p, i) {
    var venue = p.venue
      ? '<span class="pub__venue">' + esc(p.venue) + "</span>"
      : '<span class="pub__venue pub__venue--wip">' + esc(STATUS_LABEL[p.status]) + "</span>";

    var links = Object.keys(p.links || {}).map(function (k) {
      return '<a class="pub__link" href="' + esc(p.links[k]) + '">' + esc(k) + "</a>";
    }).join("");

    return '<article class="pub" id="pub-' + i + '" data-topics="' + esc(p.topics.join("|")) + '">' +
      venue +
      '<h3 class="pub__title">' + esc(p.title) + "</h3>" +
      '<p class="pub__authors">' + authorLine(p) + "</p>" +
      (p.note
        ? '<p class="pub__note' + (p.note.indexOf("TODO") === 0 ? " pub__note--todo" : "") +
          '">' + esc(p.note) + "</p>"
        : "") +
      (links ? '<div class="pub__links">' + links + "</div>" : "") +
      "</article>";
  }

  function renderPublications() {
    var list = el("[data-pub-list]");
    if (!list) return;

    // Belt and braces: even if an unpublished entry reaches data.js, never show it.
    PUBLICATIONS = PUBLICATIONS.filter(function (p) { return p.status === "published"; });

    var topics = {};
    PUBLICATIONS.forEach(function (p) { p.topics.forEach(function (t) { topics[t] = 1; }); });
    var topicNames = Object.keys(topics).sort();

    var filters = el("[data-pub-filters]");
    if (filters) {
      filters.innerHTML =
        '<button class="pub-filter" data-topic="" aria-pressed="true">All</button>' +
        topicNames.map(function (t) {
          return '<button class="pub-filter" data-topic="' + esc(t) + '" aria-pressed="false">' + esc(t) + "</button>";
        }).join("");
    }

    var html = "";
    STATUS_ORDER.forEach(function (st) {
      var group = [];
      PUBLICATIONS.forEach(function (p, i) { if (p.status === st) group.push([p, i]); });
      if (!group.length) return;
      group.sort(function (a, b) { return (b[0].year || 0) - (a[0].year || 0); });
      html += '<h2 class="pub-year" data-group="' + esc(st) + '">' + esc(STATUS_LABEL[st]) +
              ' <span class="section__count">' + group.length + "</span></h2>" +
              '<div data-group-body="' + esc(st) + '">' +
              group.map(function (g) { return pubHtml(g[0], g[1]); }).join("") + "</div>";
    });
    list.innerHTML = html;

    function applyTopic(topic) {
      document.querySelectorAll(".pub-filter").forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-topic") === topic ? "true" : "false");
      });
      document.querySelectorAll(".pub").forEach(function (art) {
        var ts = art.getAttribute("data-topics").split("|");
        art.style.display = (!topic || ts.indexOf(topic) !== -1) ? "" : "none";
      });
      // Hide a status heading whose entries are all filtered out.
      STATUS_ORDER.forEach(function (st) {
        var body = document.querySelector('[data-group-body="' + st + '"]');
        var head = document.querySelector('[data-group="' + st + '"]');
        if (!body || !head) return;
        var visible = Array.prototype.filter.call(body.querySelectorAll(".pub"), function (a) {
          return a.style.display !== "none";
        }).length;
        head.style.display = visible ? "" : "none";
        head.querySelector(".section__count").textContent = visible;
      });
    }

    if (filters) {
      filters.addEventListener("click", function (e) {
        var btn = e.target.closest(".pub-filter");
        if (!btn) return;
        applyTopic(btn.getAttribute("data-topic"));
      });
    }

    var qTopic = new URLSearchParams(window.location.search).get("topic");
    if (qTopic && topicNames.indexOf(qTopic) !== -1) applyTopic(qTopic);

    if (window.location.hash) {
      var target = document.getElementById(window.location.hash.slice(1));
      if (target) setTimeout(function () { target.scrollIntoView({ block: "center" }); }, 60);
    }
  }

  /* ---- Entry lists (CV, teaching) --------------------------------------- */

  function entryHtml(e) {
    var todo = isTodo(e.title) || isTodo(e.when);
    return '<div class="entry">' +
      '<div class="entry__when">' + esc(e.when) + "</div>" +
      '<div class="entry__what"><h3>' + esc(e.title) +
        (todo ? ' <span class="tag tag--muted">needs filling in</span>' : "") + "</h3>" +
        (e.where ? '<p class="entry__where">' + esc(e.where) + "</p>" : "") +
        (e.role ? '<p class="entry__where">' + esc(e.role) + "</p>" : "") +
        (e.detail ? '<p class="entry__detail">' + esc(e.detail) + "</p>" : "") +
      "</div></div>";
  }

  function renderEntries(selector, rows) {
    var mount = el(selector);
    if (!mount) return;
    mount.innerHTML = rows && rows.length
      ? rows.map(entryHtml).join("")
      : '<p class="pub__note">Nothing here yet.</p>';
  }

  function renderCv() {
    if (!el("[data-cv-education]")) return;
    renderEntries("[data-cv-education]",  CV.education);
    renderEntries("[data-cv-experience]", CV.experience);
    renderEntries("[data-cv-awards]",     CV.awards);
    renderEntries("[data-cv-service]",    CV.service);

    var interests = el("[data-cv-interests]");
    if (interests) {
      interests.innerHTML = SITE.interests.map(function (t) {
        return '<span class="tag">' + esc(t) + "</span>";
      }).join("");
    }

    var sel = el("[data-cv-selected]");
    if (sel) {
      var top = PUBLICATIONS.slice(0, 5);
      sel.innerHTML = top.map(function (p) {
        return '<div class="entry"><div class="entry__when">' +
          esc(p.venue || STATUS_LABEL[p.status]) + "</div>" +
          '<div class="entry__what"><h3>' + esc(p.title) + "</h3>" +
          '<p class="entry__where">' + authorLine(p) + "</p></div></div>";
      }).join("");
    }

    var dl = el("[data-cv-download]");
    if (dl) {
      if (SITE.links.cvPdf) dl.setAttribute("href", SITE.links.cvPdf);
      else dl.remove();
    }
  }

  function renderTeaching() {
    renderEntries("[data-teaching]", TEACHING);
  }

  /* ---- Contact ---------------------------------------------------------- */

  var CONTACT_ICONS = {
    email:   '<path d="M3 6h18v12H3z" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M3 7l9 7 9-7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
    scholar: '<path d="M12 4L2 9l10 5 10-5z" fill="currentColor"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" fill="none" stroke="currentColor" stroke-width="1.9"/>',
    orcid:   '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M9 8v9M9 6.2v.1M13 9h2a3.5 3.5 0 0 1 0 7h-2z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
    dblp:    '<path d="M6 4h8l4 4v12H6z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M9 12h6M9 16h6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
    github:  '<path d="M12 3a9 9 0 0 0-2.8 17.5c.4.1.6-.2.6-.5v-1.7c-2.5.5-3-1.2-3-1.2-.4-1-1-1.3-1-1.3-.9-.6 0-.6 0-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.8.8.1-.6.3-1.1.6-1.3-2-.2-4.1-1-4.1-4.4 0-1 .3-1.8.9-2.4-.1-.3-.4-1.2.1-2.4 0 0 .8-.3 2.5 1a8.6 8.6 0 0 1 4.5 0c1.7-1.3 2.5-1 2.5-1 .5 1.2.2 2.1.1 2.4.6.6.9 1.4.9 2.4 0 3.4-2.1 4.2-4.1 4.4.3.3.6.9.6 1.8v2.6c0 .3.2.6.6.5A9 9 0 0 0 12 3z" fill="currentColor"/>',
    eprint:  '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" fill="none" stroke="currentColor" stroke-width="1.6"/>'
  };

  var CONTACT_LABELS = {
    scholar: "Google Scholar", orcid: "ORCID", dblp: "DBLP",
    github: "GitHub", eprint: "IACR ePrint"
  };

  function renderContact() {
    var mount = el("[data-contact]");
    if (!mount) return;

    var parts = SITE.email.split("@");
    var html =
      '<a class="contact-card" data-mail="' + esc(parts[0]) + "|" + esc(parts[1]) + '">' +
        '<span class="contact-card__icon"><svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">' +
          CONTACT_ICONS.email + "</svg></span>" +
        '<span><span class="contact-card__label">Email</span>' +
        '<span class="contact-card__value" data-mail-text>…</span></span></a>';

    ["scholar", "orcid", "dblp", "github", "eprint"].forEach(function (k) {
      var url = SITE.links[k];
      if (!url) return;
      html += '<a class="contact-card" href="' + esc(url) + '" rel="me noopener">' +
        '<span class="contact-card__icon"><svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">' +
          CONTACT_ICONS[k] + "</svg></span>" +
        '<span><span class="contact-card__label">' + esc(CONTACT_LABELS[k]) + "</span>" +
        '<span class="contact-card__value">' + esc(url.replace(/^https?:\/\//, "")) + "</span></span></a>";
    });

    mount.innerHTML = html;

    var missing = ["scholar", "orcid", "dblp", "github", "eprint"]
      .filter(function (k) { return !SITE.links[k]; });
    var note = el("[data-contact-note]");
    if (note && missing.length) {
      note.innerHTML = "<div>Profile links not set yet: <strong>" +
        missing.map(function (k) { return esc(CONTACT_LABELS[k]); }).join(", ") +
        "</strong>. Add them in <code>assets/data.js</code> → <code>SITE.links</code> " +
        "and the cards appear automatically.</div>";
    } else if (note) {
      note.remove();
    }
  }

  /* ---- Go --------------------------------------------------------------- */

  document.addEventListener("DOMContentLoaded", function () {
    renderChrome();
    renderResearch();
    renderPublications();
    renderCv();
    renderTeaching();
    renderContact();
  });
})();
