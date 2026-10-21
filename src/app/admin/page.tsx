import { Suspense } from "react";
import { ProductCarousel } from "@/components/ProductCarousel";
import { isAuthConfigured, requireAdmin } from "@/lib/auth";
import { getUploadedImages, isCloudinaryConfigured } from "@/lib/cloudinary";
import { imageSlots, MAX_PHOTOS } from "@/lib/image-slots";
import { logout } from "./actions";
import { UploadSlot } from "./UploadSlot";

export default function AdminPage() {
  return (
    <main className="admin-page">
      <Suspense fallback={<p>Cargando…</p>}>
        <Panel />
      </Suspense>
    </main>
  );
}

async function Panel() {
  await requireAdmin();
  const uploaded = await getUploadedImages();

  return (
    <>
      <header className="admin-head">
        <h1>Imágenes del sitio</h1>
        <form action={logout}><button className="button outline" type="submit">Cerrar sesión</button></form>
      </header>
      {!isCloudinaryConfigured && (
        <p role="alert" className="admin-error">Cloudinary no está configurado: faltan las variables CLOUDINARY_* en el servidor.</p>
      )}
      {!isAuthConfigured && <p role="alert" className="admin-error">Faltan variables de acceso.</p>}
      <section aria-labelledby="productos-admin">
        <h2 id="productos-admin">Productos</h2>
        <p className="lead">
          Cada categoría es un carrusel de hasta {MAX_PHOTOS} fotos. La primera que subas es la que se ve primero en el sitio.
          Las fotos se recortan solas a formato vertical (4:5), así que cualquiera encaja. Formatos: JPG, PNG o WebP, hasta 10 MB cada una.
        </p>
        <ul className="admin-grid">
          {imageSlots.map((slot) => {
            const photos = uploaded[slot.id] ?? [];
            return (
              <li key={slot.id} className="card admin-card">
                <ProductCarousel photos={photos.length ? photos : [slot.fallback]} name={slot.label} sizes="20rem" />
                <h3>{slot.label}</h3>
                <UploadSlot slotId={slot.id} photos={photos.map(({ publicId, src, alt }) => ({ publicId, src, alt }))} max={MAX_PHOTOS} />
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
