/* The bundled SVG renderer needs no remote fonts or extension downloads. */
window.MathJax = {
  loader: {load: []},
  tex: {
    packages: ["base", "ams", "newcommand", "noundefined", "configmacros"],
    inlineMath: [["\\(", "\\)"], ["$", "$"]],
    displayMath: [["\\[", "\\]"], ["$$", "$$"]],
    processEscapes: true
  },
  svg: {fontCache: "none"},
  options: {
    enableMenu: false,
    skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code", "svg", "mjx-container"]
  },
  startup: {typeset: false}
};
