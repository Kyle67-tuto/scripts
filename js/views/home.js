import { state } from "../state.js";
import { t } from "../i18n/index.js";
import { ic } from "../icons.js";
import { toolbarHTML, bindToolbar } from "../components/results.js";

export function viewHome(root) {
  root.innerHTML = `
    <section class="hero">
      <h1 class="wm xl">Kyle Hub</h1>
      <p class="tag">${t("tagline")}</p>
      <div class="hero-cta">
        <a class="btn primary lg" href="#/categories">${t("browse")}</a>
        <a class="btn lg" href="#/upload">${ic.upload}${t("upload")}</a>
      </div>
      <div class="stats">
        <span><b>${state.scripts.length}</b> ${t("scripts_n")}</span>
        <span><b>${state.categories.length}</b> ${t("cats_n")}</span>
      </div>
    </section>
    ${toolbarHTML()}`;
  bindToolbar();
}
