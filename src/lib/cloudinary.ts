import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cacheLife, cacheTag } from "next/cache";
import { imageSlots, SLOT_FOLDER, type ImageSlot, type UploadedImage } from "@/lib/image-slots";

export const IMAGES_TAG = "imagenes";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

// Sin las tres variables el sitio sigue funcionando con las imágenes locales y /admin avisa.
export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

const apiBase = `https://api.cloudinary.com/v1_1/${cloudName}`;
const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;

type Resource = { public_id: string; version: number; created_at: string; context?: { custom?: { alt?: string } } };

function imageUrl(slot: ImageSlot, version: number, publicId: string) {
  const t = `c_fill,g_auto,w_${slot.width},h_${slot.height},f_auto,q_auto`;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${t}/v${version}/${publicId}`;
}

async function listResources(): Promise<Resource[]> {
  const url = `${apiBase}/resources/image/upload?prefix=${encodeURIComponent(`${SLOT_FOLDER}/`)}&context=true&max_results=500`;
  const res = await fetch(url, { headers: { Authorization: authHeader }, cache: "no-store" });
  if (!res.ok) throw new Error(`Cloudinary respondió ${res.status}`);
  return ((await res.json()) as { resources: Resource[] }).resources;
}

function groupBySlot(resources: Resource[]): Record<string, UploadedImage[]> {
  const out: Record<string, UploadedImage[]> = {};
  for (const slot of imageSlots) {
    out[slot.id] = resources
      .filter((r) => r.public_id.startsWith(`${slot.folder}/`))
      .sort((a, b) => a.created_at.localeCompare(b.created_at)) // orden de subida: la primera es la portada
      .map((r, i) => ({
        publicId: r.public_id,
        src: imageUrl(slot, r.version, r.public_id),
        width: slot.width,
        height: slot.height,
        alt: r.context?.custom?.alt?.trim() || `${slot.label}, foto ${i + 1}`,
      }));
  }
  return out;
}

// Fotos subidas por ranura (id de ranura → fotos en orden). Vacío si no hay Cloudinary o falla la consulta.
// El resultado se guarda en caché y se renueva al subir o borrar (updateTag) o cada pocas horas.
export async function getUploadedImages(): Promise<Record<string, UploadedImage[]>> {
  "use cache";
  cacheTag(IMAGES_TAG);
  cacheLife("hours");

  if (!isCloudinaryConfigured) return {};
  try {
    return groupBySlot(await listResources());
  } catch (error) {
    console.error("No se pudieron leer las imágenes de Cloudinary:", error);
    cacheLife("minutes"); // no fijar el fallo durante horas
    return {};
  }
}

// Cuántas fotos tiene hoy una ranura, consultando Cloudinary directamente (sin caché).
export async function countSlotPhotos(slot: ImageSlot): Promise<number> {
  return (groupBySlot(await listResources())[slot.id] ?? []).length;
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

// Datos firmados para que el navegador suba una foto directo a Cloudinary (el secreto no sale del servidor).
// Cada foto lleva un identificador único dentro de la carpeta de su ranura.
export function createUploadSignature(slot: ImageSlot, alt: string) {
  const params = {
    allowed_formats: "jpg,jpeg,png,webp",
    context: contextValue(alt),
    public_id: `${slot.folder}/${Date.now().toString(36)}-${randomBytes(3).toString("hex")}`,
    timestamp: Math.floor(Date.now() / 1000),
  };
  return {
    url: `${apiBase}/image/upload`,
    fields: { ...params, api_key: apiKey!, signature: sign(params) },
  };
}

// Borra una foto de la galería de una ranura. Solo acepta identificadores dentro de la carpeta de esa ranura.
export async function deleteUploadedImage(slot: ImageSlot, publicId: string) {
  if (!publicId.startsWith(`${slot.folder}/`) || publicId.includes("..")) throw new Error("Foto no válida");
  const res = await fetch(`${apiBase}/resources/image/upload?public_ids[]=${encodeURIComponent(publicId)}&invalidate=true`, {
    method: "DELETE",
    headers: { Authorization: authHeader },
  });
  if (!res.ok) throw new Error(`Cloudinary respondió ${res.status}`);
}
