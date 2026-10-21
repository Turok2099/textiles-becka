import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cacheLife, cacheTag } from "next/cache";
import { imageSlots, MAX_PHOTOS, SLOT_ROOT, type ImageSlot, type UploadedImage } from "@/lib/image-slots";

export const IMAGES_TAG = "imagenes";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

// Sin las tres variables el sitio sigue funcionando con las imágenes locales y /admin avisa.
export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

const apiBase = `https://api.cloudinary.com/v1_1/${cloudName}`;
const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;

// Datos que se guardan en cada foto (campo `context` de Cloudinary, sin base de datos):
//   alt     texto alternativo
//   pos     orden en la galería (menor primero; sin valor se usa la fecha de subida)
//   fx, fy  centro del encuadre en % de la foto original (sin valor o "auto": recorte automático)
//   trashed hora (ms) en que se eliminó; 0 o sin valor = foto activa. Permite "deshacer" unos minutos.
type Resource = {
  public_id: string;
  version: number;
  created_at: string;
  width: number;
  height: number;
  context?: { custom?: Record<string, string | undefined> };
};

const TRASH_GRACE_MS = 10 * 60 * 1000;

function num(v: string | undefined) {
  const n = Number(v);
  return v !== undefined && v !== "" && Number.isFinite(n) ? n : undefined;
}

function isTrashed(r: Resource) {
  return (num(r.context?.custom?.trashed) ?? 0) > 0;
}

function orderKey(r: Resource) {
  return num(r.context?.custom?.pos) ?? Date.parse(r.created_at);
}

function transformUrl(r: Resource, version: number, t: string) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${t}/v${version}/${r.public_id}`;
}

function toImage(slot: ImageSlot, r: Resource, index: number): UploadedImage {
  const fx = num(r.context?.custom?.fx);
  const fy = num(r.context?.custom?.fy);
  const focus =
    fx !== undefined && fy !== undefined
      ? `g_xy_center,x_${Math.round((r.width * fx) / 100)},y_${Math.round((r.height * fy) / 100)}`
      : "g_auto";
  const crop = (w: number, h: number) => `c_fill,${focus},w_${w},h_${h},f_auto,q_auto`;
  return {
    publicId: r.public_id,
    src: transformUrl(r, r.version, crop(slot.width, slot.height)),
    thumb: transformUrl(r, r.version, crop(240, Math.round((240 * slot.height) / slot.width))),
    full: transformUrl(r, r.version, "c_limit,w_1400,f_auto,q_auto"),
    origWidth: r.width,
    origHeight: r.height,
    fx,
    fy,
    width: slot.width,
    height: slot.height,
    alt: r.context?.custom?.alt?.trim() || `${slot.label}, foto ${index + 1}`,
  };
}

// Cloudinary entrega hasta 500 recursos por consulta; se sigue el cursor hasta leerlos todos para no cortar la lista en silencio.
async function listResources(): Promise<Resource[]> {
  const all: Resource[] = [];
  let cursor: string | undefined;
  do {
    const url = `${apiBase}/resources/image/upload?prefix=${encodeURIComponent(`${SLOT_ROOT}/`)}&context=true&max_results=500${cursor ? `&next_cursor=${encodeURIComponent(cursor)}` : ""}`;
    const res = await fetch(url, { headers: { Authorization: authHeader }, cache: "no-store" });
    if (!res.ok) throw new Error(`Cloudinary respondió ${res.status}`);
    const page = (await res.json()) as { resources: Resource[]; next_cursor?: string };
    all.push(...page.resources);
    cursor = page.next_cursor;
  } while (cursor);
  return all;
}

function photosOf(slot: ImageSlot, resources: Resource[]): UploadedImage[] {
  return resources
    .filter((r) => r.public_id.startsWith(`${slot.folder}/`) && !isTrashed(r))
    .sort((a, b) => orderKey(a) - orderKey(b)) // la primera es la portada
    .map((r, i) => toImage(slot, r, i));
}

function groupBySlot(resources: Resource[]): Record<string, UploadedImage[]> {
  return Object.fromEntries(imageSlots.map((slot) => [slot.id, photosOf(slot, resources)]));
}

// Fotos subidas por ranura (id de ranura → fotos en orden). Vacío si no hay Cloudinary o falla la consulta.
// El resultado se guarda en caché y se renueva al cambiar algo (updateTag) o cada pocas horas.
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

// Fotos actuales de una ranura consultando Cloudinary directamente (sin caché). Es la lectura "oficial" tras cada cambio.
export async function listSlotPhotos(slot: ImageSlot): Promise<UploadedImage[]> {
  return photosOf(slot, await listResources());
}

// Valor del campo `context` de Cloudinary: "k=v|k2=v2" con = | \ escapados en los valores.
function contextValue(values: Record<string, string | number>) {
  return Object.entries(values)
    .map(([k, v]) => `${k}=${String(v).replace(/([=|\\])/g, "\\$1")}`)
    .join("|");
}

// Actualiza (fusiona) datos del contexto de una foto.
async function updateContext(publicId: string, values: Record<string, string | number>) {
  const res = await fetch(`${apiBase}/image/context`, {
    method: "POST",
    headers: { Authorization: authHeader },
    body: new URLSearchParams({
      command: "add",
      context: contextValue(values),
      public_ids: publicId,
      timestamp: String(Math.floor(Date.now() / 1000)),
    }),
  });
  if (!res.ok) throw new Error(`Cloudinary respondió ${res.status}`);
}

function sign(params: Record<string, string | number>) {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

// Datos firmados para que el navegador suba una foto directo a Cloudinary (el secreto no sale del servidor).
// Cada foto lleva un identificador único en la carpeta de su ranura y entra al final de la galería (pos = hora de subida).
export function createUploadSignature(slot: ImageSlot, alt: string, pos: number) {
  const params = {
    allowed_formats: "jpg,jpeg,png,webp",
    context: contextValue({ alt, pos }),
    public_id: `${slot.folder}/${Date.now().toString(36)}-${randomBytes(3).toString("hex")}`,
    timestamp: Math.floor(Date.now() / 1000),
  };
  return {
    url: `${apiBase}/image/upload`,
    fields: { ...params, api_key: apiKey!, signature: sign(params) },
  };
}

async function hardDelete(publicId: string) {
  const res = await fetch(`${apiBase}/resources/image/upload?public_ids[]=${encodeURIComponent(publicId)}&invalidate=true`, {
    method: "DELETE",
    headers: { Authorization: authHeader },
  });
  if (!res.ok) throw new Error(`Cloudinary respondió ${res.status}`);
}

function assertInSlot(slot: ImageSlot, publicId: string) {
  if (!publicId.startsWith(`${slot.folder}/`) || publicId.includes("..")) throw new Error("Foto no válida");
}

// Comprueba que las fotos recién subidas existen en Cloudinary (confirmación del servidor).
export async function confirmUploaded(slot: ImageSlot, publicIds: string[]) {
  const resources = await listResources();
  for (const id of publicIds) {
    assertInSlot(slot, id);
    if (!resources.some((r) => r.public_id === id)) throw new Error("La foto no llegó al servidor");
  }
  return photosOf(slot, resources);
}

// Guarda el orden: la primera foto de la lista es la portada.
export async function saveOrder(slot: ImageSlot, orderedIds: string[]) {
  const active = (await listResources()).filter((r) => r.public_id.startsWith(`${slot.folder}/`) && !isTrashed(r));
  const current = active.map((r) => r.public_id);
  const same = orderedIds.length === current.length && new Set(orderedIds).size === current.length && orderedIds.every((id) => current.includes(id));
  if (!same) throw new Error("La galería cambió; recarga la página");
  // Solo se reescriben las fotos cuya posición cambia (con 20 fotos evita decenas de llamadas por cada movimiento).
  const posOf = new Map(active.map((r) => [r.public_id, num(r.context?.custom?.pos)]));
  await Promise.all(orderedIds.map((id, i) => (posOf.get(id) === (i + 1) * 10 ? null : updateContext(id, { pos: (i + 1) * 10 }))));
  return listSlotPhotos(slot);
}

// Guarda el centro del encuadre (en % de la foto original) o vuelve al recorte automático (null).
export async function saveFraming(slot: ImageSlot, publicId: string, focus: { fx: number; fy: number } | null) {
  assertInSlot(slot, publicId);
  if (focus && !(focus.fx >= 0 && focus.fx <= 100 && focus.fy >= 0 && focus.fy <= 100)) throw new Error("Encuadre no válido");
  await updateContext(publicId, focus ? { fx: Math.round(focus.fx * 10) / 10, fy: Math.round(focus.fy * 10) / 10 } : { fx: "auto", fy: "auto" });
  return listSlotPhotos(slot);
}

// Elimina con posibilidad de deshacer: la foto se oculta del sitio y se borra del todo pasados 10 minutos.
export async function trashPhoto(slot: ImageSlot, publicId: string) {
  assertInSlot(slot, publicId);
  await updateContext(publicId, { trashed: Date.now() });
  // Limpieza de papelera: borra lo eliminado hace más de TRASH_GRACE_MS (cualquier ranura).
  try {
    const expired = (await listResources()).filter((r) => {
      const t = num(r.context?.custom?.trashed) ?? 0;
      return t > 0 && Date.now() - t > TRASH_GRACE_MS;
    });
    await Promise.all(expired.map((r) => hardDelete(r.public_id)));
  } catch (error) {
    console.error("No se pudo vaciar la papelera de Cloudinary:", error);
  }
  return listSlotPhotos(slot);
}

export async function restorePhoto(slot: ImageSlot, publicId: string) {
  assertInSlot(slot, publicId);
  const resources = await listResources();
  const target = resources.find((r) => r.public_id === publicId);
  if (!target) throw new Error("Ya no se puede deshacer");
  if (photosOf(slot, resources).length >= MAX_PHOTOS) throw new Error(`La categoría ya tiene las ${MAX_PHOTOS} fotos`);
  await updateContext(publicId, { trashed: 0 });
  return listSlotPhotos(slot);
}
