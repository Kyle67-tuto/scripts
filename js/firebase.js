// Firebase initialisation. Bare specifiers ("firebase/app" ...) are resolved
// by the import map in index.html (CDN). With a bundler (Vite/webpack) they
// resolve from node_modules and the import map can be removed.
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Re-exported so the rest of the app never touches the SDK URLs directly.
export {
  signInWithPopup, signOut, onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  updateProfile, sendEmailVerification
} from "firebase/auth";

export {
  collection, doc, getDoc, getDocs, setDoc, updateDoc,
  query, orderBy, limit, addDoc, deleteDoc
} from "firebase/firestore";
