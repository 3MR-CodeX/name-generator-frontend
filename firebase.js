// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
apiKey: "AIzaSyDT7kkBgflIKI432uxY\_piFueCzmqmPD6U",
authDomain: "nameit-app-nit.firebaseapp.com",
projectId: "nameit-app-nit",
storageBucket: "nameit-app-nit.firebasestorage.app",
messagingSenderId: "255958152641",
appId: "1:255958152641\:web\:d56fa5b2c95945bac5ab40",
measurementId: "G-J9XGX5BVFR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// auth helpers
export async function signUp(email, password) {
return createUserWithEmailAndPassword(auth, email, password);
}
export async function signIn(email, password) {
return signInWithEmailAndPassword(auth, email, password);
}
export async function signInWithGoogle() {
return signInWithPopup(auth, googleProvider);
}
export function signOutUser() {
return signOut(auth);
}
export function onUserStateChange(callback) {
return onAuthStateChanged(auth, callback);
}
