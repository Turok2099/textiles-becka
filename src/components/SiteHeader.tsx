import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link className="brand" href="/" aria-label={`${site.name}, inicio`}>
          <Logo priority />
        </Link>
        <nav aria-label="Navegación principal">
          <ul>
            {site.nav.map((item) => (
              <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
