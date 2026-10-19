import Image from "next/image";
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
      <Image className="hero-media" src={hero.image.src} alt={hero.image.alt} width={hero.image.width} height={hero.image.height} sizes="(min-width: 48rem) 28rem, 90vw" priority />
    </section>
  );
}
