import { state, store } from "../state.js";

/** Push theme + language (and RTL/LTR direction) to the <html> element. */
export function applyPrefs() {
  const root = document.documentElement;
  root.lang = state.lang;
  root.dir = state.lang === "ar" ? "rtl" : "ltr";
  root.dataset.theme = state.theme;
}

export function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  store.set("kh_theme", state.theme);
  applyPrefs();
}

export function toggleLang() {
  state.lang = state.lang === "en" ? "ar" : "en";
  store.set("kh_lang", state.lang);
  applyPrefs();
}
