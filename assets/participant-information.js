"use strict";
(() => {
 const pages = Array.from(document.querySelectorAll("[data-page-language]"));
 const buttons = Array.from(document.querySelectorAll("[data-language]"));
 let language = new URLSearchParams(location.search).get("lang") === "de" ? "de" : "en";
 let previousPrintState = null;
 const activePage = () => pages.find(page => page.dataset.pageLanguage === language);
 const informationSections = page => Array.from(page.querySelectorAll(".information-sections details"));
 function updateExpandLabel(page) {
  const allOpen = informationSections(page).every(section => section.open);
  page.querySelector('[data-action="expand"]').textContent = page.dataset.pageLanguage === "de"
   ? (allOpen ? "Alle Abschnitte schließen" : "Alle Abschnitte öffnen")
   : (allOpen ? "Collapse all sections" : "Expand all sections");
 }
 function setLanguage(next) {
  language = next;
  document.documentElement.lang = language;
  pages.forEach(page => { page.hidden = page.dataset.pageLanguage !== language; });
  buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.language === language)));
  document.title = language === "de" ? "Informationen zur Teilnahme · Sportstudie" : "Participant information · Sport study";
  document.querySelector(".language-switch").setAttribute("aria-label", language === "de" ? "Seitensprache" : "Page language");
  const school = document.querySelector("[data-school-en]");
  school.textContent = language === "de" ? school.dataset.schoolDe : school.dataset.schoolEn;
  const url = new URL(location.href);
  url.searchParams.set("lang", language);
  history.replaceState(null, "", url);
 }
 buttons.forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.language)));
 pages.forEach(page => {
  page.querySelector('[data-action="expand"]').addEventListener("click", () => {
   const sections = informationSections(page);
   const open = !sections.every(section => section.open);
   sections.forEach(section => { section.open = open; });
   updateExpandLabel(page);
  });
  informationSections(page).forEach(section => section.addEventListener("toggle", () => updateExpandLabel(page)));
  page.querySelector('[data-action="print"]').addEventListener("click", () => window.print());
 });
 window.addEventListener("beforeprint", () => {
  if (previousPrintState) return;
  previousPrintState = Array.from(activePage().querySelectorAll("details"), section => ({section, open:section.open}));
  previousPrintState.forEach(item => { item.section.open = true; });
 });
 window.addEventListener("afterprint", () => {
  if (!previousPrintState) return;
  previousPrintState.forEach(item => { item.section.open = item.open; });
  previousPrintState = null;
  updateExpandLabel(activePage());
 });
 setLanguage(language);
})();
