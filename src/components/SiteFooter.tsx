import { site } from "@/lib/site";

export function SiteFooter() {
  const { whatsapp, instagram, tiktok } = site.social;
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <p className="brand">Textiles <strong>Becka</strong></p>
        <nav aria-label="Navegación del pie de página">
          <ul>{site.nav.map((i) => <li key={i.href}><a href={i.href}>{i.label}</a></li>)}</ul>
        </nav>
        <nav aria-label="Redes sociales">
          <ul>
            {[instagram, tiktok, whatsapp].map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}<span className="sr-only"> (se abre en otra pestaña)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="copy">© {site.name}</p>
      </div>
    </footer>
  );
}
