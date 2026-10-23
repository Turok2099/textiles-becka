import Image from "next/image";
import { cloudPublicId, cloudUrl } from "@/lib/cloud-site";

const WIDTHS = [320, 480, 640, 800, 1080, 1280, 1600];

type Props = {
  src: string; // ruta local en /public; si está migrada a Cloudinary se sirve desde allí
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  priority?: boolean;
  // Anchos de la lista srcset; por defecto una escala general, limitada al ancho del original.
  widths?: number[];
  quality?: "auto" | "auto:good" | "auto:best";
  // Calidad para next/image cuando se usa la imagen local de respaldo.
  fallbackQuality?: number;
};

// Imagen adaptable servida directamente por Cloudinary (f_auto elige AVIF/WebP, q_auto la calidad, c_limit nunca amplía).
// Usa <img> con srcset a propósito: así no se vuelve a procesar en /_next/image.
export function CloudImage({ src, alt, width, height, sizes, className, priority = false, widths = WIDTHS, quality = "auto", fallbackQuality }: Readonly<Props>) {
  const publicId = cloudPublicId(src);
  if (!publicId) {
    return <Image className={className} src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} quality={fallbackQuality} />;
  }
  const list = [...new Set(widths.map((w) => Math.min(w, width)))].sort((a, b) => a - b);
  const url = (w: number) => cloudUrl(publicId, `c_limit,w_${w},f_auto,q_${quality}`);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Cloudinary ya optimiza y redimensiona la imagen
    <img
      className={className}
      src={url(list[Math.min(2, list.length - 1)])}
      srcSet={list.map((w) => `${url(w)} ${w}w`).join(", ")}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
