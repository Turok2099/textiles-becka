import { LuLayers, LuPalette, LuPenTool, LuShirt, LuSpline } from "react-icons/lu";
import { CardCarousel } from "@/components/CardCarousel";
import { getUploadedImages } from "@/lib/cloudinary";
import { slotId, toCarousel } from "@/lib/image-slots";
import { services } from "@/lib/services";

const icons: Record<string, React.ReactNode> = {
  sublimacion: <LuPalette />,
  bordado: <LuSpline />,
  grabado: <LuPenTool />,
  "dtf-uv": <LuLayers />,
  "dtf-textil": <LuShirt />,
};

export async function Services() {
  // Fotos subidas desde /admin; las cards sin fotos se ven solo con texto.
  const uploaded = await getUploadedImages();
  return (
    <section id="servicios" className="section wrap" aria-labelledby="servicios-titulo">
      <h2 id="servicios-titulo">Servicios de personalización</h2>
      <ul className="grid product-grid">
        {services.map((s) => {
          const photos = toCarousel(uploaded[slotId("servicios", s.id)] ?? []);
          return (
            <li key={s.id} className="card product-card">
              {photos.length > 0 && <CardCarousel photos={photos} name={s.name} sizes="(min-width: 40rem) 22rem, 100vw" />}
              <div className="product-head">
                <span className="product-icon" aria-hidden="true">{icons[s.id]}</span>
                <h3>{s.name}</h3>
              </div>
              <p>{s.description}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
