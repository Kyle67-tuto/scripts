import { state } from "../state.js";
import { $, esc, lc, fmtDate, avatarHTML, safeUrl, routeName, catName } from "../utils.js";
import { t } from "../i18n/index.js";
import { ic } from "../icons.js";
import { ADMIN_EMAIL } from "../config.js";
import { pageHead, gate } from "../components/common.js";
import { toast } from "../ui/toast.js";
import {
  loadAdminData, loadCategories, createCategory, editCategory, removeCategory,
  grantUploader, revokeUploader
} from "../services/data.js";

const TABS = [["perms", "perms"], ["cats", "cats_admin"], ["list", "listings"]];

/** Admin panel — only reachable by the verified Super Admin. */
export async function viewAdmin(root) {
  const head = pageHead(ic.shield, "admin");
  if (!state.authReady) { root.innerHTML = head; return; }
  if (!state.isAdmin) { root.innerHTML = head + gate(t("admin_only"), t("admin_only_text")); return; }

  root.innerHTML = head + `
    <div class="tabs" id="aTabs">
      ${TABS.map(([key, label]) => `<button class="chip ${state.adminTab === key ? "on" : ""}" data-tab="${key}">${t(label)}</button>`).join("")}
    </div>
    <section class="panel" id="aBody">${t("loading")}</section>`;

  $("#aTabs").onclick = e => {
    const btn = e.target.closest("[data-tab]");
    if (!btn) return;
    state.adminTab = btn.dataset.tab;
    viewAdmin(root);
  };

  if (!state.admin.loaded) {
    try { await loadAdminData(); } catch (e) { console.error(e); toast(t("err_load"), true); }
  }
  if (routeName() === "admin") renderBody();
}

/* ---------- tab bodies ---------- */
function permsHTML() {
  const granted = new Set(state.admin.uploaders.map(x => x.id));
  const uploaders = state.admin.uploaders.length
    ? state.admin.uploaders.map(x => `
        <div class="row"><span class="grow" dir="ltr">${esc(x.email || x.id)}</span>
          <button class="btn danger sm" data-revoke="${esc(x.id)}">${t("revoke")}</button></div>`).join("")
    : `<p class="muted">${t("none_yet")}</p>`;

  const users = state.admin.users.length
    ? state.admin.users.map(u => {
        const email = lc(u.email);
        const action = email === ADMIN_EMAIL ? `<span class="role">${t("role_admin")}</span>`
          : granted.has(email) ? `<button class="btn danger sm" data-revoke="${esc(email)}">${t("revoke")}</button>`
          : `<button class="btn sm" data-grant="${esc(email)}">${t("grant")}</button>`;
        return `<div class="row">${avatarHTML(u.photoURL, u.displayName, "sm")}
          <span class="grow"><b>${esc(u.displayName)}</b><br><span class="muted" dir="ltr">${esc(u.email)}</span></span>${action}</div>`;
      }).join("")
    : `<p class="muted">${t("none_yet")}</p>`;

  return `
    <form class="inline-form" id="grantForm">
      <input id="gEmail" type="email" dir="ltr" required placeholder="${t("grant_ph")}" aria-label="${t("email")}">
      <button class="btn primary" type="submit">${t("grant")}</button>
    </form>
    <div class="tbl"><div class="h3">${t("uploaders")}</div>${uploaders}</div>
    <div class="tbl"><div class="h3">${t("users")}</div>${users}</div>`;
}

function catsHTML() {
  const rows = state.categories.length ? state.categories.map(c => `
    <div class="row" data-cat-row="${esc(c.id)}">
      <input data-f="en" value="${esc(c.name_en)}" aria-label="${t("name_en")}">
      <input data-f="ar" dir="rtl" value="${esc(c.name_ar)}" aria-label="${t("name_ar")}">
      <button class="btn sm" data-save-cat="${esc(c.id)}">${t("save")}</button>
      <button class="btn danger sm" data-del-cat="${esc(c.id)}" aria-label="${t("delete")}">${ic.trash}</button>
    </div>`).join("") : `<p class="muted">${t("none_yet")}</p>`;

  return `
    <form class="inline-form" id="catForm">
      <input id="cEn" placeholder="${t("name_en")}" aria-label="${t("name_en")}" maxlength="40" required>
      <input id="cAr" dir="rtl" placeholder="${t("name_ar")}" aria-label="${t("name_ar")}" maxlength="40">
      <button class="btn primary" type="submit">${t("add_cat")}</button>
    </form>
    <div class="tbl">${rows}</div>`;
}

function listHTML() {
  if (!state.scripts.length) return `<p class="muted">${t("none_yet")}</p>`;
  return `<div class="tbl" style="margin-top:0">${state.scripts.map(s => {
    const img = safeUrl(s.thumbnail);
    return `<div class="row">${img ? `<img class="mini" src="${esc(img)}" alt="">` : ""}
      <span class="grow"><b>${esc(s.title)}</b><br>
        <span class="muted">${esc(s.authorName)} · ${fmtDate(s.createdAt)} · ${esc(catName(s))}</span></span>
      <button class="btn sm" data-open="${esc(s.id)}">${t("view")}</button>
      <button class="btn danger sm" data-del="${esc(s.id)}" aria-label="${t("delete")}">${ic.trash}</button></div>`;
  }).join("")}</div>`;
}

/* ---------- behaviour ---------- */
async function run(action, okMessage) {
  try { await action(); if (okMessage) toast(okMessage); return true; }
  catch (e) { console.error(e); toast(t("err_generic"), true); return false; }
}

async function grant(emailRaw) {
  const email = lc(emailRaw);
  if (!/^\S+@\S+\.\S+$/.test(email)) return toast(t("err_email"), true);
  const ok = await run(async () => { await grantUploader(email, lc(state.user.email)); await loadAdminData(); }, t("granted"));
  if (ok) renderBody();
}

function renderBody() {
  const el = $("#aBody");
  if (!el) return;

  if (state.adminTab === "perms") el.innerHTML = permsHTML();
  else if (state.adminTab === "cats") el.innerHTML = catsHTML();
  else el.innerHTML = listHTML();

  const grantForm = $("#grantForm", el);
  if (grantForm) grantForm.onsubmit = ev => { ev.preventDefault(); grant($("#gEmail").value); };

  const catForm = $("#catForm", el);
  if (catForm) catForm.onsubmit = async ev => {
    ev.preventDefault();
    const en = $("#cEn").value.trim(), ar = $("#cAr").value.trim();
    if (!en && !ar) return;
    if (await run(async () => { await createCategory(en, ar); await loadCategories(); }, t("cat_added"))) renderBody();
  };

  el.onclick = async e => {
    const btn = e.target.closest("[data-revoke],[data-grant],[data-save-cat],[data-del-cat]");
    if (!btn) return;
    const d = btn.dataset;

    if (d.grant) grant(d.grant);
    else if (d.revoke) {
      if (await run(async () => { await revokeUploader(d.revoke); await loadAdminData(); }, t("revoked"))) renderBody();
    }
    else if (d.saveCat) {
      const row = btn.closest("[data-cat-row]");
      const en = $('[data-f="en"]', row).value.trim(), ar = $('[data-f="ar"]', row).value.trim();
      if (!en && !ar) return;
      await run(async () => { await editCategory(d.saveCat, en, ar); await loadCategories(); }, t("cat_saved"));
    }
    else if (d.delCat) {
      if (!confirm(t("confirm_delete"))) return;
      const ok = await run(async () => { await removeCategory(d.delCat); await loadCategories(); }, t("cat_deleted"));
      if (ok) { if (state.catFilter === d.delCat) state.catFilter = ""; renderBody(); }
    }
  };
}
