"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LuArrowLeft, LuArrowRight, LuCheck, LuImagePlus, LuLoader, LuPencil, LuTrash2, LuTriangleAlert } from "react-icons/lu";
import { SEASON_NOTE_MAX, SEASON_TITLE_MAX, type SeasonItem } from "@/lib/image-slots";
import { confirmSeasonUpload, editSeasonItem, getSeasonSignature, removeSeasonItem, reorderSeason, undoRemoveSeasonItem, type SeasonResult } from "./actions";
import { Modal } from "./Modal";
import { UploadError, uploadFile } from "./upload";

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];
const UNDO_MS = 10_000;

function isImageFile(f: File) {
  return TYPES.includes(f.type) || (f.type === "" && /\.(jpe?g|png|webp)$/i.test(f.name));
}

export function SeasonManager({ initialItems, max }: { initialItems: SeasonItem[]; max: number }) {
  const [items, setItems] = useState(initialItems);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null); // null: sin subida en curso
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [editing, setEditing] = useState<SeasonItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNote, setEditNote] = useState("");
  const [announce, setAnnounce] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const full = items.length >= max;

  // La vista previa es una URL local que hay que liberar al cambiar de foto o al salir.
  const previewRef = useRef<string | null>(null);
  function setPhoto(f: File | null) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = f ? URL.createObjectURL(f) : null;
    setPreview(previewRef.current);
    setFile(f);
  }
  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), UNDO_MS);
    return () => clearTimeout(t);
  }, [toast]);

  // Cambios de la lista: se muestra siempre lo que confirma el servidor; "guardado" solo tras su respuesta.
  async function run(call: () => Promise<SeasonResult>, optimistic?: SeasonItem[]): Promise<boolean> {
    const before = items;
    if (optimistic) setItems(optimistic);
    setBusy(true);
    setMessage(null);
    let r: SeasonResult;
    try {
      r = await call();
    } catch {
      r = { ok: false, error: "Sin conexión. Revisa tu internet e inténtalo de nuevo." };
    }
    setBusy(false);
    if (r.ok) {
      setItems(r.items);
      setMessage({ kind: "ok", text: "Todos los cambios están guardados" });
    } else {
      setItems(before);
      setMessage({ kind: "error", text: r.error });
    }
    return r.ok;
  }

  function pickFile(f: File | null) {
    setFormError(null);
    if (!f) return setPhoto(null);
    if (!isImageFile(f)) return setFormError("Formato no admitido. Usa JPG, PNG o WebP.");
    if (f.size > MAX_BYTES) return setFormError(`La foto pesa ${(f.size / 1024 / 1024).toFixed(1)} MB. El máximo es 10 MB.`);
    setPhoto(f);
  }

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!file) return setFormError("Elige la foto del artículo.");
    if (!title.trim()) return setFormError("Escribe un título para el artículo.");
    setFormError(null);
    setMessage(null);
    setBusy(true);
    setProgress(0);
    try {
      const sig = await getSeasonSignature(title, note);
      if (!sig.ok) throw new UploadError(sig.error);
      const { public_id } = await uploadFile(sig.upload.url, sig.upload.fields, file, setProgress);
      const r = await confirmSeasonUpload(public_id);
      if (!r.ok) throw new UploadError("La foto se subió, pero el servidor no pudo confirmarla. Vuelve a intentarlo.");
      setItems(r.items);
      setMessage({ kind: "ok", text: "Artículo publicado en la portada" });
      setPhoto(null);
      setTitle("");
      setNote("");
    } catch (error) {
      setFormError(error instanceof UploadError ? error.message : "Sin conexión. Revisa tu internet e inténtalo de nuevo.");
    }
    setBusy(false);
    setProgress(null);
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length || busy) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setAnnounce(`«${moved.title}» movido a la posición ${to + 1} de ${next.length}.`);
    void run(() => reorderSeason(next.map((i) => i.publicId)), next);
  }

  async function remove(item: SeasonItem) {
    if (busy) return;
    setToast(null);
    const ok = await run(() => removeSeasonItem(item.publicId), items.filter((i) => i.publicId !== item.publicId));
    if (ok) setToast(item.publicId);
  }

  async function undo() {
    if (!toast || busy) return;
    const id = toast;
    setToast(null);
    await run(() => undoRemoveSeasonItem(id));
  }

  function openEdit(item: SeasonItem) {
    setEditing(item);
    setEditTitle(item.title);
    setEditNote(item.note);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing || !editTitle.trim() || busy) return;
    const id = editing.publicId;
    setEditing(null);
    await run(() => editSeasonItem(id, editTitle, editNote));
  }

  const status = busy && progress === null ? (
    <p className="astatus" role="status"><LuLoader className="spin" aria-hidden="true" /> Guardando…</p>
  ) : message?.kind === "error" ? (
    <p className="astatus error" role="alert"><LuTriangleAlert aria-hidden="true" /> <span>{message.text}</span></p>
  ) : message ? (
    <p className="astatus ok" role="status"><LuCheck aria-hidden="true" /> {message.text}</p>
  ) : (
    <p className="astatus" role="status" />
  );

  return (
    <div className="aseason">
      <form className="acard aseason-form" onSubmit={publish} noValidate>
        <h3>Nuevo artículo</h3>
        {full ? (
          <p className="afull" role="status"><LuCheck aria-hidden="true" /> Ya tienes los {max} artículos disponibles. Quita uno para agregar otro.</p>
        ) : (
          <>
            <div className="aseason-drop">
              <label className={`aseason-pick${preview ? " has" : ""}`}>
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:), no admite next/image
                  <img src={preview} alt="Vista previa de la foto elegida" />
                ) : (
                  <span className="aseason-empty">
                    <LuImagePlus aria-hidden="true" />
                    <strong>Elegir foto</strong>
                    <small>JPG, PNG o WebP · máx. 10 MB<br />Se recorta sola en vertical 4:5</small>
                  </span>
                )}
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={busy}
                  aria-label="Foto del artículo"
                  onChange={(e) => {
                    pickFile(e.target.files?.[0] ?? null);
                    e.target.value = "";
                  }}
                />
              </label>
              {file && !busy && (
                <button type="button" className="abtn small" onClick={() => setPhoto(null)}>Cambiar foto</button>
              )}
            </div>
            <div className="aseason-fields">
              <label className="afield">
                <span>Título <small>(obligatorio)</small></span>
                <input type="text" value={title} maxLength={SEASON_TITLE_MAX} disabled={busy} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Suéter navideño" />
                <small className="acounter">{title.length}/{SEASON_TITLE_MAX}</small>
              </label>
              <label className="afield">
                <span>Descripción corta <small>(opcional)</small></span>
                <textarea rows={3} value={note} maxLength={SEASON_NOTE_MAX} disabled={busy} onChange={(e) => setNote(e.target.value)} placeholder="Ej. Disponible en tallas infantiles y adultos" />
                <small className="acounter">{note.length}/{SEASON_NOTE_MAX}</small>
              </label>
              {progress !== null && (
                <div className="aprogress" role="progressbar" aria-label="Subiendo la foto" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                  <span style={{ width: `${progress}%` }} />
                </div>
              )}
              {formError && <p className="aerr" role="alert">{formError}</p>}
              <button type="submit" className="abtn primary" disabled={busy}>
                {progress !== null ? <><LuLoader className="spin" aria-hidden="true" /> Publicando… {progress}%</> : "Publicar en la portada"}
              </button>
            </div>
          </>
        )}
      </form>

      <div className="aseason-list">
        <div className="acard-head">
          <h3>En la portada</h3>
          <p className="acount" aria-live="polite">{items.length} de {max} artículos</p>
        </div>
        {items.length === 0 ? (
          <p className="adefault">Todavía no hay artículos. La sección de temporada no aparece en el sitio hasta que publiques el primero.</p>
        ) : (
          <ol className="aseason-items">
            {items.map((item, i) => (
              <li key={item.publicId} className="aseason-item">
                <div className="aseason-thumb">
                  <Image src={item.thumb} alt="" fill sizes="6rem" unoptimized />
                  <span className="anum" aria-hidden="true">{i + 1}</span>
                </div>
                <div className="aseason-text">
                  <h4>{item.title}</h4>
                  {item.note && <p>{item.note}</p>}
                </div>
                <div className="aseason-btns">
                  <button type="button" className="abtn icon" onClick={() => move(i, i - 1)} disabled={i === 0 || busy} aria-label={`Mover «${item.title}» antes`}>
                    <LuArrowLeft aria-hidden="true" />
                  </button>
                  <button type="button" className="abtn icon" onClick={() => move(i, i + 1)} disabled={i === items.length - 1 || busy} aria-label={`Mover «${item.title}» después`}>
                    <LuArrowRight aria-hidden="true" />
                  </button>
                  <button type="button" className="abtn icon" onClick={() => openEdit(item)} disabled={busy} aria-label={`Editar «${item.title}»`}>
                    <LuPencil aria-hidden="true" />
                  </button>
                  <button type="button" className="abtn icon danger" onClick={() => void remove(item)} disabled={busy} aria-label={`Quitar «${item.title}»`}>
                    <LuTrash2 aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}
        {toast && (
          <p className="atoast" role="status">
            <span>Artículo quitado</span>
            <button type="button" className="abtn small" onClick={() => void undo()}>Deshacer</button>
          </p>
        )}
        {status}
        <p className="sr-only" role="status" aria-live="polite">{announce}</p>
      </div>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Editar artículo">
        <form className="aseason-fields" onSubmit={saveEdit} noValidate>
          <label className="afield">
            <span>Título</span>
            <input type="text" value={editTitle} maxLength={SEASON_TITLE_MAX} onChange={(e) => setEditTitle(e.target.value)} required />
          </label>
          <label className="afield">
            <span>Descripción corta <small>(opcional)</small></span>
            <textarea rows={3} value={editNote} maxLength={SEASON_NOTE_MAX} onChange={(e) => setEditNote(e.target.value)} />
          </label>
          <div className="amodal-actions">
            <button type="button" className="abtn" onClick={() => setEditing(null)}>Cancelar</button>
            <button type="submit" className="abtn primary" disabled={!editTitle.trim()}>Guardar cambios</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
