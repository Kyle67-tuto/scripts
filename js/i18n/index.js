import { state } from "../state.js";
import en from "./en.js";
import ar from "./ar.js";

const dictionaries = { en, ar };

/** Translate a key in the current language (falls back to English, then the key). */
export const t = key => dictionaries[state.lang]?.[key] ?? en[key] ?? key;
