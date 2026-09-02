/* Assemble mailto links in JS so the address is not sitting in the HTML
   source for scrapers. Elements opt in with data-mail="user|domain". */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-mail]").forEach(function (el) {
      var parts = el.getAttribute("data-mail").split("|");
      if (parts.length !== 2) return;
      var addr = parts[0] + "@" + parts[1];
      if (el.tagName === "A") el.setAttribute("href", "mailto:" + addr);
      var slot = el.querySelector("[data-mail-text]") || el;
      if (slot.hasAttribute("data-mail-text") || el.tagName !== "A") slot.textContent = addr;
    });
  });
})();
