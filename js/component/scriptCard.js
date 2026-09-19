import { state } from "../state.js";
import { esc, safeUrl, fmtDate, avatarHTML, catName } from "../utils.js";
import { t } from "../i18n/index.js";
import { ic } from "../icons.js";

/** HTML for one script card (grid + list layouts share the same markup). */
export function cardHTML(s) {
  const img = safeUrl(s.thumbnail);
  const preview = String(s.code || "").split("\n").slice(0, 8).join("\n").slice(0, 500);
  const tags = (s.tags || []).slice(0, 5).map(x => `<span class="tag-pill">#${esc(x)}</span>`).join("");

  return `<article class="card">
    <div class="thumb" data-open="${esc(s.id)}">
      ${img ? `<img loading="lazy" src="${esc(img)}" alt="">` : `<div class="thumb-ph">${ic.code}</div>`}
      <span class="badge">${esc(catName(s))}</span>
    </div>
    <div class="card-body">
      <h3 data-open="${esc(s.id)}">${esc(s.title)}</h3>
      <div class="meta"><span class="who">${avatarHTML(s.authorPhoto, s.authorName, "sm")}${esc(s.authorName)}</span><span>${fmtDate(s.createdAt)}</span></div>
      ${s.description ? `<p class="desc">${esc(s.description)}</p>` : ""}
      ${tags ? `<div class="tags">${tags}</div>` : ""}
      <pre class="code prev"><code>${esc(preview)}</code></pre>
      <div class="card-actions">
        <button class="btn primary" data-copy="${esc(s.id)}">${ic.copy}${t("copy")}</button>
        <button class="btn" data-open="${esc(s.id)}">${t("view")}</button>
        ${state.isAdmin ? `<button class="btn danger icon" data-del="${esc(s.id)}" aria-label="${t("delete")}">${ic.trash}</button>` : ""}
      </div>
    </div>
  </article>`;
}
