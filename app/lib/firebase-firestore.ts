import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  WithFieldValue,
  UpdateData,
} from 'firebase/firestore'
import { db } from './firebase'

// ─── Obtener un documento por ID ──────────────────────────────────────────────
export async function getDocument<T = DocumentData>(
  collectionName: string,
  id: string
): Promise<T | null> {
  const ref = doc(db, collectionName, id)
  const snap = await getDoc(ref)
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null
}

// ─── Obtener colección (con filtros opcionales) ───────────────────────────────
export async function getCollection<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const ref = collection(db, collectionName)
  const q = constraints.length ? query(ref, ...constraints) : query(ref)
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)
}

// ─── Crear documento (ID automático) ─────────────────────────────────────────
export async function createDocument<T extends DocumentData>(
  collectionName: string,
  data: WithFieldValue<T>
): Promise<string> {
  const ref = await addDoc(collection(db, collectionName), data)
  return ref.id
}

// ─── Crear/sobrescribir documento con ID fijo ─────────────────────────────────
export async function setDocument<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: WithFieldValue<T>
): Promise<void> {
  return setDoc(doc(db, collectionName, id), data)
}

// ─── Actualizar campos de un documento ───────────────────────────────────────
export async function updateDocument<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: UpdateData<T>
): Promise<void> {
  return updateDoc(doc(db, collectionName, id), data)
}

// ─── Eliminar un documento ────────────────────────────────────────────────────
export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<void> {
  return deleteDoc(doc(db, collectionName, id))
}

// ─── Re-exportar helpers de query para uso en componentes ────────────────────
export { where, orderBy, limit }
