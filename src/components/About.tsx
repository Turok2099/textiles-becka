import { site } from "@/lib/site";

export function About() {
  return (
    <section id="nosotros" className="section about-section" aria-labelledby="nosotros-titulo">
      <div className="wrap">
        <h2 id="nosotros-titulo">Nosotros</h2>
        <div className="about">
          <h3>{site.about.title}</h3>
          <div>{site.about.paragraphs.map((t) => <p key={t}>{t}</p>)}</div>
        </div>
      </div>
    </section>
  );
}
