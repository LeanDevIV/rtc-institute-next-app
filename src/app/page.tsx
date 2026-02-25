"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  function switchMode(m: "login" | "register") {
    setMode(m);
    setEmail("");
    setPassword("");
    setName("");
  }

  const login = async (provider: "google" | "github") => {
    await authClient.signIn.social({
      provider: provider,
      callbackURL: "/auth/callback",
    });
  };

  const logout = async () => {
    await authClient.signOut();
    //TODO: redirigir a página de inicio o mostrar mensaje de cierre de sesión exitoso
    window.location.href = "/";
  };
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className={styles.intro}>
          <h1>First Next app.</h1>
        </div>

        <div className={styles.ctas}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button
              onClick={() => switchMode("login")}
              aria-pressed={mode === "login"}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => switchMode("register")}
              aria-pressed={mode === "register"}
            >
              Registrarse
            </button>
          </div>

          <form style={{ maxWidth: 360 }}>
            {mode === "register" && (
              <div style={{ marginBottom: 8 }}>
                <label>
                  Nombre
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
              </div>
            )}

            <div style={{ marginBottom: 8 }}>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label>
                Contraseña
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </label>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button type="submit">
                {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("");
                  setPassword("");
                  setName("");
                }}
              >
                Limpiar
              </button>
            </div>

            <div style={{ borderTop: "1px solid #ddd", paddingTop: 12 }}>
              <p style={{ marginBottom: 8 }}>O continua con</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => login("google")}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                  }}
                >
                  Continuar con Google
                </button>
                <button
                  onClick={() => login("github")}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                  }}
                >
                  Continuar con GitHub
                </button>
              </div>
              <button
                onClick={logout}
                style={{
                  marginTop: 12,
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                }}
              >
                cerrar sesión
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
