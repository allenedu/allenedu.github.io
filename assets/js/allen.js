import {plainToTex} from "./math-notation.mjs?v=studio2";
import {setMath,setMixedMath,renderMath} from "./math-renderer.mjs?v=studio2";
(function () {
  "use strict";
  var root = document.documentElement;
  var themeButton = document.querySelector("[data-theme-toggle]");
  function updateThemeLabel() {
    if (themeButton) themeButton.setAttribute("aria-label", root.dataset.theme === "dark" ? "切换至浅色模式" : "切换至深色模式");
  }
  if (themeButton) {
    updateThemeLabel();
    themeButton.addEventListener("click", function () {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("theme", root.dataset.theme); } catch (error) { /* The current page still works. */ }
      updateThemeLabel();
    });
  }
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
      var saved;
      try { saved = localStorage.getItem("theme"); } catch (error) { /* Follow the device. */ }
      if (saved !== "light" && saved !== "dark") {
        root.dataset.theme = event.matches ? "dark" : "light";
        updateThemeLabel();
      }
    });
  }
  var menuButton = document.querySelector("[data-menu-toggle]");
  var navigation = document.getElementById("allen-navigation");
  function closeMenu() {
    if (!menuButton || !navigation) return;
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "展开导航菜单");
  }
  if (menuButton && navigation) {
    menuButton.hidden = false;
    menuButton.addEventListener("click", function () {
      var open = menuButton.getAttribute("aria-expanded") !== "true";
      navigation.classList.toggle("is-open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "收起导航菜单" : "展开导航菜单");
    });
    navigation.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", closeMenu); });
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".allen-header")) closeMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") { closeMenu(); menuButton.focus(); }
    });
  }
  var contactDialog = document.getElementById("wechat-modal");
  if (contactDialog && typeof contactDialog.showModal === "function") {
    document.querySelectorAll(".wechat-link, [data-wechat]").forEach(function (link) {
      link.addEventListener("click", function (event) { event.preventDefault(); if (!contactDialog.open) contactDialog.showModal(); });
    });
    contactDialog.querySelector("[data-close-dialog]").addEventListener("click", function () { contactDialog.close(); });
    contactDialog.addEventListener("click", function (event) {
      if (event.target !== contactDialog) return;
      var box = contactDialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) contactDialog.close();
    });
  }
  var search = document.querySelector("[data-resource-search]");
  if (search) {
    var searchable = Array.from(document.querySelectorAll("[data-searchable]"));
    var count = document.querySelector("[data-search-count]");
    var empty = document.querySelector("[data-search-empty]");
    function filterResources() {
      var terms = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
      var matches = 0;
      searchable.forEach(function (card) {
        var text = card.textContent.toLocaleLowerCase();
        var visible = terms.every(function (term) { return text.includes(term); });
        card.hidden = !visible;
        if (visible) matches++;
      });
      if (count) count.textContent = "显示 " + matches + " / " + searchable.length + " 个主题";
      if (empty) empty.hidden = matches !== 0;
    }
    search.addEventListener("input", filterResources);
    filterResources();
  }
  document.querySelectorAll("[data-math-lab]").forEach(function (lab) {
    var inputs = Array.from(lab.querySelectorAll("[data-parameter]"));
    var curve = lab.querySelector("[data-curve]");
    var vertex = lab.querySelector("[data-vertex]");
    var insight = lab.querySelector("[data-lab-insight]");
    var equation = lab.querySelector("[data-equation]");
    var description = lab.querySelector("#lab-graph-description");
    function number(value) { return String(Number(value.toFixed(2))); }
    function updateGraph() {
      var parameters = {};
      inputs.forEach(function (input) {
        parameters[input.dataset.parameter] = Number(input.value);
        setMixedMath(lab.querySelector('[data-output="' + input.dataset.parameter + '"]'),number(Number(input.value)),{numbers:true});
      });
      var a = parameters.a, h = parameters.h, k = parameters.k;
      /* The viewport is x in [-5, 5], y in [-4, 6]. SVG y increases downward. */
      var path = "";
      for (var i = 0; i <= 400; i++) {
        var x = -5 + i / 40;
        var y = a * Math.pow(x - h, 2) + k;
        path += (i === 0 ? "M" : "L") + number(300 + 50 * x) + " " + number(227 - 32 * y);
      }
      curve.setAttribute("d", path);
      vertex.setAttribute("cx", number(300 + 50 * h));
      vertex.setAttribute("cy", number(227 - 32 * k));
      vertex.style.display = a === 0 ? "none" : "";
      var term = h === 0 ? "x²" : "(x " + (h < 0 ? "+ " : "− ") + number(Math.abs(h)) + ")²";
      var coefficient = a === 1 ? "" : a === -1 ? "−" : number(a) + " ";
      var formula = a === 0 ? "y = " + number(k) : "y = " + coefficient + term + (k === 0 ? "" : " " + (k < 0 ? "− " : "+ ") + number(Math.abs(k)));
      setMath(equation,plainToTex(formula));
      var explanation = a === 0 ? "a = 0，函数退化为水平直线 y = " + number(k) + "。" : "开口" + (a > 0 ? "向上" : "向下") + "，顶点位于 (" + number(h) + ", " + number(k) + ")。";
      setMixedMath(insight,explanation);
      if (description) description.textContent = formula + "。" + explanation;
      renderMath(lab);
    }
    inputs.forEach(function (input) { input.addEventListener("input", updateGraph); });
    lab.querySelector("[data-reset-lab]").addEventListener("click", function () {
      inputs.forEach(function (input) { input.value = input.defaultValue; });
      updateGraph();
    });
    updateGraph();
  });
}());
