import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";

export function SiteHeader() {
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
      </div>
    </header>
  );
}
