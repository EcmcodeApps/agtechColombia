"use client";

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/app/lib/firebase";

export type UploadProgress = (pct: number) => void;

// ── Logo de empresa ───────────────────────────────────────────────────────────
// Ruta: logos/{uid}/{timestamp}.{ext}
export async function uploadEmpresaLogo(
  uid: string,
  file: File,
  onProgress?: UploadProgress
): Promise<string> {
  const ext  = file.name.split(".").pop() ?? "jpg";
  const path = `logos/${uid}/${Date.now()}.${ext}`;
  return uploadFile(path, file, onProgress);
}

// ── CV de candidato ───────────────────────────────────────────────────────────
// Ruta: cvs/{uid}/{timestamp}.{ext}
export async function uploadCandidatoCV(
  uid: string,
  file: File,
  onProgress?: UploadProgress
): Promise<string> {
  const ext  = file.name.split(".").pop() ?? "pdf";
  const path = `cvs/${uid}/${Date.now()}.${ext}`;
  return uploadFile(path, file, onProgress);
}

// ── Eliminar archivo por URL de descarga ──────────────────────────────────────
export async function deleteStorageFile(downloadUrl: string): Promise<void> {
  try {
    const fileRef = ref(storage, downloadUrl);
    await deleteObject(fileRef);
  } catch {
    // Ignorar si el archivo ya no existe
  }
}

// ── Helper interno ────────────────────────────────────────────────────────────
function uploadFile(
  path: string,
  file: File,
  onProgress?: UploadProgress
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const task       = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    });

    task.on(
      "state_changed",
      (snap) => {
        if (onProgress) {
          onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        }
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}
