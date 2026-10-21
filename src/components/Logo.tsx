import Image from "next/image";

export function Logo({ height = 40, priority = false }: Readonly<{ height?: number; priority?: boolean }>) {
  return (
    <Image
      className="logo"
      src="/logo/bktx-logo.png"
      alt="BKTX soluciones textiles"
      width={Math.round(height * (1777 / 651))}
      height={height}
      priority={priority}
    />
  );
}
