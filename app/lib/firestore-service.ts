"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
  QueryConstraint,
  DocumentReference,
  CollectionReference,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Usuario,
  Empresa,
  Vacante,
  Candidato,
  Postulacion,
  Match,
  Conversacion,
  Mensaje,
} from "./types";

// ── Helpers ───────────────────────────────────────────────────────────────────
function col<T>(path: string) {
  return collection(db, path) as CollectionReference<T>;
}
function ref<T>(path: string, id: string) {
  return doc(db, path, id) as DocumentReference<T>;
}
async function getOne<T>(path: string, id: string): Promise<T | null> {
  const snap = await getDoc(doc(db, path, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
}
async function getMany<T>(
  path: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const q = query(collection(db, path), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

// ─────────────────────────────────────────────────────────────────────────────
// USUARIOS
// ─────────────────────────────────────────────────────────────────────────────
export const usuariosService = {
  get: (uid: string) => getOne<Usuario>("usuarios", uid),

  set: (uid: string, data: Partial<Usuario>) =>
    setDoc(ref("usuarios", uid), { ...data, uid }, { merge: true }),

  update: (uid: string, data: Partial<Usuario>) =>
    updateDoc(ref("usuarios", uid), data as Record<string, unknown>),
};

// ─────────────────────────────────────────────────────────────────────────────
// EMPRESAS
// ─────────────────────────────────────────────────────────────────────────────
export const empresasService = {
  get: (uid: string) => getOne<Empresa>("empresas", uid),

  set: (uid: string, data: Partial<Empresa>) =>
    setDoc(ref("empresas", uid), { ...data, uid, updatedAt: serverTimestamp() }, { merge: true }),

  update: (uid: string, data: Partial<Empresa>) =>
    updateDoc(ref("empresas", uid), { ...data, updatedAt: serverTimestamp() } as Record<string, unknown>),
};

// ─────────────────────────────────────────────────────────────────────────────
// CANDIDATOS
// ─────────────────────────────────────────────────────────────────────────────
export const candidatosService = {
  get: (uid: string) => getOne<Candidato>("candidatos", uid),

  listar: () => getMany<Candidato>("candidatos"),

  set: (uid: string, data: Partial<Candidato>) =>
    setDoc(ref("candidatos", uid), { ...data, uid, updatedAt: serverTimestamp() }, { merge: true }),

  update: (uid: string, data: Partial<Candidato>) =>
    updateDoc(ref("candidatos", uid), { ...data, updatedAt: serverTimestamp() } as Record<string, unknown>),
};

// ─────────────────────────────────────────────────────────────────────────────
// VACANTES
// ─────────────────────────────────────────────────────────────────────────────
export const vacantesService = {
  get: (id: string) => getOne<Vacante>("vacantes", id),

  listar: (constraints: QueryConstraint[] = []) =>
    getMany<Vacante>("vacantes", constraints),

  porEmpresa: (empresaId: string, estado?: Vacante["estado"]) => {
    const c: QueryConstraint[] = [
      where("empresaId", "==", empresaId),
      orderBy("createdAt", "desc"),
    ];
    if (estado) c.splice(1, 0, where("estado", "==", estado));
    return getMany<Vacante>("vacantes", c);
  },

  create: async (data: Omit<Vacante, "id" | "createdAt" | "updatedAt" | "vistas" | "totalPostulaciones">) => {
    const docRef = await addDoc(col<Vacante>("vacantes"), {
      ...data,
      vistas: 0,
      totalPostulaciones: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as unknown as Vacante);
    return docRef.id;
  },

  update: (id: string, data: Partial<Vacante>) =>
    updateDoc(ref("vacantes", id), { ...data, updatedAt: serverTimestamp() } as Record<string, unknown>),

  delete: (id: string) => deleteDoc(ref("vacantes", id)),

  incrementarVistas: (id: string) =>
    updateDoc(ref("vacantes", id), { vistas: increment(1) }),
};

// ─────────────────────────────────────────────────────────────────────────────
// POSTULACIONES
// ─────────────────────────────────────────────────────────────────────────────
export const postulacionesService = {
  get: (id: string) => getOne<Postulacion>("postulaciones", id),

  porVacante: (vacanteId: string) =>
    getMany<Postulacion>("postulaciones", [
      where("vacanteId", "==", vacanteId),
      orderBy("matchScore", "desc"),
    ]),

  porEmpresa: (empresaId: string, estado?: Postulacion["estado"]) => {
    const c: QueryConstraint[] = [where("empresaId", "==", empresaId), orderBy("createdAt", "desc")];
    if (estado) c.splice(1, 0, where("estado", "==", estado));
    return getMany<Postulacion>("postulaciones", c);
  },

  porCandidato: (candidatoId: string) =>
    getMany<Postulacion>("postulaciones", [
      where("candidatoId", "==", candidatoId),
      orderBy("createdAt", "desc"),
    ]),

  create: async (data: Omit<Postulacion, "id" | "createdAt" | "updatedAt">) => {
    const docRef = await addDoc(col<Postulacion>("postulaciones"), {
      ...data,
      estado: "nueva",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as unknown as Postulacion);
    // incrementar contador en la vacante
    await vacantesService.update(data.vacanteId, {
      totalPostulaciones: increment(1) as unknown as number,
    });
    return docRef.id;
  },

  cambiarEstado: (id: string, estado: Postulacion["estado"]) =>
    updateDoc(ref("postulaciones", id), { estado, updatedAt: serverTimestamp() }),

  agregarNota: (id: string, nota: string) =>
    updateDoc(ref("postulaciones", id), { notaInterna: nota, updatedAt: serverTimestamp() }),
};

// ─────────────────────────────────────────────────────────────────────────────
// MATCHES
// ─────────────────────────────────────────────────────────────────────────────
export const matchesService = {
  get: (id: string) => getOne<Match>("matches", id),

  porEmpresa: (empresaId: string, maxResults = 50) =>
    getMany<Match>("matches", [
      where("empresaId", "==", empresaId),
      orderBy("score", "desc"),
      limit(maxResults),
    ]),

  porVacante: (vacanteId: string) =>
    getMany<Match>("matches", [
      where("vacanteId", "==", vacanteId),
      orderBy("score", "desc"),
    ]),

  create: async (data: Omit<Match, "id" | "createdAt">) => {
    const docRef = await addDoc(col<Match>("matches"), {
      ...data,
      createdAt: serverTimestamp(),
    } as unknown as Match);
    return docRef.id;
  },

  upsert: async (data: Omit<Match, "id" | "createdAt">) => {
    const id = `${data.vacanteId}_${data.candidatoId}`;
    await setDoc(ref("matches", id), { ...data, createdAt: serverTimestamp() }, { merge: true });
    return id;
  },

  cambiarEstado: (id: string, estado: Match["estado"]) =>
    updateDoc(ref("matches", id), { estado }),
};

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSACIONES + MENSAJES
// ─────────────────────────────────────────────────────────────────────────────
export const conversacionesService = {
  get: (id: string) => getOne<Conversacion>("conversaciones", id),

  porUsuario: (uid: string) =>
    getMany<Conversacion>("conversaciones", [
      where("participantes", "array-contains", uid),
      orderBy("lastMessageAt", "desc"),
    ]),

  create: async (data: Omit<Conversacion, "id" | "createdAt" | "lastMessageAt" | "unreadCount">) => {
    const docRef = await addDoc(col<Conversacion>("conversaciones"), {
      ...data,
      unreadCount: 0,
      lastMessageAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    } as unknown as Conversacion);
    return docRef.id;
  },

  enviarMensaje: async (
    conversacionId: string,
    senderId: string,
    texto: string
  ): Promise<string> => {
    const msgRef = collection(db, `conversaciones/${conversacionId}/mensajes`);
    const docRef = await addDoc(msgRef, {
      senderId,
      texto,
      leido: false,
      createdAt: serverTimestamp(),
    });
    await updateDoc(ref("conversaciones", conversacionId), {
      lastMessage: texto,
      lastMessageAt: serverTimestamp(),
      lastSenderId: senderId,
      unreadCount: increment(1),
    });
    return docRef.id;
  },

  getMensajes: async (conversacionId: string): Promise<Mensaje[]> => {
    const snap = await getDocs(
      query(
        collection(db, `conversaciones/${conversacionId}/mensajes`),
        orderBy("createdAt", "asc")
      )
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Mensaje));
  },

  marcarLeidos: (conversacionId: string) =>
    updateDoc(ref("conversaciones", conversacionId), { unreadCount: 0 }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Re-exports de Firestore helpers para queries ad-hoc
// ─────────────────────────────────────────────────────────────────────────────
export { where, orderBy, limit, serverTimestamp };
