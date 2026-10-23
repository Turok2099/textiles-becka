import Link from "next/link";
import { Logo } from "@/components/Logo";
import { NavDropdown } from "@/components/NavDropdown";
import { site } from "@/lib/site";
import { topics } from "@/lib/topics";

// Menús desplegables de la barra, por destino del enlace: Productos (líneas de producto y promocionales) y Servicios (técnicas).
const menus: Record<string, { allLabel: string; slugs: string[] }> = {
  "/#productos": {
    allLabel: "Ver todos los productos",
    slugs: topics.filter((t) => t.group !== "tecnica").map((t) => t.slug),
  },
  "/#servicios": {
    allLabel: "Ver todos los servicios",
    slugs: topics.filter((t) => t.group === "tecnica").map((t) => t.slug),
  },
};

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link className="brand" href="/" aria-label={`${site.name}, inicio`}>
          <Logo priority />
        </Link>
        <nav aria-label="Navegación principal">
          <ul>
            {site.nav.map((item) => {
              const menu = menus[item.href];
              if (!menu) return <li key={item.href}><Link href={item.href}>{item.label}</Link></li>;
              const items = menu.slugs.map((slug) => ({ href: `/${slug}`, label: topics.find((t) => t.slug === slug)!.name }));
              return <NavDropdown key={item.href} label={item.label} href={item.href} allLabel={menu.allLabel} items={items} />;
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
