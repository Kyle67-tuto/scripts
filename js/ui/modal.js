import { $ } from "../utils.js";
import { t } from "../i18n/index.js";
import { ic } from "../icons.js";

export const isModalOpen = () => !$("#modal").hidden;

export function openModal(html, cls = "") {
  const card = $("#modalCard");
  card.className = "modal-card " + cls;
  card.innerHTML = `<button class="icon-btn modal-x" id="mClose" aria-label="${t("close")}">${ic.close}</button>${html}`;
  $("#modal").hidden = false;
  $("#mClose").onclick = closeModal;
}

export function closeModal() {
  $("#modal").hidden = true;
  $("#modalCard").innerHTML = "";
}

export function initModal() {
  $("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
}
