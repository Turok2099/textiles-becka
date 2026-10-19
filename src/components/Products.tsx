import { LuChevronDown, LuGraduationCap, LuShirt, LuShoppingBag, LuStethoscope, LuTrophy, LuWind } from "react-icons/lu";
import Image from "next/image";
import { products, productsCover } from "@/lib/products";

const icons: Record<string, React.ReactNode> = {
  casual: <LuShirt />,
  chamarras: <LuWind />,
  "trabajo-salud": <LuStethoscope />,
  escolares: <LuGraduationCap />,
  deportivos: <LuTrophy />,
  accesorios: <LuShoppingBag />,
};

const VISIBLE = 6;

export function Products() {
  return (
    <section id="productos" className="section tint" aria-labelledby="productos-titulo">
      <div className="wrap">
        <h2 id="productos-titulo">Uniformes y ropa personalizada</h2>
        <p className="lead">Playeras personalizadas, sudaderas, chamarras y uniformes escolares, deportivos y empresariales.</p>
        {productsCover && (
          <Image className="products-cover" src={productsCover.src} alt={productsCover.alt} width={productsCover.width} height={productsCover.height} sizes="(min-width: 76rem) 72rem, 100vw" />
        )}
        <ul className="grid product-grid">
          {products.map((c) => (
            <li key={c.id} className="card product-card">
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
