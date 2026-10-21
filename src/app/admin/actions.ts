"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { assertAdmin, createSession, credentialsAreValid, destroySession } from "@/lib/auth";
import { createUploadSignature, deleteUploadedImage, IMAGES_TAG, isCloudinaryConfigured } from "@/lib/cloudinary";
import { findSlot } from "@/lib/image-slots";

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

export type SignatureResult =
  | { ok: true; url: string; fields: Record<string, string | number> }
  | { ok: false; error: string };

// Paso 1 de la subida: valida ranura y texto alternativo y devuelve la firma para Cloudinary.
export async function getUploadSignature(slotId: string, alt: string): Promise<SignatureResult> {
  await assertAdmin();
  if (!isCloudinaryConfigured) return { ok: false, error: "Cloudinary no está configurado en el servidor." };
  const slot = findSlot(slotId);
  if (!slot) return { ok: false, error: "Sección desconocida." };
  const cleanAlt = alt.trim().slice(0, 200);
  if (!cleanAlt) return { ok: false, error: "Describe la imagen en el texto alternativo." };
  return { ok: true, ...createUploadSignature(slot, cleanAlt) };
}

// Paso 2: el navegador ya subió el archivo; renueva la caché para que el sitio lo muestre de inmediato.
export async function confirmUpload() {
  await assertAdmin();
  updateTag(IMAGES_TAG);
}

export async function restoreOriginal(slotId: string): Promise<{ ok: boolean; error?: string }> {
  await assertAdmin();
  const slot = findSlot(slotId);
  if (!slot) return { ok: false, error: "Sección desconocida." };
  try {
    await deleteUploadedImage(slot);
  } catch {
    return { ok: false, error: "No se pudo restaurar la imagen original. Inténtalo de nuevo." };
  }
  updateTag(IMAGES_TAG);
  return { ok: true };
}
