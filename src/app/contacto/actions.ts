"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

// "sent": el correo salió (o se descartó un envío de bot). "fallback": no hay correo configurado o falló; el formulario ofrece WhatsApp.
// "invalid": datos no válidos; `error` explica qué corregir.
export type ContactResult = { status: "sent" | "fallback" } | { status: "invalid"; error: string };

// Límite de envíos por IP, en memoria: un freno básico contra abuso, no una defensa completa.
const sends = new Map<string, { count: number; since: number }>();
const MAX_SENDS = 5;
const WINDOW_MS = 15 * 60 * 1000;

const clean = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function sendContact(formData: FormData): Promise<ContactResult> {
  // Campo trampa: las personas no lo ven; si viene relleno es un bot y se responde "enviado" sin enviar nada.
  if (clean(formData.get("sitio"), 200)) return { status: "sent" };

  const nombre = clean(formData.get("nombre"), 100);
  const correo = clean(formData.get("correo"), 150);
  const telefono = clean(formData.get("telefono"), 30);
  const mensaje = clean(formData.get("mensaje"), 2000);
  if (!nombre || !mensaje) return { status: "invalid", error: "Escribe tu nombre y lo que necesitas." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return { status: "invalid", error: "Revisa que el correo esté bien escrito." };
  if (telefono.replace(/\D/g, "").length < 8) return { status: "invalid", error: "Revisa que el teléfono esté completo." };

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!apiKey || !to) return { status: "fallback" };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const entry = sends.get(ip);
  if (entry && now - entry.since < WINDOW_MS) {
    if (entry.count >= MAX_SENDS) return { status: "invalid", error: "Has enviado varios mensajes seguidos. Inténtalo más tarde o escríbenos por WhatsApp." };
    entry.count++;
  } else {
    sends.set(ip, { count: 1, since: now });
  }

  const from = process.env.CONTACT_FROM_EMAIL?.trim() || "BKTX Soluciones Textiles <onboarding@resend.dev>";
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: to.split(",").map((a) => a.trim()).filter(Boolean),
      replyTo: correo,
      subject: `Nuevo mensaje desde el sitio web: ${nombre.replace(/[\r\n]+/g, " ")}`,
      text: [`Nombre: ${nombre}`, `Correo: ${correo}`, `Teléfono: ${telefono}`, "", "Mensaje:", mensaje].join("\n"),
    });
    if (error) {
      console.error("Resend no pudo enviar el mensaje de contacto:", error.name);
      return { status: "fallback" };
    }
    return { status: "sent" };
  } catch (error) {
    console.error("Fallo al enviar el mensaje de contacto:", error instanceof Error ? error.message : "error desconocido");
    return { status: "fallback" };
  }
}
