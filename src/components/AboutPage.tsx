import { CloudImage } from "@/components/CloudImage";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { nosotros } from "@/lib/nosotros";
import { site } from "@/lib/site";


export function AboutPage() {
  const { hero, what, idea, beyond, project, close } = nosotros;
  const { whatsapp } = site.social;
  return (
    <div>
      <a className="skip-link" href="#contenido">Ir al contenido</a>
      <SiteHeader />
      <main id="contenido" className="nos">
        {/* 1. Presentación */}
        <section className="nos-hero" aria-labelledby="nos-titulo">
          <div className="wrap nos-split">
            <div>
              <p className="eyebrow">{hero.eyebrow}</p>
              <h1 id="nos-titulo">{hero.title}</h1>
              <p className="nos-intro">{hero.intro}</p>
              <p className="nos-extra">{hero.extra}</p>
            </div>
            <CloudImage className="nos-photo" src={hero.image.src} alt={hero.image.alt} width={hero.image.width} height={hero.image.height} sizes="(min-width: 47.5rem) 36rem, 92vw" priority />
          </div>
        </section>

        {/* 2. Lo que hacemos */}
        <section className="nos-what" aria-labelledby="nos-hacemos">
          <div className="wrap nos-two">
            <h2 id="nos-hacemos">{what.title}</h2>
            <div>
              <p className="nos-text">{what.text}</p>
            </div>
            <p className="nos-side">{what.extra}</p>
          </div>
        </section>

        {/* 3. De la idea al producto: en móvil el texto va antes que la foto */}
        <section className="nos-idea" aria-labelledby="nos-idea">
          <div className="wrap nos-split nos-reverse">
            <div>
              <h2 id="nos-idea">{idea.title}</h2>
              <p className="nos-text">{idea.text}</p>
              <p className="nos-text nos-text-2">{idea.extra}</p>
            </div>
            <CloudImage className="nos-photo" src={idea.image.src} alt={idea.image.alt} width={idea.image.width} height={idea.image.height} sizes="(min-width: 47.5rem) 36rem, 92vw" />
          </div>
        </section>

        {/* 4. Más allá de la ropa */}
        <section className="nos-beyond" aria-labelledby="nos-mas-alla">
          <div className="wrap nos-split nos-wide">
            <div>
              <h2 id="nos-mas-alla">{beyond.title}</h2>
              <p className="nos-text">{beyond.text}</p>
            </div>
            <CloudImage className="nos-photo" src={beyond.image.src} alt={beyond.image.alt} width={beyond.image.width} height={beyond.image.height} sizes="(min-width: 47.5rem) 42rem, 92vw" />
          </div>
        </section>

        {/* 5. Cada proyecto es diferente */}
        <section className="nos-project" aria-labelledby="nos-proyecto">
          <div className="wrap nos-two">
            <div>
              <h2 id="nos-proyecto">{project.title}</h2>
              <p className="nos-text">{project.text}</p>
            </div>
            <p className="nos-statement">{project.statement}</p>
          </div>
        </section>

        {/* 6. Cierre y contacto: reutiliza el WhatsApp ya configurado en el sitio */}
        <section className="nos-close" aria-label="Contacto">
          <div className="wrap nos-close-inner">
            <p className="nos-close-text">{close.text}</p>
            <div className="nos-close-actions">
              <a className="nos-cta" href={whatsapp.href} target="_blank" rel="noopener noreferrer">
                {close.cta} <LuArrowRight aria-hidden="true" />
                <span className="sr-only"> (se abre en otra pestaña)</span>
              </a>
              <Link className="nos-back" href="/#productos">Ver productos</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}
