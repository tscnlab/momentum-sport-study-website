"use strict";
(() => {
 const sections = Array.from(document.querySelectorAll(".information-sections details"));
 const expand = document.getElementById("expand-information");
 expand.addEventListener("click", () => {
  const open = !sections.every(section => section.open);
  sections.forEach(section => { section.open = open; });
  expand.textContent = open ? "Collapse all sections" : "Expand all sections";
 });
 const printableSections = Array.from(document.querySelectorAll(".information-sections details, .consent-reference"));
 let previous = null;
 window.addEventListener("beforeprint", () => {
  if (!previous) previous = printableSections.map(section => section.open);
  printableSections.forEach(section => { section.open = true; });
 });
 window.addEventListener("afterprint", () => {
  if (previous) printableSections.forEach((section, i) => { section.open = previous[i]; });
  previous = null;
 });
 document.getElementById("print-information").addEventListener("click", () => window.print());
})();
