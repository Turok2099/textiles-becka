import { CloudImage } from "@/components/CloudImage";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { site } from "@/lib/site";

export function About() {
  const { eyebrow, title, paragraphs, link, image } = site.about;
  return (
    <section id="nosotros" className="section about-section" aria-labelledby="nosotros-titulo">
      <div className="wrap about">
        <CloudImage className="about-photo" src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 48rem) 26rem, 90vw" />
        <div className="about-body">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="nosotros-titulo">{title}</h2>
          {paragraphs.map((t) => <p key={t}>{t}</p>)}
          <Link className="about-link" href={link.href}>
            {link.label} <LuArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
