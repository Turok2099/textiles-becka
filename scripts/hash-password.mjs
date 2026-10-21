// Genera el valor de ADMIN_PASSWORD_HASH y un SESSION_SECRET nuevo.
// Uso: node scripts/hash-password.mjs "la-contraseña"
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error('Uso: node scripts/hash-password.mjs "contraseña de al menos 10 caracteres"');
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");

console.log(`ADMIN_PASSWORD_HASH=${salt}.${hash}`);
console.log(`SESSION_SECRET=${randomBytes(32).toString("hex")}`);
