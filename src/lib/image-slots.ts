// Ranuras de imagen editables desde /admin. Cada ranura es la galería de una card (hasta MAX_PHOTOS fotos).
// Mientras no tenga fotos subidas a Cloudinary se muestra su imagen local de respaldo, si existe;
// las cards que no tienen respaldo se ven sin foto, como antes.
// Para añadir una sección o card editable: agregarla aquí (las cards salen de los mismos datos que el sitio).

import { promoCategories } from "@/lib/promo";
import { products } from "@/lib/products";
import { services } from "@/lib/services";

export type SlotImage = { src: string; width: number; height: number; alt: string };

// Foto subida por la clienta. `src` es la versión recortada que ve el sitio; `thumb` es su miniatura,
// `full` la foto completa (sin recortar) y fx/fy el centro del encuadre en % de la foto original (sin valor: automático).
export type UploadedImage = SlotImage & {
  publicId: string;
  thumb: string;
  full: string;
  origWidth: number;
  origHeight: number;
  fx?: number;
  fy?: number;
};

export type SlotSection = {
  id: "productos" | "promocionales" | "servicios";
  title: string;
  // Proporción a la que Cloudinary recorta cualquier foto de la sección.
  width: number;
  height: number;
  ratioLabel: string;
};

export type ImageSlot = {
  id: string;
  section: SlotSection["id"];
  label: string;
  // Carpeta de la galería en Cloudinary: beckatex/<sección>/<card>/<foto>.
  folder: string;
  width: number;
  height: number;
  fallback?: SlotImage;
};

export const SLOT_ROOT = "beckatex";
export const MAX_PHOTOS = 10;

export const slotSections: SlotSection[] = [
  { id: "productos", title: "Productos", width: 928, height: 1152, ratioLabel: "vertical 4:5" },
  { id: "promocionales", title: "Artículos promocionales", width: 1000, height: 1000, ratioLabel: "cuadrado 1:1" },
  { id: "servicios", title: "Servicios de personalización", width: 1200, height: 900, ratioLabel: "horizontal 4:3" },
];

export function slotId(section: SlotSection["id"], cardId: string) {
  return `${section}-${cardId}`;
}

function build(section: SlotSection, cards: { id: string; name: string; image?: SlotImage }[]): ImageSlot[] {
  return cards.map((c) => ({
    id: slotId(section.id, c.id),
    section: section.id,
    label: c.name,
    folder: `${SLOT_ROOT}/${section.id}/${c.id}`,
    width: section.width,
    height: section.height,
    fallback: c.image,
  }));
}

const [productos, promocionales, servicios] = slotSections;

export const imageSlots: ImageSlot[] = [
  ...build(productos, products),
  ...build(promocionales, promoCategories),
  ...build(servicios, services),
];

export function findSlot(id: string): ImageSlot | undefined {
  return imageSlots.find((s) => s.id === id);
}

// Lo mínimo que necesita el carrusel del sitio (evita enviar al navegador datos de administración).
export function toCarousel(photos: UploadedImage[]): SlotImage[] {
  return photos.map(({ src, width, height, alt }) => ({ src, width, height, alt }));
}
