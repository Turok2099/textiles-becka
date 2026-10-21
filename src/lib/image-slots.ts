// Ranuras de imagen editables desde /admin. Cada ranura es una galería de hasta MAX_PHOTOS fotos;
// mientras no tenga ninguna subida a Cloudinary se muestra la imagen local de respaldo (la que ya está en public/).
// Por ahora solo las 6 categorías de productos; añadir más ranuras aquí cuando se necesiten.

import { products } from "@/lib/products";

export type SlotImage = { src: string; width: number; height: number; alt: string };
export type UploadedImage = SlotImage & { publicId: string };

export type ImageSlot = {
  id: string;
  label: string;
  // Carpeta de la galería en Cloudinary: <SLOT_FOLDER>/<id>/<foto>.
  folder: string;
  // Proporción a la que Cloudinary recorta cualquier foto subida.
  width: number;
  height: number;
  fallback: SlotImage;
};

export const SLOT_FOLDER = "beckatex/productos";
export const MAX_PHOTOS = 8;

export const imageSlots: ImageSlot[] = products.flatMap((c) =>
  c.image
    ? [{ id: c.id, label: c.name, folder: `${SLOT_FOLDER}/${c.id}`, width: c.image.width, height: c.image.height, fallback: c.image }]
    : [],
);

export function findSlot(id: string): ImageSlot | undefined {
  return imageSlots.find((s) => s.id === id);
}
