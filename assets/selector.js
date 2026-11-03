"use strict";
(() => {
  const el = (id) => document.getElementById(id);
  const session = el("session");
  const records = Array.from(document.querySelectorAll("#study-data span"), node => node.dataset);
  let language = new URLSearchParams(location.search).get("lang") === "de" ? "de" : "en";
  const t = (en, de) => language === "de" ? de : en;
  function update() {
    el("status").textContent = "";
    el("result").hidden = true;
    el("qr").hidden = true;
    el("qr-missing").hidden = false;
    el("qr-image").removeAttribute("src");
    el("study-id").value = "";
    el("hint").hidden = Boolean(session.value);
    if (!session.value) return;
    const study = records.find(item => item.language === language && item.session === session.value);
    if (!study || !study.id.trim()) {
      el("status").textContent = t("Study unavailable.", "Studie nicht verfügbar.");
      return;
    }
    el("result").hidden = false;
    el("study-id").value = study.id;
    const placeholder = study.placeholder !== "false" || study.id.startsWith("REPLACE_");
    el("placeholder").hidden = !placeholder;
    if (!placeholder && study.qr) {
      el("qr-image").src = study.qr;
      el("qr").hidden = false;
      el("qr-missing").hidden = true;
    }
  }
  function setLanguage(next) {
    language = next;
    document.documentElement.lang = language;
    document.querySelectorAll("[data-en][data-de]").forEach(node => {
      node.textContent = node.dataset[language];
    });
    document.querySelectorAll("[data-alt-en]").forEach(node => {
      node.alt = language === "de" ? node.dataset.altDe : node.dataset.altEn;
    });
    document.querySelectorAll("[data-label-en]").forEach(node => {
      node.setAttribute("aria-label", language === "de" ? node.dataset.labelDe : node.dataset.labelEn);
    });
    document.querySelectorAll("[data-language]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.language === language));
    });
    const title = document.querySelector("h1").textContent;
    document.title = `${title} · momenTUM`;
    const url = new URL(location.href);
    url.searchParams.set("lang", language);
    history.replaceState(null, "", url);
    update();
  }
  document.querySelectorAll("[data-language]").forEach(button => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });
  el("qr-image").addEventListener("error", () => {
    el("qr").hidden = true;
    el("qr-missing").hidden = false;
  });
  session.addEventListener("change", update);
  el("copy").addEventListener("click", async () => {
    const value = el("study-id").value;
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      el("status").textContent = t("Copied.", "Kopiert.");
    } catch {
      el("study-id").focus();
      el("study-id").select();
      el("status").textContent = t("Select and copy the ID manually.", "ID bitte manuell kopieren.");
    }
  });
  setLanguage(language);
})();
