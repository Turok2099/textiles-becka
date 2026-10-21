import "server-only";
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

// Sesión de una sola persona: usuario y contraseña (hash scrypt) en variables de entorno,
// cookie httpOnly firmada con HMAC. Sin base de datos. Ver scripts/hash-password.mjs.

const COOKIE = "beckatex_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 días

const adminUser = process.env.ADMIN_USER?.trim();
const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();
const secret = process.env.SESSION_SECRET?.trim();

export const isAuthConfigured = Boolean(adminUser && passwordHash && secret && secret.length >= 32);

function hmac(value: string) {
  return createHmac("sha256", secret!).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// Formato del hash: "<sal hex>.<hash hex>".
function passwordMatches(password: string) {
  const [salt, hash] = passwordHash!.split(".");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function credentialsAreValid(user: string, password: string) {
  if (!isAuthConfigured) return false;
  // Se evalúan ambas para no revelar cuál falló.
  const userOk = safeEqual(user, adminUser!);
  const passOk = passwordMatches(password);
  return userOk && passOk;
}

export async function createSession() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${hmac(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function hasSession() {
  if (!isAuthConfigured) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature || !safeEqual(signature, hmac(payload))) return false;
  // La caducidad depende de la hora actual: se evalúa siempre en la petición, nunca al prerenderizar.
  await connection();
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp: number };
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

// Para páginas: redirige al login si no hay sesión.
export async function requireAdmin() {
  if (!(await hasSession())) redirect("/admin/login");
}

// Para Server Actions: lanza error si no hay sesión (nunca confiar solo en que la página esté oculta).
export async function assertAdmin() {
  if (!(await hasSession())) throw new Error("No autorizado");
}
