// Delegated click actions shared by cards, the detail modal and admin listings:
//   data-copy="id"  copy code      data-open="id"  open details      data-del="id"  delete (admin)
import { state } from "./state.js";
import { copyText } from "./utils.js";
import { t } from "./i18n/index.js";
import { toast } from "./ui/toast.js";
import { closeModal, isModalOpen } from "./ui/modal.js";
import { openDetail } from "./components/detailModal.js";
import { removeScript } from "./services/data.js";
import { renderView } from "./router.js";

async function copyScript(id) {
  const script = state.scripts.find(s => s.id === id);
  if (!script) return;
  (await copyText(script.code)) ? toast(t("copied")) : toast(t("copy_fail"), true);
}

async function deleteScript(id) {
  if (!confirm(t("confirm_delete"))) return;
  try {
    await removeScript(id);
    state.scripts = state.scripts.filter(s => s.id !== id);
    if (isModalOpen()) closeModal();
    toast(t("deleted"));
    renderView();
  } catch (e) {
    console.error(e);
    toast(t("err_generic"), true);
  }
}

export function initActions() {
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-copy],[data-open],[data-del]");
    if (!el) return;
    const { copy, open, del } = el.dataset;
    if (copy) copyScript(copy);
    else if (open) openDetail(open);
    else if (del) deleteScript(del);
  });
}
