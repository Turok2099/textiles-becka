import { LuStar } from "react-icons/lu";
import { reviews } from "@/lib/reviews";

// El carrusel repite la lista para que el bucle sea continuo; solo la primera copia es visible para lectores de pantalla.
const COPIES = 4;

export function Reviews() {
  if (reviews.length === 0) return null;
  return (
    <section
      id="opiniones"
      className="section tint"
      aria-labelledby="opiniones-titulo"
    >
      <div className="wrap">
        <h2 id="opiniones-titulo">Opiniones</h2>
        <p className="lead">Lo que dicen quienes ya trabajaron con Beckatex.</p>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {Array.from({ length: COPIES }, (_, copy) => (
            <ul
              key={copy}
              className="marquee-group"
              aria-hidden={copy > 0 ? true : undefined}
            >
              {reviews.map((r) => (
                <li key={r.id} className="review">
                  <p
                    className="review-stars"
                    role="img"
                    aria-label={`${r.rating} de 5 estrellas`}
                  >
                    {Array.from({ length: r.rating }, (_, i) => (
                      <LuStar key={i} aria-hidden="true" />
                    ))}
                  </p>
                  <blockquote>{r.text}</blockquote>
                  <p className="review-author">
                    <strong>{r.name}</strong>
                    {r.detail && <span>{r.detail}</span>}
                  </p>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
