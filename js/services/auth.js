import {
  auth, db, googleProvider,
  signInWithPopup, signOut, onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  updateProfile, sendEmailVerification,
  doc, getDoc, setDoc
} from "../firebase.js";
import { state } from "../state.js";
import { ADMIN_EMAIL } from "../config.js";
import { lc, displayName } from "../utils.js";
import { t } from "../i18n/index.js";
import { uploadToImgBB } from "./imgbb.js";

const notifyUserUpdated = () => document.dispatchEvent(new CustomEvent("kh:user-updated"));

/** Human-readable message for a Firebase auth error ("" = ignore silently). */
export function authError(e) {
  const c = e?.code || "";
  if (/invalid-credential|wrong-password|user-not-found/.test(c)) return t("err_creds");
  if (c.includes("email-already-in-use")) return t("err_exists");
  if (c.includes("weak-password")) return t("err_weak");
  if (c.includes("invalid-email")) return t("err_email");
  if (/popup-closed|cancelled-popup/.test(c)) return "";
  return t("err_generic");
}

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithEmail = (email, pass) => signInWithEmailAndPassword(auth, email, pass);
export const logout = () => signOut(auth);

export async function registerWithEmail(name, email, pass) {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(cred.user, { displayName: name || email.split("@")[0] });
  sendEmailVerification(cred.user).catch(() => {});
  notifyUserUpdated();
}

/** Update display name / avatar (image goes to ImgBB, URL is stored in Firestore). */
export async function saveProfile({ name, file }) {
  const u = auth.currentUser;
  const photoURL = file ? await uploadToImgBB(file) : (u.photoURL || "");
  await updateProfile(u, { displayName: name, photoURL });
  await setDoc(doc(db, "users", u.uid),
    { email: lc(u.email), displayName: name, photoURL, lastSeen: Date.now() }, { merge: true });
  notifyUserUpdated();
}

/** Admin = verified Super Admin email. Uploader = admin or listed in /uploaders. */
export async function resolvePerms() {
  const u = state.user;
  state.isAdmin = !!(u && u.emailVerified && lc(u.email) === ADMIN_EMAIL);
  state.canUpload = state.isAdmin;
  if (u && u.emailVerified && !state.isAdmin) {
    try { state.canUpload = (await getDoc(doc(db, "uploaders", lc(u.email)))).exists(); }
    catch { state.canUpload = false; }
  }
}

export function watchAuth(onChange) {
  onAuthStateChanged(auth, async user => {
    state.user = user;
    state.authReady = true;
    state.admin.loaded = false;
    await resolvePerms();
    if (user) {
      setDoc(doc(db, "users", user.uid),
        { email: lc(user.email), displayName: displayName(user), photoURL: user.photoURL || "", lastSeen: Date.now() },
        { merge: true }).catch(() => {});
    }
    onChange(user);
  });
}
