"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="admin-form">
      <label>
        Usuario
        <input name="usuario" type="text" autoComplete="username" required />
      </label>
      <label>
        Contraseña
        <input name="contrasena" type="password" autoComplete="current-password" required />
      </label>
      {state.error && <p role="alert" className="admin-error">{state.error}</p>}
      <button className="button" type="submit" disabled={pending}>{pending ? "Entrando…" : "Entrar"}</button>
    </form>
  );
}
