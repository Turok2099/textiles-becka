import { LuArrowRight } from "react-icons/lu";
import { getSeasonItems } from "@/lib/cloudinary";

// Artículos de temporada que la administradora publica desde /admin. Sin artículos, la sección no se muestra.
export async function Season() {
  const items = await getSeasonItems();
  if (items.length === 0) return null;

  return (
    <section id="temporada" className="season" aria-labelledby="temporada-titulo">
      <div className="wrap">
        <header className="season-head">
          <div>
            <p className="season-tag">De temporada</p>
            <h2 id="temporada-titulo">Lo que está de temporada</h2>
            <p className="season-lead">Artículos para esta época del año. Cuéntanos qué necesitas y lo personalizamos con tu marca.</p>
          </div>
          <a className="season-cta" href="#contacto">
            Pregunta por la temporada <LuArrowRight aria-hidden="true" />
          </a>
        </header>
        <div className="season-rail" role="region" aria-label="Artículos de temporada, desliza para ver más" tabIndex={0}>
          <ol className="season-list">
            {items.map((item, i) => (
              <li key={item.publicId} className="season-card">
                <div className="season-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary ya optimiza y redimensiona la imagen */}
                  <img src={item.src} srcSet={item.srcSet} sizes="(min-width: 40rem) 18rem, 72vw" alt={`${item.title}${item.note ? `: ${item.note}` : ""}`} width={item.width} height={item.height} loading={i < 2 ? "eager" : "lazy"} decoding="async" />
                  <span className="season-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3>{item.title}</h3>
                {item.note && <p>{item.note}</p>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
