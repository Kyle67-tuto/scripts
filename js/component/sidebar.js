import { state } from "../state.js";
import { $, routeName } from "../utils.js";
import { t } from "../i18n/index.js";
import { ic } from "../icons.js";

export function renderSidebar() {
  const current = routeName();
  const items = [["home", ic.home], ["upload", ic.upload], ["categories", ic.folder], ["recent", ic.clock]];
  if (state.isAdmin) items.push(["admin", ic.shield]);

  $("#nav").innerHTML = items.map(([key, icon]) =>
    `<a href="#/${key}" class="${current === key ? "active" : ""}">${icon}<span>${t(key)}</span></a>`).join("");
  $("#discordBtn").innerHTML = `${ic.discord}<span>${t("discord")}</span>`;
  $("#sbClose").innerHTML = ic.close;
}

export const isSidebarOpen = () => $("#sidebar").classList.contains("open");

export function setSidebar(open) {
  $("#sidebar").classList.toggle("open", open);
  $("#sidebar").inert = !open;
  $("#backdrop").classList.toggle("show", open);
  $("#menuBtn").setAttribute("aria-expanded", String(open));
}

export function initSidebar() {
  $("#menuBtn").onclick = () => setSidebar(!isSidebarOpen());
  $("#sbClose").onclick = () => setSidebar(false);
  $("#backdrop").onclick = () => setSidebar(false);
  $("#nav").addEventListener("click", e => { if (e.target.closest("a")) setSidebar(false); });
}
