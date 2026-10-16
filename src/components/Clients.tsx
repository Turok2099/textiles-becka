import Image from "next/image";
import { clients } from "@/lib/clients";

function GenericLogo() {
  return (
    <svg className="client-mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="40" height="40" rx="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M14 30l7-9 5 6 4-5 6 8z" fill="currentColor" />
      <circle cx="31" cy="17" r="3" fill="currentColor" />
    </svg>
  );
}

// El carrusel repite la lista para que el bucle sea continuo; solo la primera copia es visible para lectores de pantalla.
const COPIES = 4;

export function Clients() {
  return (
    <section id="clientes" className="section" aria-labelledby="clientes-titulo">
      <div className="wrap">
        <h2 id="clientes-titulo">Clientes</h2>
        <p className="lead">Empresas que han confiado en Beckatex.</p>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {Array.from({ length: COPIES }, (_, copy) => (
            <ul key={copy} className="marquee-group" aria-hidden={copy > 0 ? true : undefined}>
              {clients.map((c) => (
                <li key={c.id} className="client">
                  {c.logo ? (
                    <Image className="client-logo" src={c.logo.src} alt="" width={c.logo.width} height={c.logo.height} />
                  ) : (
                    <GenericLogo />
                  )}
                  <span>{c.name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
