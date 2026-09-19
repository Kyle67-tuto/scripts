import { IMGBB_KEY, IMGBB_ENDPOINT } from "../config.js";
import { t } from "../i18n/index.js";

/** Upload an image file to ImgBB and return its public URL. */
export async function uploadToImgBB(file) {
  const body = new FormData();
  body.append("image", file);
  const res = await fetch(`${IMGBB_ENDPOINT}?key=${IMGBB_KEY}`, { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) throw new Error(json?.error?.message || t("err_upload"));
  return json.data.display_url || json.data.url;
}
