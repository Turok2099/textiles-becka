import Image from "next/image";
import { products, productsAreDemo } from "@/lib/products";

export function Products() {
  return (
    <section id="productos" className="section tint" aria-labelledby="productos-titulo">
      <div className="wrap">
        <h2 id="productos-titulo">Productos</h2>
        {productsAreDemo && (
          <p className="notice" role="note">
            Contenido de demostración: el catálogo y las fotografías reales de Becka están por confirmarse.
          </p>
        )}
        <ul className="grid">
          {products.map((p) => (
            <li key={p.id} className="card">
              {p.image ? (
                <Image className="card-media" src={p.image.src} alt={p.image.alt} width={p.image.width} height={p.image.height} />
              ) : (
                <div className="card-media placeholder"><span>Foto pendiente</span></div>
              )}
              <h3>{p.name}</h3>
              <p>{p.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
