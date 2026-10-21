"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { assertAdmin, createSession, credentialsAreValid, destroySession } from "@/lib/auth";
import { countSlotPhotos, createUploadSignature, deleteUploadedImage, IMAGES_TAG, isCloudinaryConfigured } from "@/lib/cloudinary";
import { findSlot, MAX_PHOTOS } from "@/lib/image-slots";

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

export type SignaturesResult =
  | { ok: true; uploads: { url: string; fields: Record<string, string | number> }[] }
  | { ok: false; error: string };

// Paso 1 de la subida: valida ranura y cupo y devuelve una firma por foto para Cloudinary.
export async function getUploadSignatures(slotId: string, count: number, alt: string): Promise<SignaturesResult> {
  await assertAdmin();
  if (!isCloudinaryConfigured) return { ok: false, error: "Cloudinary no está configurado en el servidor." };
  const slot = findSlot(slotId);
  if (!slot) return { ok: false, error: "Sección desconocida." };
  if (!Number.isInteger(count) || count < 1) return { ok: false, error: "Elige al menos una foto." };

  let current: number;
  try {
    current = await countSlotPhotos(slot);
  } catch {
    return { ok: false, error: "No se pudo consultar Cloudinary. Inténtalo de nuevo." };
  }
  const room = MAX_PHOTOS - current;
  if (count > room) {
    return {
      ok: false,
      error: room <= 0 ? `Esta sección ya tiene el máximo de ${MAX_PHOTOS} fotos. Borra alguna para subir otra.` : `Solo caben ${room} foto(s) más en esta sección (máximo ${MAX_PHOTOS}).`,
    };
  }

  const cleanAlt = alt.trim().slice(0, 200);
  const uploads = Array.from({ length: count }, (_, i) => {
    const text = cleanAlt ? (count > 1 ? `${cleanAlt} (${i + 1})` : cleanAlt) : `${slot.label}, foto ${current + i + 1}`;
    return createUploadSignature(slot, text);
  });
  return { ok: true, uploads };
}

// Paso 2: el navegador ya subió las fotos; renueva la caché para que el sitio las muestre de inmediato.
export async function confirmUpload() {
  await assertAdmin();
  updateTag(IMAGES_TAG);
}

export async function deletePhoto(slotId: string, publicId: string): Promise<{ ok: boolean; error?: string }> {
  await assertAdmin();
  const slot = findSlot(slotId);
  if (!slot) return { ok: false, error: "Sección desconocida." };
  try {
    await deleteUploadedImage(slot, publicId);
  } catch {
    return { ok: false, error: "No se pudo borrar la foto. Inténtalo de nuevo." };
  }
  updateTag(IMAGES_TAG);
  return { ok: true };
}
