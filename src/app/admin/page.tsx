import { Suspense } from "react";
import { isAuthConfigured, requireAdmin } from "@/lib/auth";
import { getUploadedImages, isCloudinaryConfigured } from "@/lib/cloudinary";
import { imageSlots, MAX_PHOTOS, slotSections } from "@/lib/image-slots";
import { logout } from "./actions";
import { CategoryCard } from "./CategoryCard";

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
        <div>
          <h1>Fotos de tu sitio</h1>
          <p className="admin-lead">Agrega fotos a cada categoría y elige cómo se mostrarán</p>
        </div>
        <form action={logout}>
          <button className="abtn" type="submit">Cerrar sesión</button>
        </form>
      </header>
      {!isCloudinaryConfigured && (
        <p role="alert" className="admin-alert">Cloudinary no está configurado: faltan las variables CLOUDINARY_* en el servidor.</p>
      )}
      {!isAuthConfigured && <p role="alert" className="admin-alert">Faltan variables de acceso.</p>}
      {slotSections.map((section) => (
        <section key={section.id} className="admin-section" aria-labelledby={`admin-${section.id}`}>
          <h2 id={`admin-${section.id}`}>{section.title}</h2>
          <p className="admin-ratio">Las fotos se recortan solas al formato {section.ratioLabel}</p>
          <div className="admin-grid">
            {imageSlots.filter((s) => s.section === section.id).map((slot) => (
              <CategoryCard
                key={slot.id}
                slot={{ id: slot.id, label: slot.label, width: slot.width, height: slot.height }}
                ratioLabel={section.ratioLabel}
                max={MAX_PHOTOS}
                initialPhotos={uploaded[slot.id] ?? []}
                fallback={slot.fallback}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
