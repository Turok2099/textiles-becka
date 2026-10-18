import Image from "next/image";
import { site } from "@/lib/site";

export function Logo({ height = 40, priority = false }: Readonly<{ height?: number; priority?: boolean }>) {
  return (
    <Image
      className="logo"
      src="/logo/beckatex-logo.png"
      alt={site.name}
      width={Math.round(height * (1328 / 511))}
      height={height}
      priority={priority}
    />
  );
}
