import Link from "next/link";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { LuLock } from "react-icons/lu";
import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";
import { topics } from "@/lib/topics";

export function SiteFooter() {
  const { whatsapp, instagram, tiktok } = site.social;
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <p className="brand"><Logo /></p>
        <nav aria-label="Navegación del pie de página">
          <ul>{site.nav.map((i) => <li key={i.href}><Link href={i.href}>{i.label}</Link></li>)}</ul>
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
        <nav className="footer-topics" aria-label="Productos y servicios">
          <ul>{topics.map((t) => <li key={t.slug}><Link href={`/${t.slug}`}>{t.name}</Link></li>)}</ul>
        </nav>
        <p className="copy">
          © {site.name}
          <Link className="admin-link" href="/admin/login" prefetch={false} aria-label="Acceso administrador"><LuLock aria-hidden="true" /></Link>
        </p>
      </div>
    </footer>
  );
}
