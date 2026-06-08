import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  updateEmail,
  User,
} from "firebase/auth";
import { auth } from "./client";

export async function register(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");
  try {
    // Intenta popup primero (escritorio)
    return await signInWithPopup(auth, provider);
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? "";
    // Si el popup es bloqueado → usa redirect (móvil/Safari)
    if (code === "auth/popup-blocked" || code === "auth/popup-closed-by-user") {
      await signInWithRedirect(auth, provider);
      // getRedirectResult se maneja en la página al volver
      return null;
    }
    throw err;
  }
}

export async function getGoogleRedirectResult() {
  return getRedirectResult(auth);
}

export async function logout() {
  return signOut(auth);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function cambiarEmail(user: User, nuevoEmail: string) {
  return updateEmail(user, nuevoEmail);
}
