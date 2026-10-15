import { site } from "@/lib/site";

const NEW_TAB = <span className="sr-only"> (se abre en otra pestaña)</span>;

export function Contact() {
  const { whatsapp, instagram, tiktok } = site.social;
  return (
    <section id="contacto" className="section tint" aria-labelledby="contacto-titulo">
      <div className="wrap">
        <h2 id="contacto-titulo">Contacto</h2>
        <p className="lead">{site.contact.description}</p>
        <div className="actions">
          <a className="button" href={whatsapp.href} target="_blank" rel="noopener noreferrer">
            Pedidos y catálogo por {whatsapp.label}{NEW_TAB}
          </a>
          <a className="button outline" href={instagram.href} target="_blank" rel="noopener noreferrer">
            {instagram.label} {instagram.handle}{NEW_TAB}
          </a>
          <a className="button outline" href={tiktok.href} target="_blank" rel="noopener noreferrer">
            {tiktok.label} {tiktok.handle}{NEW_TAB}
          </a>
        </div>
      </div>
    </section>
  );
}
