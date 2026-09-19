import { state, store } from "../state.js";
import { $, $$, esc, lc, routeName } from "../utils.js";
import { t } from "../i18n/index.js";
import { ic } from "../icons.js";
import { RECENT_LIMIT } from "../config.js";
import { cardHTML } from "./scriptCard.js";

/** Scripts to show for the current route, after search / category filter. */
export function currentList() {
  const route = routeName(), q = lc(state.q);
  let list = state.scripts;
  if (route === "categories" && state.catFilter) list = list.filter(s => s.categoryId === state.catFilter);
  if (q) list = list.filter(s => lc([s.title, s.description, (s.tags || []).join(" ")].join(" ")).includes(q));
  if (route === "recent") list = list.slice(0, RECENT_LIMIT);
  return list;
}

export function renderResults() {
  const el = $("#results");
  if (!el) return;
  el.className = "results " + state.layout;

  if (state.loading) { el.innerHTML = '<div class="skel"></div>'.repeat(3); return; }

  const list = currentList();
  if (!list.length) {
    const msg = state.q.trim() ? t("empty_search") : (state.canUpload ? t("empty_upload") : t("empty_wait"));
    el.innerHTML = `<div class="empty">${ic.code}<h3>${t("empty_title")}</h3><p>${msg}</p></div>`;
    return;
  }
  el.innerHTML = list.map(cardHTML).join("");
}

/** Search bar + grid/list switch + empty results container. */
export function toolbarHTML() {
  return `<div class="toolbar">
    <label class="search">${ic.search}<span class="sr">${t("search_ph")}</span>
      <input id="q" type="search" placeholder="${esc(t("search_ph"))}" value="${esc(state.q)}" autocomplete="off"></label>
    <div class="seg" role="group">
      <button data-layout="grid" class="${state.layout === "grid" ? "on" : ""}" aria-label="${t("grid")}" title="${t("grid")}">${ic.grid}</button>
      <button data-layout="list" class="${state.layout === "list" ? "on" : ""}" aria-label="${t("list")}" title="${t("list")}">${ic.list}</button>
    </div>
  </div><div id="results" class="results"></div>`;
}

/** Wire the toolbar rendered by toolbarHTML() and paint the results. */
export function bindToolbar() {
  $("#q").addEventListener("input", e => { state.q = e.target.value; renderResults(); });
  $$("[data-layout]").forEach(btn => btn.onclick = () => {
    state.layout = btn.dataset.layout;
    store.set("kh_layout", state.layout);
    $$("[data-layout]").forEach(b => b.classList.toggle("on", b === btn));
    renderResults();
  });
  renderResults();
}
