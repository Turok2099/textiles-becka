"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LuArrowLeft, LuArrowRight, LuArrowUpDown, LuCheck, LuEye, LuImagePlus, LuLoader, LuRefreshCw, LuTriangleAlert, LuX } from "react-icons/lu";
import { CardCarousel } from "@/components/CardCarousel";
import { toCarousel, type SlotImage, type UploadedImage } from "@/lib/image-slots";
import { confirmUpload, getUploadSignatures, removePhoto, reorderPhotos, setFraming, undoRemovePhoto, type PhotosResult } from "./actions";
import { FramingEditor } from "./FramingEditor";
import { Modal } from "./Modal";
import { UploadError, uploadFile } from "./upload";

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];
const UNDO_MS = 10_000;

type Item = {
  key: number;
  name: string;
  file: File;
  status: "uploading" | "confirming" | "error";
  progress: number;
  error?: string;
  // Error de validación: no se puede reintentar, solo quitar.
  retryable: boolean;
  // Si la foto ya llegó a Cloudinary pero falló la confirmación, se reintenta solo la confirmación.
  publicId?: string;
};

type Props = {
  slot: { id: string; label: string; width: number; height: number };
  ratioLabel: string;
  max: number;
  initialPhotos: UploadedImage[];
  fallback?: SlotImage;
};

function isImageFile(f: File) {
  return TYPES.includes(f.type) || (f.type === "" && /\.(jpe?g|png|webp)$/i.test(f.name));
}

export function CategoryCard({ slot, ratioLabel, max, initialPhotos, fallback }: Props) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [queue, setQueue] = useState<Item[]>([]);
  const [ordering, setOrdering] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [framingId, setFramingId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [pending, setPending] = useState(0);
  const [hasSaved, setHasSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ publicId: string } | null>(null);
  const [announce, setAnnounce] = useState("");

  const keyRef = useRef(0);
  const serverPhotos = useRef(initialPhotos); // última lista confirmada por el servidor
  const seq = useRef(0);
  const chain = useRef<Promise<unknown>>(Promise.resolve());
  const [retry, setRetry] = useState<(() => void) | null>(null);
  const dragFrom = useRef<number | null>(null);

  const used = photos.length + queue.filter((q) => q.status !== "error").length;
  const room = max - used;
  const full = photos.length >= max;
  const selectedIndex = photos.findIndex((p) => p.publicId === selectedId);
  const selected = selectedIndex >= 0 ? photos[selectedIndex] : null;
  const framing = photos.find((p) => p.publicId === framingId) ?? null;

  // El aviso "Deshacer" dura 10 segundos.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), UNDO_MS);
    return () => clearTimeout(t);
  }, [toast]);

  // Todo cambio pasa por aquí: se ejecutan de uno en uno, se muestra el resultado del servidor y, si falla,
  // se vuelve a la última lista confirmada. Nunca se anuncia "guardado" antes de la respuesta del servidor.
  function mutate(call: () => Promise<PhotosResult>, optimistic?: UploadedImage[]): Promise<PhotosResult> {
    const mine = ++seq.current;
    if (optimistic) setPhotos(optimistic);
    setPending((n) => n + 1);
    setSaveError(null);
    const run = async (): Promise<PhotosResult> => {
      let r: PhotosResult;
      try {
        r = await call();
      } catch {
        r = { ok: false, error: "Sin conexión. Revisa tu internet e inténtalo de nuevo." };
      }
      setPending((n) => n - 1);
      if (r.ok) {
        serverPhotos.current = r.photos;
        if (mine === seq.current) setPhotos(r.photos);
        setHasSaved(true);
        setRetry(null);
      } else {
        setSaveError(r.error);
        if (mine === seq.current) setPhotos(serverPhotos.current);
        setRetry(() => () => void mutate(call, optimistic));
      }
      return r;
    };
    const p = chain.current.then(run, run);
    chain.current = p;
    return p;
  }

  function patchItem(key: number, patch: Partial<Item>) {
    setQueue((q) => q.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  }
  function dropItem(key: number) {
    setQueue((q) => q.filter((i) => i.key !== key));
  }

  async function confirmItem(item: Item, publicId: string) {
    patchItem(item.key, { status: "confirming", progress: 100, publicId, error: undefined });
    const r = await mutate(() => confirmUpload(slot.id, [publicId]));
    if (r.ok) dropItem(item.key);
    else patchItem(item.key, { status: "error", error: "La foto se subió, pero el servidor no pudo confirmarla. Toca Reintentar.", retryable: true });
  }

  async function sendItem(item: Item, sig: { url: string; fields: Record<string, string | number> }) {
    patchItem(item.key, { status: "uploading", progress: 0, error: undefined });
    try {
      const { public_id } = await uploadFile(sig.url, sig.fields, item.file, (progress) => patchItem(item.key, { progress }));
      await confirmItem(item, public_id);
    } catch (e) {
      patchItem(item.key, { status: "error", error: e instanceof UploadError ? e.message : "No se pudo subir esta foto. Inténtalo de nuevo.", retryable: true });
    }
  }

  async function addFiles(list: File[]) {
    if (list.length === 0 || ordering) return;
    let free = room;
    const accepted: Item[] = [];
    const rejected: Item[] = [];
    for (const file of list) {
      const base = { key: ++keyRef.current, name: file.name, file, progress: 0 };
      if (!isImageFile(file)) rejected.push({ ...base, status: "error", retryable: false, error: "Formato no admitido. Usa JPG, PNG o WebP." });
      else if (file.size > MAX_BYTES) rejected.push({ ...base, status: "error", retryable: false, error: `Pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo es 10 MB.` });
      else if (free <= 0) rejected.push({ ...base, status: "error", retryable: false, error: `No cabe: solo se permiten ${max} fotos por categoría.` });
      else {
        free--;
        accepted.push({ ...base, status: "uploading", retryable: true });
      }
    }
    setQueue((q) => [...q, ...rejected, ...accepted]);
    if (accepted.length === 0) return;

    const sig = await getUploadSignatures(slot.id, accepted.length).catch(() => null);
    if (!sig || !sig.ok) {
      const error = sig ? sig.error : "Sin conexión. Revisa tu internet y toca Reintentar.";
      for (const item of accepted) patchItem(item.key, { status: "error", error, retryable: true });
      return;
    }
    // Hasta 2 subidas a la vez.
    const jobs = accepted.map((item, i) => () => sendItem(item, sig.uploads[i]));
    await Promise.all(Array.from({ length: Math.min(2, jobs.length) }, async () => {
      for (let job = jobs.shift(); job; job = jobs.shift()) await job();
    }));
  }

  async function retryItem(item: Item) {
    if (item.publicId) return confirmItem(item, item.publicId);
    if (room <= 0 && item.status === "error") {
      patchItem(item.key, { error: `No cabe: solo se permiten ${max} fotos por categoría.`, retryable: false });
      return;
    }
    patchItem(item.key, { status: "uploading", progress: 0, error: undefined });
    const sig = await getUploadSignatures(slot.id, 1).catch(() => null);
    if (!sig || !sig.ok) {
      patchItem(item.key, { status: "error", error: sig ? sig.error : "Sin conexión. Revisa tu internet y toca Reintentar.", retryable: true });
      return;
    }
    await sendItem(item, sig.uploads[0]);
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= photos.length || from === to) return;
    const next = [...photos];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setAnnounce(`Foto movida a la posición ${to + 1} de ${next.length}${to === 0 ? ". Ahora es la portada" : ""}.`);
    void mutate(() => reorderPhotos(slot.id, next.map((p) => p.publicId)), next);
  }

  async function remove(photo: UploadedImage) {
    setSelectedId(null);
    setToast(null);
    const r = await mutate(() => removePhoto(slot.id, photo.publicId), photos.filter((p) => p.publicId !== photo.publicId));
    if (r.ok) setToast({ publicId: photo.publicId });
  }

  async function undo() {
    if (!toast) return;
    const id = toast.publicId;
    setToast(null);
    await mutate(() => undoRemovePhoto(slot.id, id));
  }

  const status =
    pending > 0 ? (
      <p className="astatus" role="status"><LuLoader className="spin" aria-hidden="true" /> Guardando…</p>
    ) : saveError ? (
      <p className="astatus error" role="alert">
        <LuTriangleAlert aria-hidden="true" /> <span>{saveError}</span>
        {retry && <button type="button" className="abtn small" onClick={retry}>Reintentar</button>}
      </p>
    ) : hasSaved ? (
      <p className="astatus ok" role="status"><LuCheck aria-hidden="true" /> Todos los cambios están guardados</p>
    ) : (
      <p className="astatus" role="status" />
    );

  const ratioStyle = { "--ratio": `${slot.width} / ${slot.height}` } as React.CSSProperties;
  const previewPhotos = photos.length ? toCarousel(photos) : fallback ? [fallback] : [];

  return (
    <article
      className={`acard${dragOver ? " dragging" : ""}`}
      aria-labelledby={`t-${slot.id}`}
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes("Files") || ordering) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragOver(false);
      }}
      onDrop={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        setDragOver(false);
        void addFiles(Array.from(e.dataTransfer.files));
      }}
    >
      <header className="acard-head">
        <h3 id={`t-${slot.id}`}>{slot.label}</h3>
        <p className="acount" aria-live="polite">{photos.length} de {max} fotos</p>
      </header>

      {photos.length === 0 && queue.length === 0 && (
        <div className="adefault">
          {fallback ? (
            <div className="adefault-thumb" style={ratioStyle}>
              <Image src={fallback.src} alt="" fill sizes="8rem" />
              <span className="abadge default">Imagen predeterminada</span>
            </div>
          ) : (
            <div className="adefault-thumb empty" style={ratioStyle}><LuImagePlus aria-hidden="true" /></div>
          )}
          <p>Agrega tus fotos para personalizar esta categoría</p>
        </div>
      )}

      {(photos.length > 0 || queue.length > 0) && (
        <ul className={`athumbs${ordering ? " ordering" : ""}`} style={ratioStyle}>
          {photos.map((p, i) => (
            <li
              key={p.publicId}
              className="atile"
              draggable={ordering}
              onDragStart={() => (dragFrom.current = i)}
              onDragOver={(e) => ordering && e.preventDefault()}
              onDrop={(e) => {
                if (!ordering || dragFrom.current === null) return;
                e.preventDefault();
                move(dragFrom.current, i);
                dragFrom.current = null;
              }}
            >
              {ordering ? (
                <div className="athumb">
                  <Image src={p.thumb} alt={p.alt} fill sizes="9rem" unoptimized draggable={false} />
                  {i === 0 && <span className="abadge cover">Portada</span>}
                  <span className="anum" aria-hidden="true">{i + 1}</span>
                </div>
              ) : (
                <button type="button" className="athumb" onClick={() => setSelectedId(p.publicId)} aria-label={`Foto ${i + 1} de ${photos.length}${i === 0 ? ", portada" : ""}. Abrir opciones`}>
                  <Image src={p.thumb} alt="" fill sizes="9rem" unoptimized />
                  {i === 0 && <span className="abadge cover">Portada</span>}
                  <span className="anum" aria-hidden="true">{i + 1}</span>
                </button>
              )}
              {ordering && (
                <div className="amove">
                  <button type="button" className="abtn icon" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Mover la foto ${i + 1} una posición antes`}>
                    <LuArrowLeft aria-hidden="true" />
                  </button>
                  <button type="button" className="abtn icon" onClick={() => move(i, i + 1)} disabled={i === photos.length - 1} aria-label={`Mover la foto ${i + 1} una posición después`}>
                    <LuArrowRight aria-hidden="true" />
                  </button>
                </div>
              )}
            </li>
          ))}
          {queue.map((q) => (
            <li key={q.key} className={`atile pending${q.status === "error" ? " failed" : ""}`}>
              <div className="athumb">
                <p className="aname">{q.name}</p>
                {q.status === "error" ? (
                  <p className="aerr" role="alert">{q.error}</p>
                ) : (
                  <div className="aprogress" role="progressbar" aria-label={`Subiendo ${q.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={q.progress}>
                    <span style={{ width: `${q.progress}%` }} />
                  </div>
                )}
                <p className="aprog-text">{q.status === "confirming" ? "Guardando…" : q.status === "uploading" ? `${q.progress}%` : ""}</p>
              </div>
              {q.status === "error" && (
                <div className="aretry">
                  {q.retryable && (
                    <button type="button" className="abtn small" onClick={() => void retryItem(q)}>
                      <LuRefreshCw aria-hidden="true" /> Reintentar
                    </button>
                  )}
                  <button type="button" className="abtn small" onClick={() => dropItem(q.key)}>
                    <LuX aria-hidden="true" /> Quitar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {toast && (
        <p className="atoast" role="status">
          <span>Foto eliminada</span>
          <button type="button" className="abtn small" onClick={() => void undo()}>Deshacer</button>
        </p>
      )}

      {ordering ? (
        <div className="aorder">
          <p className="aintro">Usa las flechas (o arrastra en computadora) para ordenar. La primera foto es la portada y es la que se ve primero en el sitio.</p>
          <button type="button" className="abtn primary" onClick={() => setOrdering(false)}>Listo</button>
        </div>
      ) : (
        <>
          {full ? (
            <p className="afull" role="status"><LuCheck aria-hidden="true" /> Has agregado las {max} fotos disponibles</p>
          ) : (
            <>
              <label className="abtn primary add">
                <LuImagePlus aria-hidden="true" />
                <span>Agregar fotos</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => {
                    void addFiles(Array.from(e.target.files ?? []));
                    e.target.value = ""; // permite volver a elegir el mismo archivo
                  }}
                />
              </label>
              <p className="areqs">
                JPG, PNG o WebP · máx. 10 MB por foto · caben {Math.max(room, 0)} más{" "}
                <span className="adrop-hint">· o arrastra los archivos aquí</span>
              </p>
            </>
          )}
          <div className="aactions">
            <button type="button" className="abtn" onClick={() => setOrdering(true)} disabled={photos.length < 2}>
              <LuArrowUpDown aria-hidden="true" /> Ordenar fotos
            </button>
            <button type="button" className="abtn" onClick={() => setPreviewOpen(true)}>
              <LuEye aria-hidden="true" /> Vista previa
            </button>
          </div>
        </>
      )}

      {status}
      <p className="sr-only" role="status" aria-live="polite">{announce}</p>
      {dragOver && <div className="adrop" aria-hidden="true">Suelta las fotos aquí</div>}

      <Modal open={Boolean(selected)} onClose={() => setSelectedId(null)} title={selected ? `Foto ${selectedIndex + 1} de ${photos.length}${selectedIndex === 0 ? " · Portada" : ""}` : ""}>
        {selected && (
          <>
            <div className="aview">
              <Image src={selected.full} alt={selected.alt} fill sizes="(min-width: 40rem) 36rem, 100vw" unoptimized />
            </div>
            <div className="amodal-actions col">
              <button type="button" className="abtn" onClick={() => { setFramingId(selected.publicId); setSelectedId(null); }}>
                Ajustar encuadre {ratioLabel}
              </button>
              {selectedIndex === 0 ? (
                <p className="aintro center">Esta foto es la portada.</p>
              ) : (
                <button type="button" className="abtn" onClick={() => { move(selectedIndex, 0); setSelectedId(null); }}>
                  Hacer portada
                </button>
              )}
              <button type="button" className="abtn danger" onClick={() => void remove(selected)}>Eliminar foto</button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={Boolean(framing)} onClose={() => setFramingId(null)} title={`Ajustar encuadre ${ratioLabel}`}>
        {framing && (
          <FramingEditor
            photo={framing}
            ratio={slot}
            ratioLabel={ratioLabel}
            onCancel={() => setFramingId(null)}
            onSave={(focus) => { setFramingId(null); void mutate(() => setFraming(slot.id, framing.publicId, focus)); }}
            onReset={() => { setFramingId(null); void mutate(() => setFraming(slot.id, framing.publicId, null)); }}
          />
        )}
      </Modal>

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title={`Vista previa: ${slot.label}`}>
        {previewPhotos.length > 0 ? (
          <>
            <p className="aintro">
              {photos.length ? "Así se verá en el sitio, con este orden y estos recortes. La primera foto es la portada." : "Todavía no hay fotos tuyas: esta es la imagen predeterminada."}
            </p>
            <div className="apreview">
              <CardCarousel photos={previewPhotos} name={slot.label} sizes="(min-width: 40rem) 22rem, 90vw" />
            </div>
          </>
        ) : (
          <p className="aintro">Esta categoría todavía no tiene fotos. Agrega algunas para ver cómo quedan.</p>
        )}
        <div className="amodal-actions">
          <button type="button" className="abtn primary" onClick={() => setPreviewOpen(false)}>Cerrar vista previa</button>
        </div>
      </Modal>
    </article>
  );
}
