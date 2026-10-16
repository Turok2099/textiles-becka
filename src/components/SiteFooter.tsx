import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";

export function SiteFooter() {
  const { whatsapp, instagram, tiktok } = site.social;
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <p className="brand"><Logo height={36} /></p>
        <nav aria-label="Navegación del pie de página">
          <ul>{site.nav.map((i) => <li key={i.href}><a href={i.href}>{i.label}</a></li>)}</ul>
        </nav>
        <nav aria-label="Redes sociales">
          <ul>
            {[
              { ...instagram, icon: <FaInstagram /> },
              { ...tiktok, icon: <FaTiktok /> },
              { ...whatsapp, icon: <FaWhatsapp /> },
            ].map((s) => (
              <li key={s.label}>
                <a className="social-link" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <span aria-hidden="true">{s.icon}</span><span className="sr-only"> (se abre en otra pestaña)</span>
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
