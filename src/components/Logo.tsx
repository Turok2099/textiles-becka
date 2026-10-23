import { CloudImage } from "@/components/CloudImage";

// Se declara el tamaño real del archivo (1777 × 651) y el CSS (.logo) fija el tamaño visible (hasta ~153 px en celular).
// Cloudinary entrega variantes de 160, 320 y 480 px (pantallas de alta densidad) con calidad "good" para conservar los bordes.
export function Logo({ priority = false }: Readonly<{ priority?: boolean }>) {
  return (
    <CloudImage
      className="logo"
      src="/logo/bktx-logo.png"
      alt="BKTX soluciones textiles"
      width={1777}
      height={651}
      sizes="160px"
      widths={[160, 320, 480]}
      quality="auto:good"
      fallbackQuality={90}
      priority={priority}
    />
  );
}
