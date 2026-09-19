// Kyle Hub — entry point. Wires modules together and boots the app.
import { state } from "./state.js";
import { $ } from "./utils.js";
import { t } from "./i18n/index.js";
import { toast } from "./ui/toast.js";
import { initModal, closeModal, isModalOpen } from "./ui/modal.js";
import { applyPrefs, toggleTheme, toggleLang } from "./ui/prefs.js";
import { renderHeader } from "./components/header.js";
import { renderSidebar, initSidebar, setSidebar } from "./components/sidebar.js";
import { renderView } from "./router.js";
import { initActions } from "./actions.js";
import { watchAuth } from "./services/auth.js";
import { loadCategories, loadScripts } from "./services/data.js";

function renderAll() {
  applyPrefs();
  renderHeader();
  renderSidebar();
  $("#footer").textContent = t("footer");
  renderView();
}

async function loadLibrary() {
  state.loading = true;
  renderView();
  try { await Promise.all([loadCategories(), loadScripts()]); }
  catch (e) { console.error(e); toast(t("err_load"), true); }
  state.loading = false;
  renderView();
}

/* ---- events ---- */
initModal();
initSidebar();
initActions();

$("#themeBtn").onclick = () => { toggleTheme(); renderHeader(); };
$("#langBtn").onclick = () => { toggleLang(); renderAll(); };

document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  setSidebar(false);
  if (isModalOpen()) closeModal();
});

window.addEventListener("hashchange", () => {
  renderSidebar();
  renderView();
  window.scrollTo({ top: 0 });
});

// Profile name/photo changed → refresh header avatar.
document.addEventListener("kh:user-updated", renderHeader);

/* ---- boot ---- */
renderAll();
loadLibrary();
watchAuth(() => { renderHeader(); renderSidebar(); renderView(); });
