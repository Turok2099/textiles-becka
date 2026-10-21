// Ranuras de imagen editables desde /admin. Cada ranura tiene una imagen de respaldo local
// (la que ya está en public/) que se usa mientras no se suba una a Cloudinary.
// Por ahora solo las 6 categorías de productos; añadir más ranuras aquí cuando se necesiten.

import { products } from "@/lib/products";

export type SlotImage = { src: string; width: number; height: number; alt: string };

export type ImageSlot = {
  id: string;
  label: string;
  // Identificador del recurso en Cloudinary (una imagen por ranura, se sobrescribe al subir).
  publicId: string;
  // Proporción a la que Cloudinary recorta cualquier foto subida.
  width: number;
  height: number;
  fallback: SlotImage;
};

export const SLOT_FOLDER = "beckatex/productos";

export const imageSlots: ImageSlot[] = products.flatMap((c) =>
  c.image
    ? [{ id: c.id, label: c.name, publicId: `${SLOT_FOLDER}/${c.id}`, width: c.image.width, height: c.image.height, fallback: c.image }]
    : [],
);

export function findSlot(id: string): ImageSlot | undefined {
  return imageSlots.find((s) => s.id === id);
}
