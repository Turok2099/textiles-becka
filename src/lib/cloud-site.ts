// Imágenes del sitio servidas por Cloudinary (optimizadas allí, sin pasar por /_next/image).
// Las originales siguen en /public y son el respaldo si Cloudinary no está configurado.
// Se suben con: node --env-file=.env.local scripts/upload-site-images.mjs (el public_id sale de la ruta local).

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();

const migrated = new Set([
  "/logo/bktx-logo.png",
  "/nosotros/01-quienes-somos.png",
  "/nosotros/02-idea-al-producto.png",
  "/nosotros/03-productos-promocionales.png",
  "/nosotros/04-resumen-portada.png",
]);

// "/nosotros/01-x.png" -> "bktx-sitio/nosotros/01-x"; undefined si la imagen no está migrada o falta Cloudinary.
export function cloudPublicId(src: string): string | undefined {
  return cloudName && migrated.has(src) ? `bktx-sitio${src.replace(/\.\w+$/, "")}` : undefined;
}

export function cloudUrl(publicId: string, transform: string) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicId}`;
}

// Miniatura al compartir (Facebook, WhatsApp, X): JPG de 1200 × 630, unos 100 KB.
export const socialImage = cloudName
  ? { url: cloudUrl("bktx-sitio/social/opengraph", "c_fill,g_center,w_1200,h_630,f_jpg,q_auto:good"), width: 1200, height: 630, alt: "BKTX soluciones textiles: uniformes que representan tu marca" }
  : undefined;
