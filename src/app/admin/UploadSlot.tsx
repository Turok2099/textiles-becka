"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { confirmUpload, getUploadSignature, restoreOriginal } from "./actions";

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

export function UploadSlot({ slotId, defaultAlt, hasUpload }: { slotId: string; defaultAlt: string; hasUpload: boolean }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState(defaultAlt);
  const [message, setMessage] = useState<{ text: string; error?: boolean }>();
  const [busy, startTransition] = useTransition();

  function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return setMessage({ text: "Elige una imagen primero.", error: true });
    if (!TYPES.includes(file.type)) return setMessage({ text: "Usa una imagen JPG, PNG o WebP.", error: true });
    if (file.size > MAX_BYTES) return setMessage({ text: "La imagen pesa más de 10 MB.", error: true });

    setMessage({ text: "Subiendo…" });
    startTransition(async () => {
      const sig = await getUploadSignature(slotId, alt);
      if (!sig.ok) return setMessage({ text: sig.error, error: true });

      const body = new FormData();
      for (const [k, v] of Object.entries(sig.fields)) body.append(k, String(v));
      body.append("file", file);
      try {
        const res = await fetch(sig.url, { method: "POST", body });
        if (!res.ok) throw new Error();
      } catch {
        return setMessage({ text: "No se pudo subir la imagen. Inténtalo de nuevo.", error: true });
      }
      await confirmUpload();
      if (fileRef.current) fileRef.current.value = "";
      setMessage({ text: "Imagen actualizada." });
      router.refresh();
    });
  }

  function restore() {
    if (!window.confirm("¿Volver a la imagen original de esta categoría?")) return;
    startTransition(async () => {
      const r = await restoreOriginal(slotId);
      if (!r.ok) return setMessage({ text: r.error ?? "Error.", error: true });
      setMessage({ text: "Se restauró la imagen original." });
      router.refresh();
    });
  }

  return (
    <div className="admin-upload">
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Elegir imagen" disabled={busy} />
      <label>
        Texto alternativo (describe la foto)
        <textarea value={alt} onChange={(e) => setAlt(e.target.value)} maxLength={200} rows={3} disabled={busy} />
      </label>
      <div className="admin-actions">
        <button className="button" type="button" onClick={upload} disabled={busy}>Subir imagen</button>
        {hasUpload && <button className="button outline" type="button" onClick={restore} disabled={busy}>Restaurar original</button>}
      </div>
      {message && <p role="status" className={message.error ? "admin-error" : "admin-ok"}>{message.text}</p>}
    </div>
  );
}
