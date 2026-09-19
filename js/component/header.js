import { state } from "../state.js";
import { $, avatarHTML, displayName } from "../utils.js";
import { t } from "../i18n/index.js";
import { ic } from "../icons.js";
import { openAuth } from "./authModal.js";

export function renderHeader() {
  $("#menuBtn").innerHTML = ic.menu;
  $("#langBtn").innerHTML = `${ic.globe}<span>${t("pick_lang")}</span>`;
  $("#themeBtn").innerHTML = state.theme === "dark" ? ic.sun : ic.moon;

  const u = state.user;
  $("#userSlot").innerHTML = u
    ? `<a class="icon-btn" href="#/profile" aria-label="${t("profile")}" style="border-radius:50%;overflow:hidden">${avatarHTML(u.photoURL, displayName(u))}</a>`
    : `<button class="btn primary" id="signinBtn">${t("signin")}</button>`;

  const signin = $("#signinBtn");
  if (signin) signin.onclick = () => openAuth("signin");
}
