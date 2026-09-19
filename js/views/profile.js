import { state } from "../state.js";
import { $, esc, avatarHTML, displayName, validImage } from "../utils.js";
import { t } from "../i18n/index.js";
import { ic } from "../icons.js";
import { pageHead, gate } from "../components/common.js";
import { openAuth } from "../components/authModal.js";
import { toast } from "../ui/toast.js";
import { saveProfile, logout } from "../services/auth.js";

export function viewProfile(root) {
  if (!state.authReady) { root.innerHTML = ""; return; }

  const user = state.user;
  if (!user) {
    root.innerHTML = gate(t("need_login"), t("need_login_text"),
      `<p><button class="btn primary" id="gateLogin">${t("signin")}</button></p>`);
    $("#gateLogin").onclick = () => openAuth("signin");
    return;
  }

  const [roleKey, roleCls] = state.isAdmin ? ["role_admin", ""] : state.canUpload ? ["role_uploader", ""] : ["role_member", "plain"];

  root.innerHTML = pageHead(ic.user, "profile") + `
  <section class="panel narrow form">
    <div class="avatar-edit">
      <div id="pAv">${avatarHTML(user.photoURL, displayName(user), "xl")}</div>
      <label class="btn"><input type="file" id="pFile" accept="image/*" hidden>${ic.image}${t("change_photo")}</label>
    </div>
    <label class="field"><span>${t("display_name")}</span><input id="pName" maxlength="40" value="${esc(displayName(user))}"></label>
    <div class="meta"><span dir="ltr">${esc(user.email)}</span><span class="role ${roleCls}">${t(roleKey)}</span></div>
    <p class="err" id="pErr" role="alert"></p>
    <div class="row-actions">
      <button class="btn primary" id="pSave">${t("save")}</button>
      <button class="btn ghost" id="pOut">${t("signout")}</button>
    </div>
  </section>`;

  let pickedFile = null;

  $("#pFile").onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!validImage(file)) { $("#pErr").textContent = t("err_img"); e.target.value = ""; return; }
    $("#pErr").textContent = "";
    pickedFile = file;
    $("#pAv").innerHTML = `<img class="avatar xl" src="${URL.createObjectURL(file)}" alt="">`;
  };

  $("#pSave").onclick = async () => {
    const btn = $("#pSave");
    btn.disabled = true; $("#pErr").textContent = "";
    try {
      await saveProfile({ name: $("#pName").value.trim() || displayName(user), file: pickedFile });
      pickedFile = null;
      toast(t("saved"));
    } catch (e) {
      console.error(e);
      $("#pErr").textContent = e.message || t("err_generic");
    }
    btn.disabled = false;
  };

  $("#pOut").onclick = async () => { await logout(); location.hash = "#/home"; };
}
