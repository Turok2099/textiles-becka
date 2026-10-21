import Image from "next/image";
import { Suspense } from "react";
import { isAuthConfigured, requireAdmin } from "@/lib/auth";
import { getUploadedImages, isCloudinaryConfigured } from "@/lib/cloudinary";
import { imageSlots } from "@/lib/image-slots";
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
        <p className="lead">Sube una foto por categoría. Se recorta automáticamente a formato vertical (4:5), así que cualquier foto encaja. Formatos: JPG, PNG o WebP, hasta 10 MB.</p>
        <ul className="admin-grid">
          {imageSlots.map((slot) => {
            const current = uploaded[slot.id];
            const shown = current ?? slot.fallback;
            return (
              <li key={slot.id} className="card admin-card">
                <Image className="admin-thumb" src={shown.src} alt={shown.alt} width={shown.width} height={shown.height} sizes="20rem" />
                <h3>{slot.label}</h3>
                <p>{current ? "Imagen subida por ti" : "Imagen original del sitio"}</p>
                <UploadSlot slotId={slot.id} defaultAlt={shown.alt} hasUpload={Boolean(current)} />
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
