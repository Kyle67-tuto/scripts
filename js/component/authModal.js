import { $ } from "../utils.js";
import { t } from "../i18n/index.js";
import { openModal, closeModal } from "../ui/modal.js";
import { toast } from "../ui/toast.js";
import { authError, loginWithGoogle, loginWithEmail, registerWithEmail } from "../services/auth.js";

/** Sign-in / sign-up dialog (Google + Email/Password). */
export function openAuth(mode = "signin") {
  const signup = mode === "signup";
  openModal(`
    <h2>${t(signup ? "signup" : "signin")}</h2>
    <button class="btn block" id="gBtn" type="button"><span class="gmark">G</span>${t("google")}</button>
    <div class="or"><span>${t("or")}</span></div>
    <form class="form" id="authForm" novalidate>
      ${signup ? `<label class="field"><span>${t("name")}</span><input id="aName" maxlength="40" autocomplete="nickname" required></label>` : ""}
      <label class="field"><span>${t("email")}</span><input id="aEmail" type="email" autocomplete="email" required dir="ltr"></label>
      <label class="field"><span>${t("password")}</span><input id="aPass" type="password" autocomplete="${signup ? "new-password" : "current-password"}" minlength="6" required dir="ltr"></label>
      <p class="err" id="aErr" role="alert"></p>
      <button class="btn primary block" type="submit" id="aSubmit">${t(signup ? "signup" : "signin")}</button>
    </form>
    <p class="switch">${t(signup ? "have_account" : "no_account")} <button class="link" type="button" id="swMode">${t(signup ? "signin" : "signup")}</button></p>`, "sm");

  $("#swMode").onclick = () => openAuth(signup ? "signin" : "signup");

  $("#gBtn").onclick = async () => {
    try { await loginWithGoogle(); closeModal(); toast(t("welcome")); }
    catch (e) { const msg = authError(e); if (msg) $("#aErr").textContent = msg; }
  };

  $("#authForm").onsubmit = async ev => {
    ev.preventDefault();
    const email = $("#aEmail").value.trim(), pass = $("#aPass").value, btn = $("#aSubmit");
    $("#aErr").textContent = "";
    btn.disabled = true;
    try {
      if (signup) await registerWithEmail($("#aName").value.trim(), email, pass);
      else await loginWithEmail(email, pass);
      closeModal(); toast(t("welcome"));
    } catch (e) { $("#aErr").textContent = authError(e); }
    btn.disabled = false;
  };
}
