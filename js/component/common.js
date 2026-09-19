import { t } from "../i18n/index.js";

export const pageHead = (icon, titleKey, subKey) =>
  `<div class="page-h">${icon}<h2>${t(titleKey)}</h2></div>${subKey ? `<p class="sub">${t(subKey)}</p>` : ""}`;

/** Centered message panel (login required, no permission, admin only...). */
export const gate = (title, text, extraHTML = "") =>
  `<section class="panel narrow" style="text-align:center"><h2 style="margin-bottom:.6rem">${title}</h2><p class="muted">${text}</p>${extraHTML}</section>`;
