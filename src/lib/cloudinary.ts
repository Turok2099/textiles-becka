import "server-only";
import { createHash } from "node:crypto";
import { cacheLife, cacheTag } from "next/cache";
import { imageSlots, SLOT_FOLDER, type ImageSlot, type SlotImage } from "@/lib/image-slots";

export const IMAGES_TAG = "imagenes";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

// Sin las tres variables el sitio sigue funcionando con las imágenes locales y /admin avisa.
export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

const apiBase = `https://api.cloudinary.com/v1_1/${cloudName}`;
const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;

type Resource = { public_id: string; version: number; context?: { custom?: { alt?: string } } };

function imageUrl(slot: ImageSlot, version: number) {
  const t = `c_fill,g_auto,w_${slot.width},h_${slot.height},f_auto,q_auto`;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${t}/v${version}/${slot.publicId}`;
}

// Imágenes subidas por ranura (id de ranura → imagen). Vacío si no hay Cloudinary o falla la consulta.
// El resultado se guarda en caché y se renueva al subir o restaurar (updateTag) o cada pocas horas.
export async function getUploadedImages(): Promise<Record<string, SlotImage>> {
  "use cache";
  cacheTag(IMAGES_TAG);
  cacheLife("hours");

  if (!isCloudinaryConfigured) return {};
  try {
    const url = `${apiBase}/resources/image/upload?prefix=${encodeURIComponent(`${SLOT_FOLDER}/`)}&context=true&max_results=100`;
    const res = await fetch(url, { headers: { Authorization: authHeader } });
    if (!res.ok) throw new Error(`Cloudinary respondió ${res.status}`);
    const { resources } = (await res.json()) as { resources: Resource[] };
    const out: Record<string, SlotImage> = {};
    for (const slot of imageSlots) {
      const r = resources.find((x) => x.public_id === slot.publicId);
      if (!r) continue;
      out[slot.id] = {
        src: imageUrl(slot, r.version),
        width: slot.width,
        height: slot.height,
        alt: r.context?.custom?.alt?.trim() || slot.fallback.alt,
      };
    }
    return out;
  } catch (error) {
    console.error("No se pudieron leer las imágenes de Cloudinary:", error);
    cacheLife("minutes"); // no fijar el fallo durante horas
    return {};
  }
}

// Valor del campo `context` de Cloudinary: "alt=texto" con = | \ escapados.
function contextValue(alt: string) {
  return `alt=${alt.replace(/([=|\\])/g, "\\$1")}`;
}

function sign(params: Record<string, string | number>) {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

// Datos firmados para que el navegador suba la imagen directo a Cloudinary (el secreto no sale del servidor).
export function createUploadSignature(slot: ImageSlot, alt: string) {
  const params = {
    allowed_formats: "jpg,jpeg,png,webp",
    context: contextValue(alt),
    invalidate: "true",
    overwrite: "true",
    public_id: slot.publicId,
    timestamp: Math.floor(Date.now() / 1000),
  };
  return {
    url: `${apiBase}/image/upload`,
    fields: { ...params, api_key: apiKey!, signature: sign(params) },
  };
}

// Borra la imagen subida de una ranura; el sitio vuelve a usar la imagen local de respaldo.
export async function deleteUploadedImage(slot: ImageSlot) {
  const res = await fetch(`${apiBase}/resources/image/upload?public_ids[]=${encodeURIComponent(slot.publicId)}&invalidate=true`, {
    method: "DELETE",
    headers: { Authorization: authHeader },
  });
  if (!res.ok) throw new Error(`Cloudinary respondió ${res.status}`);
}
