import Link from "next/link";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { LuLock } from "react-icons/lu";
import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";
import { topics } from "@/lib/topics";

// Productos y Servicios ya tienen su columna; el resto del menú va en "BKTX".
const columnLinks = ["/#productos", "/#servicios"];

export function SiteFooter() {
  const { whatsapp, instagram, tiktok } = site.social;
  const products = topics.filter((t) => t.group !== "tecnica");
  const services = topics.filter((t) => t.group === "tecnica");
  const company = site.nav.filter((i) => !columnLinks.includes(i.href));
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-main">
          <div className="footer-brand">
            <p className="brand"><Logo /></p>
            <p className="footer-area">Uniformes y productos textiles personalizados. Atención en {site.serviceArea}.</p>
            <nav aria-label="Redes sociales">
              <ul className="footer-social">
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
          </div>
          <nav className="footer-col" aria-labelledby="footer-productos">
            <h2 id="footer-productos" className="footer-title">Productos</h2>
            <ul>{products.map((t) => <li key={t.slug}><Link href={`/${t.slug}`}>{t.name}</Link></li>)}</ul>
          </nav>
          <nav className="footer-col" aria-labelledby="footer-servicios">
            <h2 id="footer-servicios" className="footer-title">Servicios</h2>
            <ul>{services.map((t) => <li key={t.slug}><Link href={`/${t.slug}`}>{t.name}</Link></li>)}</ul>
          </nav>
          <nav className="footer-col" aria-labelledby="footer-bktx">
            <h2 id="footer-bktx" className="footer-title">BKTX</h2>
            <ul>
              {company.map((i) => <li key={i.href}><Link href={i.href}>{i.label}</Link></li>)}
              <li><Link href="/aviso-de-privacidad">Aviso de privacidad</Link></li>
            </ul>
          </nav>
        </div>
        <p className="copy">
          © {site.name}
          <Link className="admin-link" href="/admin/login" prefetch={false} aria-label="Acceso administrador"><LuLock aria-hidden="true" /></Link>
        </p>
      </div>
    </footer>
  );
}
