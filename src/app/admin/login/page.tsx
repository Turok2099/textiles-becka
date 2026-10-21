import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="admin-login">
      <h1>Acceso privado</h1>
      <p className="lead">Ingresa para cambiar las imágenes del sitio.</p>
      <LoginForm />
    </main>
  );
}
