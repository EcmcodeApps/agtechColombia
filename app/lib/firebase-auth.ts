'use client'

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth'
import { auth } from './firebase'

// ─── Proveedores ─────────────────────────────────────────────────────────────
const googleProvider = new GoogleAuthProvider()

// ─── Registro con email ───────────────────────────────────────────────────────
export async function registerWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName) {
    await updateProfile(credential.user, { displayName })
  }
  return credential
}

// ─── Login con email ──────────────────────────────────────────────────────────
export async function loginWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password)
}

// ─── Login con Google ─────────────────────────────────────────────────────────
export async function loginWithGoogle(): Promise<UserCredential> {
  return signInWithPopup(auth, googleProvider)
}

// ─── Cerrar sesión ────────────────────────────────────────────────────────────
export async function logout(): Promise<void> {
  return signOut(auth)
}

// ─── Restablecer contraseña ───────────────────────────────────────────────────
export async function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email)
}

// ─── Observador de estado de sesión ──────────────────────────────────────────
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

// ─── Usuario actual ───────────────────────────────────────────────────────────
export function getCurrentUser(): User | null {
  return auth.currentUser
}
