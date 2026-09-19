// All Firestore reads/writes live here. No DOM code.
import {
  db, collection, doc, getDocs, setDoc, updateDoc,
  query, orderBy, limit, addDoc, deleteDoc
} from "../firebase.js";
import { state } from "../state.js";
import { FETCH_LIMIT } from "../config.js";

const mapDocs = snap => snap.docs.map(d => ({ id: d.id, ...d.data() }));

/* ---------- Public library ---------- */
export async function loadCategories() {
  state.categories = mapDocs(await getDocs(query(collection(db, "categories"), orderBy("createdAt", "asc"))));
}
export async function loadScripts() {
  state.scripts = mapDocs(await getDocs(query(collection(db, "scripts"), orderBy("createdAt", "desc"), limit(FETCH_LIMIT))));
}
export const createScript = data => addDoc(collection(db, "scripts"), data);
export const removeScript = id => deleteDoc(doc(db, "scripts", id));

/* ---------- Admin: categories ---------- */
export const createCategory = (en, ar) =>
  addDoc(collection(db, "categories"), { name_en: en || ar, name_ar: ar || en, createdAt: Date.now() });
export const editCategory = (id, en, ar) =>
  updateDoc(doc(db, "categories", id), { name_en: en || ar, name_ar: ar || en });
export const removeCategory = id => deleteDoc(doc(db, "categories", id));

/* ---------- Admin: upload permission (doc id = lowercase email) ---------- */
export const grantUploader = (email, grantedBy) =>
  setDoc(doc(db, "uploaders", email), { email, grantedAt: Date.now(), grantedBy });
export const revokeUploader = email => deleteDoc(doc(db, "uploaders", email));

export async function loadAdminData() {
  const [users, uploaders] = await Promise.all([
    getDocs(collection(db, "users")),
    getDocs(collection(db, "uploaders"))
  ]);
  state.admin.users = mapDocs(users).sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0));
  state.admin.uploaders = mapDocs(uploaders);
  state.admin.loaded = true;
}
