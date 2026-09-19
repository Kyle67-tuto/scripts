import { state } from "../state.js";
import { esc, safeUrl, fmtDate, avatarHTML, catName } from "../utils.js";
import { t } from "../i18n/index.js";
import { ic } from "../icons.js";
import { openModal } from "../ui/modal.js";

/** Full view of a script: image, description, tags and complete code. */
export function openDetail(id) {
  const s = state.scripts.find(x => x.id === id);
  if (!s) return;
  const img = safeUrl(s.thumbnail);

  openModal(`
    ${img ? `<img class="detail-img" src="${esc(img)}" alt="">` : ""}
    <h2>${esc(s.title)}</h2>
    <div class="meta" style="margin-bottom:.8rem">
      <span class="tag-pill" style="border-color:var(--red)">${esc(catName(s))}</span>
      <span class="who">${avatarHTML(s.authorPhoto, s.authorName, "sm")}${esc(s.authorName)}</span>
      <span>${fmtDate(s.createdAt)}</span>
    </div>
    ${s.description ? `<p style="overflow-wrap:anywhere;white-space:pre-line">${esc(s.description)}</p>` : ""}
    ${(s.tags || []).length ? `<div class="tags" style="margin-bottom:1rem">${s.tags.map(x => `<span class="tag-pill">#${esc(x)}</span>`).join("")}</div>` : ""}
    <pre class="code full"><code>${esc(s.code)}</code></pre>
    <div class="row-actions" style="margin-top:1rem">
      <button class="btn primary" data-copy="${esc(s.id)}">${ic.copy}${t("copy")}</button>
      ${state.isAdmin ? `<button class="btn danger" data-del="${esc(s.id)}">${ic.trash}${t("delete")}</button>` : ""}
    </div>`);
}
