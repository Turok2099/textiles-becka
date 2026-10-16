import { FaWhatsapp } from "react-icons/fa6";
import { FiChevronRight, FiPhone } from "react-icons/fi";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";

const NEW_TAB = <span className="sr-only"> (se abre en otra pestaña)</span>;

export function Contact() {
  const { whatsapp } = site.social;
  const { phone } = site.contact;
  const items = [
    { icon: <FiPhone />, text: phone.label, href: phone.href, external: false },
    { icon: <FaWhatsapp />, text: `Pedidos y catálogo por ${whatsapp.label}`, href: whatsapp.href, external: true },
  ];
  return (
    <section id="contacto" className="section tint" aria-labelledby="contacto-titulo">
      <div className="wrap contact">
        <div>
        <h2 id="contacto-titulo">Contacto</h2>
        <p className="lead">{site.contact.description}</p>
        <ul className="contact-list">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span className="contact-icon" aria-hidden="true">{item.icon}</span>
                <span className="contact-text">{item.text}{item.external && NEW_TAB}</span>
                <FiChevronRight className="contact-arrow" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
        </div>
        <ContactForm whatsappNumber={whatsapp.number} />
      </div>
    </section>
  );
}
