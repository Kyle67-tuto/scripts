import { ic } from "../icons.js";
import { pageHead } from "../components/common.js";
import { toolbarHTML, bindToolbar } from "../components/results.js";

export function viewRecent(root) {
  root.innerHTML = pageHead(ic.clock, "recent", "recent_sub") + toolbarHTML();
  bindToolbar();
}
