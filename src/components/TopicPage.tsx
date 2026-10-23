import Image from "next/image";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { CardCarousel } from "@/components/CardCarousel";
import { Contact } from "@/components/Contact";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getUploadedImages } from "@/lib/cloudinary";
import { findSlot, toCarousel, type SlotImage } from "@/lib/image-slots";
import { products } from "@/lib/products";
import { promoCategories, promoCover } from "@/lib/promo";
import { site } from "@/lib/site";
import { getTopic } from "@/lib/topics";

// Artículos de la lista: los del tema (items) o, en líneas de producto, los de sus categorías en products.ts.
function itemsOf(slots: string[], items?: string[]) {
  if (items) return items;
  const ids = slots.filter((s) => s.startsWith("productos-")).map((s) => s.replace("productos-", ""));
  return [...new Set(products.filter((p) => ids.includes(p.id)).flatMap((p) => p.items))];
}

export async function TopicPage({ slug }: Readonly<{ slug: string }>) {
  const topic = getTopic(slug);
  const uploaded = await getUploadedImages();
  // Fotos subidas desde /admin; sin ninguna, la imagen local de la ranura (si existe).
  const photos: SlotImage[] = topic.slots.flatMap((id) => {
    const mine = uploaded[id];
    if (mine?.length) return toCarousel(mine);
    const fallback = findSlot(id)?.fallback;
    return fallback ? [fallback] : [];
  });
  const isPromo = topic.cover === "promo";
  const items = itemsOf(topic.slots, topic.items);
  const waHref = `https://wa.me/${site.social.whatsapp.number}?text=${encodeURIComponent(topic.whatsappText)}`;
  const related = topic.related.map(getTopic);

  return (
    <div>
      <a className="skip-link" href="#contenido">Ir al contenido</a>
      <SiteHeader />
      <main id="contenido">
        <section className={`topic-hero wrap${photos.length > 0 ? "" : " no-media"}`} aria-labelledby="tema-titulo">
          <div>
            <nav className="breadcrumb" aria-label="Ruta de navegación">
              <ol>
                <li><Link href="/">Inicio</Link></li>
                <li aria-current="page">{topic.name}</li>
              </ol>
            </nav>
            <p className="eyebrow">{topic.eyebrow}</p>
            <h1 id="tema-titulo">{topic.h1}</h1>
            <p className="lead">{topic.lead}</p>
            <div className="actions">
              <a className="button" href="#contacto">Cotizar</a>
              <a className="button outline" href={waHref} target="_blank" rel="noopener noreferrer">
                Escribir por WhatsApp<span className="sr-only"> (se abre en otra pestaña)</span>
              </a>
            </div>
          </div>
          {photos.length > 0 && (
            <div className="card product-card topic-media">
              <CardCarousel photos={photos} name={topic.name} sizes="(min-width: 48rem) 28rem, 90vw" />
            </div>
          )}
        </section>

        <section className="section tint" aria-labelledby="tema-items">
          <div className="wrap">
            <h2 id="tema-items">{topic.itemsTitle}</h2>
            <p className="lead">{topic.itemsIntro}</p>
            {isPromo && (
              <Image className="topic-cover" src={promoCover.src} alt={promoCover.alt} width={promoCover.width} height={promoCover.height} sizes="(min-width: 76rem) 70rem, 100vw" />
            )}
            {isPromo ? (
              <ul className="grid product-grid">
                {promoCategories.map((c) => (
                  <li key={c.id} className="card product-card">
                    <div className="product-head"><h3>{c.name}</h3></div>
                    <ul className="tags">{c.items.map((item) => <li key={item}>{item}</li>)}</ul>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="tags topic-tags">{items.map((item) => <li key={item}>{item}</li>)}</ul>
            )}
          </div>
        </section>

        <div className="wrap topic-sections">
          {topic.sections.map((s, i) => (
            <section key={s.title} className="topic-cols" aria-labelledby={`tema-sec-${i}`}>
              <h2 id={`tema-sec-${i}`}>{s.title}</h2>
              <div className="topic-copy">{s.paragraphs.map((p) => <p key={p}>{p}</p>)}</div>
            </section>
          ))}
        </div>

        <section className="section tint" aria-labelledby="tema-cotizar">
          <div className="wrap topic-cols">
            <h2 id="tema-cotizar">{topic.checklistTitle}</h2>
            <div>
              <ul className="topic-checklist">{topic.checklist.map((c) => <li key={c}>{c}</li>)}</ul>
              <p className="topic-note">Si algo de esto aún no lo tienes definido, escríbenos de todos modos y lo vemos juntos.</p>
              <a className="button" href="#contacto">Pedir cotización</a>
            </div>
          </div>
        </section>

        <section className="section wrap" aria-labelledby="tema-relacionados">
          <h2 id="tema-relacionados">También te puede interesar</h2>
          <ul className="grid topic-related">
            {related.map((r) => (
              <li key={r.slug} className="topic-related-card">
                <h3><Link href={`/${r.slug}`}>{r.name}</Link></h3>
                <p>{r.blurb}</p>
                <Link className="card-link" href={`/${r.slug}`}>
                  Ver más<span className="sr-only"> sobre {r.name}</span> <LuArrowRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Contact />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}
