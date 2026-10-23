"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { sendContact } from "@/app/contacto/actions";

type Phase = { name: "idle" | "sent" | "fallback" } | { name: "invalid"; error: string };

// El mensaje se envía al correo de BKTX desde el servidor (Resend). Si el correo no está configurado o falla,
// se ofrece el mismo mensaje listo para enviar por WhatsApp, para no perder el contacto.
export function ContactForm({ whatsappNumber }: Readonly<{ whatsappNumber: string }>) {
  const [phase, setPhase] = useState<Phase>({ name: "idle" });
  const [waHref, setWaHref] = useState("");
  const [pending, startTransition] = useTransition();
  // Momento en que se mostró el formulario: un envío casi instantáneo es de un bot (ver actions.ts).
  const shownAt = useRef(0);
  const status = useRef<HTMLDivElement>(null);

  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  // Lleva el resultado a la vista: bajo el botón puede quedar fuera de pantalla.
  useEffect(() => {
    if (phase.name !== "idle") status.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [phase]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("t", String(Date.now() - shownAt.current));
    const text = [
      "Hola, quiero información de BKTX.",
      `Nombre: ${data.get("nombre")}`,
      `Correo: ${data.get("correo")}`,
      `Teléfono: ${data.get("telefono")}`,
      `Necesito: ${data.get("mensaje")}`,
    ].join("\n");
    setWaHref(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`);
    startTransition(async () => {
      try {
        const result = await sendContact(data);
        if (result.status === "sent") form.reset();
        setPhase(result.status === "invalid" ? { name: "invalid", error: result.error } : { name: result.status });
      } catch {
        setPhase({ name: "fallback" });
      }
    });
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <h3>Cuéntanos qué necesitas</h3>
      <label>
        Nombre
        <input name="nombre" type="text" autoComplete="name" maxLength={100} required />
      </label>
      <label>
        Correo
        <input name="correo" type="email" autoComplete="email" maxLength={150} required />
      </label>
      <label>
        Teléfono
        <input name="telefono" type="tel" autoComplete="tel" maxLength={30} required />
      </label>
      <label>
        ¿Qué necesitas?
        <textarea name="mensaje" rows={4} maxLength={2000} required />
      </label>
      {/* Campo trampa contra bots: oculto para las personas y para lectores de pantalla. */}
      <div className="hp" aria-hidden="true">
        <label>
          No llenar
          <input name="sitio" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button className="button" type="submit" disabled={pending}>{pending ? "Enviando…" : "Enviar mensaje"}</button>
      <div ref={status} className={`form-note${phase.name === "sent" ? " ok" : phase.name === "idle" ? "" : " warn"}`} role="status">
        {phase.name === "idle" && <p>Tu mensaje llegará a nuestro correo. También puedes escribirnos por WhatsApp.</p>}
        {phase.name === "sent" && <p><strong>Recibimos tu mensaje.</strong> En breve nos comunicaremos contigo.</p>}
        {phase.name === "invalid" && <p>{phase.error}</p>}
        {phase.name === "fallback" && (
          <p>
            No pudimos enviar el mensaje por correo.{" "}
            <a className="card-link" href={waHref} target="_blank" rel="noopener noreferrer">
              Envíalo por WhatsApp<span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
          </p>
        )}
      </div>
    </form>
  );
}
