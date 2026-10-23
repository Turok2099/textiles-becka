import Link from "next/link";
import { LuArrowRight, LuChevronDown, LuGraduationCap, LuShirt, LuShoppingBag, LuStethoscope, LuTrophy, LuWind } from "react-icons/lu";
import { CloudImage } from "@/components/CloudImage";
import { CardCarousel } from "@/components/CardCarousel";
import { getUploadedImages } from "@/lib/cloudinary";
import { slotId, toCarousel } from "@/lib/image-slots";
import { products, productsCover } from "@/lib/products";
import { topicForSlot } from "@/lib/topics";

const icons: Record<string, React.ReactNode> = {
  casual: <LuShirt />,
  chamarras: <LuWind />,
  "trabajo-salud": <LuStethoscope />,
  escolares: <LuGraduationCap />,
  deportivos: <LuTrophy />,
  accesorios: <LuShoppingBag />,
};

const VISIBLE = 6;

export async function Products() {
  // Imágenes subidas desde /admin; si una categoría no tiene, se usa la local de products.ts.
  const uploaded = await getUploadedImages();
  return (
    <section id="productos" className="section tint" aria-labelledby="productos-titulo">
      <div className="wrap">
        <div className="products-banner">
          {productsCover && (
            <CloudImage className="products-cover" src={productsCover.src} alt={productsCover.alt} width={productsCover.width} height={productsCover.height} sizes="(min-width: 76rem) 70rem, 100vw" />
          )}
          <div className="products-intro">
            <p className="eyebrow">Hecho a tu medida</p>
            <h2 id="productos-titulo">Uniformes y ropa personalizada</h2>
            <p className="lead">Playeras personalizadas, sudaderas, chamarras y uniformes escolares, deportivos y empresariales.</p>
            <a className="button" href="#contacto">Cotiza tu uniforme</a>
          </div>
        </div>
        <ul className="grid product-grid">
          {products.map((c) => {
            // Fotos subidas desde /admin; sin ninguna, la imagen local de products.ts.
            const mine = uploaded[slotId("productos", c.id)];
            const topic = topicForSlot(slotId("productos", c.id));
            const photos = mine?.length ? toCarousel(mine) : c.image ? [c.image] : [];
            return (
            <li key={c.id} className="card product-card">
              {photos.length > 0 && <CardCarousel photos={photos} name={c.name} sizes="(min-width: 40rem) 22rem, 100vw" />}
              <div className="product-head">
                <span className="product-icon" aria-hidden="true">{icons[c.id]}</span>
                <h3>{c.name}</h3>
              </div>
              <ul className="tags">
                {c.items.slice(0, VISIBLE).map((item) => <li key={item}>{item}</li>)}
              </ul>
              {c.items.length > VISIBLE && (
                <details className="more">
                  <summary>
                    <span>Ver {c.items.length - VISIBLE} más</span>
                    <LuChevronDown aria-hidden="true" />
                  </summary>
                  <ul className="tags">
                    {c.items.slice(VISIBLE).map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </details>
              )}
              {topic && (
                <Link className="card-link" href={`/${topic.slug}`}>
                  Más sobre {topic.name.toLowerCase()} <LuArrowRight aria-hidden="true" />
                </Link>
              )}
            </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
