// Small, dependency-light helpers used across the app.
import { state } from "./state.js";
import { MAX_IMAGE_BYTES } from "./config.js";

export const $  = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Escape user content before putting it in innerHTML. */
export const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/** Only allow https URLs for images coming from the database. */
export const safeUrl = u => /^https:\/\//i.test(u || "") ? u : "";

export const lc = s => String(s || "").trim().toLowerCase();

export const fmtDate = ts =>
  new Date(ts || Date.now()).toLocaleDateString(state.lang === "ar" ? "ar" : "en-US",
    { year: "numeric", month: "short", day: "numeric" });

export const routeName = () => (location.hash.replace(/^#\/?/, "") || "home").split(/[/?]/)[0];

export const displayName = u => u?.displayName || (u?.email ? u.email.split("@")[0] : "User");

export function avatarHTML(url, name, cls = "") {
  const u = safeUrl(url);
  if (u) return `<img class="avatar ${cls}" src="${esc(u)}" alt="" referrerpolicy="no-referrer">`;
  return `<span class="avatar ${cls}" aria-hidden="true">${esc((name || "?").trim().charAt(0).toUpperCase())}</span>`;
}

export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand("copy"); } catch { /* ignore */ }
    ta.remove(); return ok;
  }
}

export const validImage = f => !!f && f.type.startsWith("image/") && f.size <= MAX_IMAGE_BYTES;

/* Categories */
export const catOf = id => state.categories.find(c => c.id === id);
export const catLabel = c => state.lang === "ar" ? (c.name_ar || c.name_en) : (c.name_en || c.name_ar);
export const catName = s => { const c = catOf(s.categoryId); return c ? catLabel(c) : (s.categoryName || "—"); };
