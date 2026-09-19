// Single source of truth for UI state.

export const store = {
  get(key, fallback) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
  set(key, value)    { try { localStorage.setItem(key, value); } catch { /* private mode */ } }
};

export const state = {
  lang:   store.get("kh_lang", "en"),
  theme:  store.get("kh_theme", "dark"),
  layout: store.get("kh_layout", "grid"),

  q: "",            // search text
  catFilter: "",    // selected category id (Categories page)

  user: null,       // Firebase user
  authReady: false,
  isAdmin: false,
  canUpload: false,

  scripts: [],
  categories: [],
  loading: true,

  adminTab: "perms",
  admin: { uploaders: [], users: [], loaded: false }
};
