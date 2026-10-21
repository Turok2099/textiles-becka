"use client";

import { useState, type FormEvent } from "react";

// No hay servidor ni correo configurado: al enviar, el mensaje se abre listo en WhatsApp de BKTX.
export function ContactForm({ whatsappNumber }: Readonly<{ whatsappNumber: string }>) {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = [
      "Hola, quiero información de BKTX.",
      `Nombre: ${data.get("nombre")}`,
      `Correo: ${data.get("correo")}`,
      `Teléfono: ${data.get("telefono")}`,
      `Necesito: ${data.get("mensaje")}`,
    ].join("\n");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <h3>Cuéntanos qué necesitas</h3>
      <label>
        Nombre
        <input name="nombre" type="text" autoComplete="name" required />
      </label>
      <label>
        Correo
        <input name="correo" type="email" autoComplete="email" required />
      </label>
      <label>
        Teléfono
        <input name="telefono" type="tel" autoComplete="tel" required />
      </label>
      <label>
        ¿Qué necesitas?
        <textarea name="mensaje" rows={4} required />
      </label>
      <button className="button" type="submit">Enviar por WhatsApp</button>
      <p className="form-note" role="status">
        {sent
          ? "Se abrió WhatsApp con tu mensaje. Envíalo desde ahí para que nos llegue."
          : "Al enviar, se abrirá WhatsApp con tu mensaje listo para mandarlo."}
      </p>
    </form>
  );
}
