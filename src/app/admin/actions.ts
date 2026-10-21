"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { assertAdmin, createSession, credentialsAreValid, destroySession } from "@/lib/auth";
import {
  confirmUploaded,
  createUploadSignature,
  IMAGES_TAG,
  isCloudinaryConfigured,
  listSlotPhotos,
  restorePhoto,
  saveFraming,
  saveOrder,
  trashPhoto,
} from "@/lib/cloudinary";
import { findSlot, MAX_PHOTOS, type UploadedImage } from "@/lib/image-slots";

export type LoginState = { error?: string };

// Límite de intentos por IP, en memoria: es un freno básico, no sustituye una contraseña larga.
const attempts = new Map<string, { count: number; since: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && now - entry.since < WINDOW_MS && entry.count >= MAX_ATTEMPTS) {
    return { error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." };
  }

  const user = String(formData.get("usuario") ?? "");
  const password = String(formData.get("contrasena") ?? "");
  if (!credentialsAreValid(user, password)) {
    const fresh = entry && now - entry.since < WINDOW_MS ? entry : { count: 0, since: now };
    attempts.set(ip, { count: fresh.count + 1, since: fresh.since });
    await new Promise((r) => setTimeout(r, 1000));
    return { error: "Usuario o contraseña incorrectos." };
  }

  attempts.delete(ip);
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// Los cambios se guardan solos: cada acción confirma contra Cloudinary y devuelve la lista oficial de fotos
// de la categoría. La pantalla solo dice "guardado" cuando recibe esta respuesta.
export type PhotosResult = { ok: true; photos: UploadedImage[] } | { ok: false; error: string };

async function withSlot(slotId: string, run: (slot: NonNullable<ReturnType<typeof findSlot>>) => Promise<UploadedImage[]>): Promise<PhotosResult> {
  await assertAdmin();
  if (!isCloudinaryConfigured) return { ok: false, error: "Cloudinary no está configurado en el servidor." };
  const slot = findSlot(slotId);
  if (!slot) return { ok: false, error: "Categoría desconocida." };
  try {
    const photos = await run(slot);
    updateTag(IMAGES_TAG);
    return { ok: true, photos };
  } catch (error) {
    console.error("Error al guardar cambios de fotos:", error);
    return { ok: false, error: error instanceof Error && error.message.startsWith("Ya no") ? error.message : "No se pudo guardar. Revisa tu conexión e inténtalo de nuevo." };
  }
}

export type SignaturesResult =
  | { ok: true; uploads: { url: string; fields: Record<string, string | number> }[] }
  | { ok: false; error: string };

// Paso 1 de la subida: valida categoría y cupo y devuelve una firma por foto para Cloudinary.
export async function getUploadSignatures(slotId: string, count: number): Promise<SignaturesResult> {
  await assertAdmin();
  if (!isCloudinaryConfigured) return { ok: false, error: "Cloudinary no está configurado en el servidor." };
  const slot = findSlot(slotId);
  if (!slot) return { ok: false, error: "Categoría desconocida." };
  if (!Number.isInteger(count) || count < 1 || count > MAX_PHOTOS) return { ok: false, error: "Elige entre 1 y 8 fotos." };

  let current: number;
  try {
    current = (await listSlotPhotos(slot)).length;
  } catch {
    return { ok: false, error: "No se pudo consultar Cloudinary. Revisa tu conexión e inténtalo de nuevo." };
  }
  if (count > MAX_PHOTOS - current) {
    return { ok: false, error: MAX_PHOTOS - current <= 0 ? "Has agregado las 8 fotos disponibles." : `Solo caben ${MAX_PHOTOS - current} foto(s) más en esta categoría.` };
  }

  const now = Date.now();
  return {
    ok: true,
    uploads: Array.from({ length: count }, (_, i) => createUploadSignature(slot, `${slot.label}, foto ${current + i + 1}`, now + i)),
  };
}

// Paso 2: la foto ya está en Cloudinary; el servidor lo comprueba y renueva el sitio.
export async function confirmUpload(slotId: string, publicIds: string[]) {
  return withSlot(slotId, (slot) => confirmUploaded(slot, publicIds.slice(0, MAX_PHOTOS)));
}

export async function reorderPhotos(slotId: string, orderedIds: string[]) {
  return withSlot(slotId, (slot) => saveOrder(slot, orderedIds.slice(0, MAX_PHOTOS)));
}

export async function setFraming(slotId: string, publicId: string, focus: { fx: number; fy: number } | null) {
  return withSlot(slotId, (slot) => saveFraming(slot, publicId, focus));
}

export async function removePhoto(slotId: string, publicId: string) {
  return withSlot(slotId, (slot) => trashPhoto(slot, publicId));
}

export async function undoRemovePhoto(slotId: string, publicId: string) {
  return withSlot(slotId, (slot) => restorePhoto(slot, publicId));
}
