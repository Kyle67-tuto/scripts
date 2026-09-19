import { $, routeName } from "./utils.js";
import { viewHome } from "./views/home.js";
import { viewCategories } from "./views/categories.js";
import { viewRecent } from "./views/recent.js";
import { viewUpload } from "./views/upload.js";
import { viewProfile } from "./views/profile.js";
import { viewAdmin } from "./views/admin.js";

const routes = {
  home: viewHome,
  categories: viewCategories,
  recent: viewRecent,
  upload: viewUpload,
  profile: viewProfile,
  admin: viewAdmin
};

/** Render the view for the current #/route (unknown routes fall back to Home). */
export function renderView() {
  (routes[routeName()] || viewHome)($("#view"));
}
