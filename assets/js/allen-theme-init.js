/* Apply a saved preference before paint; storage can be unavailable in private modes. */
(function () {
  "use strict";
  var theme;
  try { theme = localStorage.getItem("theme"); } catch (error) { /* Follow the device. */ }
  if (theme !== "dark" && theme !== "light") {
    theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.add("allen-js");
}());
