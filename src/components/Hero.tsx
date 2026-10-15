import { site } from "@/lib/site";

export function Hero() {
  const { hero } = site;
  return (
    <section id="inicio" className="hero wrap" aria-labelledby="titulo">
      <div>
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1 id="titulo">{hero.title}</h1>
        <p className="lead">{hero.description}</p>
        <a className="button" href={hero.cta.href}>{hero.cta.label}</a>
      </div>
      <div className="swatches" aria-hidden="true">
        <span className="swatch sand" /><span className="swatch clay" /><span className="swatch olive" />
      </div>
    </section>
  );
}
