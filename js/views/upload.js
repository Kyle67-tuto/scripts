import { state } from "../state.js";
import { $, esc, catOf, catLabel, validImage } from "../utils.js";
import { t } from "../i18n/index.js";
import { ic, icDiscordSm } from "../icons.js";
import { DISCORD_URL } from "../config.js";
import { pageHead, gate } from "../components/common.js";
import { openAuth } from "../components/authModal.js";
import { toast } from "../ui/toast.js";
import { uploadToImgBB } from "../services/imgbb.js";
import { createScript, loadScripts } from "../services/data.js";
import { displayName } from "../utils.js";

export function viewUpload(root) {
  const head = pageHead(ic.upload, "upload", "upload_sub");

  if (!state.authReady) { root.innerHTML = head; return; }

  if (!state.user) {
    root.innerHTML = head + gate(t("need_login"), t("need_login_text"),
      `<p><button class="btn primary" id="gateLogin">${t("signin")}</button></p>`);
    $("#gateLogin").onclick = () => openAuth("signin");
    return;
  }

  if (!state.canUpload) {
    const unverified = !state.user.emailVerified;
    root.innerHTML = head + gate(t("no_perm"), unverified ? t("verify_email") : t("no_perm_text"),
      `<p><a class="btn primary" href="${DISCORD_URL}" target="_blank" rel="noopener noreferrer">${icDiscordSm}${t("discord")}</a></p>`);
    return;
  }

  root.innerHTML = head + `
  <form class="panel form" id="upForm" novalidate>
    <div class="two">
      <label class="field"><span>${t("title")}</span><input id="uTitle" maxlength="90" required></label>
      <label class="field"><span>${t("category")}</span>
        <select id="uCat" required>
          <option value="">${t("select_category")}</option>
          ${state.categories.map(c => `<option value="${esc(c.id)}">${esc(catLabel(c))}</option>`).join("")}
        </select>
        ${state.categories.length ? "" : `<small>${t("no_cats")}</small>`}
      </label>
    </div>
    <label class="field"><span>${t("description")}</span><textarea id="uDesc" rows="3" maxlength="600"></textarea></label>
    <label class="field"><span>${t("tags")}</span><input id="uTags"><small>${t("tags_hint")}</small></label>
    <div class="field"><span>${t("thumbnail")}</span>
      <label class="drop"><input type="file" id="uFile" accept="image/*" hidden>
        <span id="uPrev" class="ph">${ic.image}</span><span class="muted" id="uFileName">${t("choose_image")}</span>
      </label>
    </div>
    <label class="field"><span>${t("code")}</span>
      <textarea id="uCode" class="codein" spellcheck="false" required placeholder="local Players = game:GetService(&quot;Players&quot;)"></textarea></label>
    <p class="err" id="uErr" role="alert"></p>
    <div><button class="btn primary lg" id="uBtn" type="submit">${ic.upload}<span>${t("publish")}</span></button></div>
  </form>`;

  $("#uFile").onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!validImage(file)) { $("#uErr").textContent = t("err_img"); e.target.value = ""; return; }
    $("#uErr").textContent = "";
    $("#uPrev").outerHTML = `<img id="uPrev" src="${URL.createObjectURL(file)}" alt="">`;
    $("#uFileName").textContent = file.name;
  };

  $("#upForm").onsubmit = async ev => {
    ev.preventDefault();
    const title = $("#uTitle").value.trim(), catId = $("#uCat").value, code = $("#uCode").value;
    const err = $("#uErr"), btn = $("#uBtn"), label = $("span", btn);
    err.textContent = "";
    if (!title || !catId || !code.trim()) { err.textContent = t("err_fields"); return; }

    btn.disabled = true; label.textContent = t("publishing");
    try {
      const file = $("#uFile").files[0];
      const thumbnail = file ? await uploadToImgBB(file) : "";
      const user = state.user, cat = catOf(catId);
      await createScript({
        title, code, thumbnail,
        description: $("#uDesc").value.trim(),
        tags: $("#uTags").value.split(/[,،]/).map(x => x.trim()).filter(Boolean).slice(0, 8),
        categoryId: catId, categoryName: cat ? (cat.name_en || cat.name_ar) : "",
        authorUid: user.uid, authorName: displayName(user), authorPhoto: user.photoURL || "",
        createdAt: Date.now()
      });
      toast(t("published"));
      await loadScripts();
      location.hash = "#/recent";
    } catch (e) {
      console.error(e);
      err.textContent = e.message || t("err_generic");
      btn.disabled = false; label.textContent = t("publish");
    }
  };
}
