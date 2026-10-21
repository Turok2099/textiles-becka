import Image from "next/image";

// Se declara el tamaño real del archivo (1777 × 651) y el CSS (.logo) fija el tamaño visible. El atributo `sizes` le dice a
// Next el ancho máximo al que se muestra (hasta ~153 px en celular) para que genere variantes con resolución suficiente
// para pantallas de alta densidad; con quality 90 se conservan los bordes nítidos del logotipo.
export function Logo({ priority = false }: Readonly<{ priority?: boolean }>) {
  return (
    <Image
      className="logo"
      src="/logo/bktx-logo.png"
      alt="BKTX soluciones textiles"
      width={1777}
      height={651}
      sizes="160px"
      quality={90}
      priority={priority}
    />
  );
}
