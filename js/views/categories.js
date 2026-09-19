import { state } from "../state.js";
import { $, $$, esc, catLabel } from "../utils.js";
import { t } from "../i18n/index.js";
import { ic } from "../icons.js";
import { pageHead } from "../components/common.js";
import { toolbarHTML, bindToolbar, renderResults } from "../components/results.js";

export function viewCategories(root) {
  const count = id => state.scripts.filter(s => s.categoryId === id).length;

  root.innerHTML = pageHead(ic.folder, "categories", "cats_sub") + `
    <div class="chips" id="chips">
      <button class="chip ${state.catFilter ? "" : "on"}" data-cat="">${t("all")}<small>${state.scripts.length}</small></button>
      ${state.categories.map(c => `
        <button class="chip ${state.catFilter === c.id ? "on" : ""}" data-cat="${esc(c.id)}">${esc(catLabel(c))}<small>${count(c.id)}</small></button>`).join("")}
    </div>` + toolbarHTML();

  $("#chips").onclick = e => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.catFilter = btn.dataset.cat;
    $$("#chips .chip").forEach(c => c.classList.toggle("on", c === btn));
    renderResults();
  };
  bindToolbar();
}
