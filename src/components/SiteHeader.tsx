import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";

type Theme = "violeta" | "azul";

const versions = [
  { key: undefined, label: "Original", href: "/", dot: "#9b543b" },
  { key: "violeta", label: "Violeta", href: "/opcion-violeta", dot: "#6a24d6" },
  { key: "azul", label: "Azul", href: "/opcion-azul", dot: "#14284f" },
] as const;

export function SiteHeader({ theme }: Readonly<{ theme?: Theme }>) {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a className="brand" href="#inicio" aria-label={`${site.name}, inicio`}>
          <Logo priority />
        </a>
        <nav aria-label="Navegación principal">
          <ul>
            {site.nav.map((item) => (
              <li key={item.href}><a href={item.href}>{item.label}</a></li>
            ))}
          </ul>
        </nav>
        <nav className="versions" aria-label="Versiones de color">
          <span className="versions-label">Versión:</span>
          <ul>
            {versions.map((v) => (
              <li key={v.label}>
                <a href={v.href} aria-current={v.key === theme ? "page" : undefined}>
                  <span className="dot" style={{ background: v.dot }} aria-hidden="true" />
                  {v.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
