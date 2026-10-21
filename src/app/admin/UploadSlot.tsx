"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LuImagePlus, LuTrash2 } from "react-icons/lu";
import { confirmUpload, deletePhoto, getUploadSignatures } from "./actions";

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

type Photo = { publicId: string; src: string; alt: string };

export function UploadSlot({ slotId, photos, max }: { slotId: string; photos: Photo[]; max: number }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [alt, setAlt] = useState("");
  const [message, setMessage] = useState<{ text: string; error?: boolean }>();
  const [busy, startTransition] = useTransition();
  const room = max - photos.length;

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    setMessage(undefined);
    const bad = picked.find((f) => !TYPES.includes(f.type) || f.size > MAX_BYTES);
    if (bad) {
      e.target.value = "";
      setFiles([]);
      return setMessage({ text: `"${bad.name}" no sirve: usa JPG, PNG o WebP de hasta 10 MB.`, error: true });
    }
    if (picked.length > room) {
      e.target.value = "";
      setFiles([]);
      return setMessage({ text: room > 0 ? `Solo caben ${room} foto(s) más en esta sección.` : `Esta sección ya tiene el máximo de ${max} fotos. Borra alguna para subir otra.`, error: true });
    }
    setFiles(picked);
  }

  function upload() {
    if (files.length === 0) return setMessage({ text: "Elige al menos una foto.", error: true });
    startTransition(async () => {
      setMessage({ text: "Preparando…" });
      const sig = await getUploadSignatures(slotId, files.length, alt);
      if (!sig.ok) return setMessage({ text: sig.error, error: true });

      let done = 0;
      for (const [i, file] of files.entries()) {
        setMessage({ text: `Subiendo foto ${i + 1} de ${files.length}…` });
        const { url, fields } = sig.uploads[i];
        const body = new FormData();
        for (const [k, v] of Object.entries(fields)) body.append(k, String(v));
        body.append("file", file);
        try {
          const res = await fetch(url, { method: "POST", body });
          if (!res.ok) throw new Error();
          done++;
        } catch {
          break;
        }
      }
      if (done > 0) await confirmUpload();
      if (fileRef.current) fileRef.current.value = "";
      setFiles([]);
      if (done === files.length) {
        setAlt("");
        setMessage({ text: done === 1 ? "Foto subida." : `${done} fotos subidas.` });
      } else {
        setMessage({ text: `Se subieron ${done} de ${files.length} fotos. Vuelve a intentar con las que faltan.`, error: true });
      }
      router.refresh();
    });
  }

  function remove(publicId: string) {
    if (!window.confirm("¿Borrar esta foto? Se quitará también del sitio.")) return;
    startTransition(async () => {
      const r = await deletePhoto(slotId, publicId);
      setMessage(r.ok ? { text: "Foto borrada." } : { text: r.error ?? "Error.", error: true });
      router.refresh();
    });
  }

  return (
    <div className="admin-upload">
      <p className="admin-count" aria-live="polite">
        <strong>{photos.length} de {max}</strong> fotos subidas
        {photos.length === 0 && " · se muestra la imagen original del sitio"}
      </p>

      {photos.length > 0 && (
        <ul className="admin-thumbs">
          {photos.map((p, i) => (
            <li key={p.publicId}>
              <Image src={p.src} alt={p.alt} width={90} height={112} sizes="6rem" />
              <span className="admin-thumb-n" aria-hidden="true">{i + 1}</span>
              <button type="button" onClick={() => remove(p.publicId)} disabled={busy} aria-label={`Borrar foto ${i + 1}`} title="Borrar foto">
                <LuTrash2 aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <label className={`button outline file-pick${room <= 0 || busy ? " disabled" : ""}`}>
        <LuImagePlus aria-hidden="true" />
        <span>{files.length > 0 ? "Cambiar selección" : "Elegir fotos"}</span>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onPick} disabled={busy || room <= 0} />
      </label>
      <p className="admin-hint">
        {files.length > 0 ? `${files.length} foto(s) elegida(s): ${files.map((f) => f.name).join(", ")}` : `Puedes elegir varias a la vez. Caben ${Math.max(room, 0)} más.`}
      </p>

      {files.length > 0 && (
        <>
          <label>
            Descripción de las fotos (opcional)
            <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} maxLength={200} placeholder="Ej.: Polo negro con logotipo bordado" disabled={busy} />
          </label>
          <button className="button" type="button" onClick={upload} disabled={busy}>
            {busy ? "Subiendo…" : files.length === 1 ? "Subir foto" : `Subir ${files.length} fotos`}
          </button>
        </>
      )}

      {message && <p role="status" className={message.error ? "admin-error" : "admin-ok"}>{message.text}</p>}
    </div>
  );
}
