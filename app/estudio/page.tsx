"use client";

import { useState, useEffect, useRef } from "react";
import STUDY_HTML from "./study-html";

const PIN = process.env.NEXT_PUBLIC_ADMIN_PIN ?? "863041";
const SESSION_KEY = "talentoya_estudio_v1";

export default function EstudioPage() {
  const [authed,   setAuthed]   = useState(false);
  const [checking, setChecking] = useState(true);
  const [pin,      setPin]      = useState("");
  const [error,    setError]    = useState(false);
  const [shaking,  setShaking]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "ok") setAuthed(true);
    setChecking(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === PIN) {
      sessionStorage.setItem(SESSION_KEY, "ok");
      setAuthed(true);
    } else {
      setError(true);
      setShaking(true);
      setPin("");
      setTimeout(() => { setShaking(false); inputRef.current?.focus(); }, 600);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setPin("");
    setError(false);
  }

  if (checking) return null;

  if (authed) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#0A1628" }}>
        <iframe
          srcDoc={STUDY_HTML}
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          title="TalentoYA — Estudio de Mercado 2026"
        />
        <button
          onClick={handleLogout}
          style={{
            position: "fixed", bottom: 20, right: 20, zIndex: 10000,
            background: "rgba(10,22,40,.85)", backdropFilter: "blur(8px)",
            color: "white", border: "1px solid rgba(255,255,255,.15)",
            borderRadius: 8, padding: "6px 14px",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            letterSpacing: ".5px",
          }}
        >
          ✕ Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-10px); }
          40%       { transform: translateX(10px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
        .pin-input:focus { outline: none; border-color: #FF6200 !important; }
        .pin-input::placeholder { letter-spacing: 2px; }
      `}</style>

      <div style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #0A1628 0%, #0F2A4A 50%, #0A1628 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, fontFamily: "system-ui, -apple-system, sans-serif",
      }}>
        {/* Background circle accent */}
        <div style={{
          position: "fixed", right: -120, top: -120,
          width: 400, height: 400, borderRadius: "50%",
          border: "80px solid rgba(255,98,0,.06)", pointerEvents: "none",
        }} />
        <div style={{
          position: "fixed", left: -80, bottom: -80,
          width: 300, height: 300, borderRadius: "50%",
          border: "60px solid rgba(255,98,0,.04)", pointerEvents: "none",
        }} />

        <div style={{
          background: "white", borderRadius: 24, padding: "48px 40px",
          width: "100%", maxWidth: 420, textAlign: "center",
          boxShadow: "0 32px 80px rgba(0,0,0,.5)",
          position: "relative", zIndex: 1,
        }}>
          {/* Logo */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg, #0A1628, #1A2A42)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", fontSize: 24,
            }}>
              ⚡
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0A1628", margin: 0, letterSpacing: "-.5px" }}>
              Talento<span style={{ color: "#FF6200" }}>YA</span>
            </h1>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#94A3B8", marginTop: 4 }}>
              Estudio de Mercado
            </p>
          </div>

          {/* Gate text */}
          <div style={{
            background: "#F8FAFC", borderRadius: 12, padding: "14px 20px",
            marginBottom: 28, border: "1px solid #E2E8F0",
          }}>
            <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.6 }}>
              Documento confidencial.<br />
              Ingresa el c&oacute;digo de acceso para continuar.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <input
              ref={inputRef}
              type="password"
              value={pin}
              onChange={e => { setPin(e.target.value); setError(false); }}
              placeholder="• • • • • •"
              autoFocus
              autoComplete="current-password"
              className="pin-input"
              style={{
                width: "100%",
                padding: "16px",
                border: `2px solid ${error ? "#E53935" : "#E2E8F0"}`,
                borderRadius: 14,
                fontSize: 22,
                textAlign: "center",
                letterSpacing: 10,
                background: error ? "#FFF5F5" : "white",
                transition: "border-color .2s, background .2s",
                animation: shaking ? "shake 0.5s ease" : "none",
                boxSizing: "border-box",
              }}
            />

            {error && (
              <p style={{ color: "#E53935", fontSize: 13, marginTop: 10, fontWeight: 600 }}>
                C&oacute;digo incorrecto. Intenta de nuevo.
              </p>
            )}

            <button
              type="submit"
              disabled={pin.length === 0}
              style={{
                width: "100%", marginTop: 16,
                background: pin.length > 0 ? "#FF6200" : "#E2E8F0",
                color: pin.length > 0 ? "white" : "#94A3B8",
                border: "none", borderRadius: 14,
                padding: "15px", fontSize: 15, fontWeight: 800,
                cursor: pin.length > 0 ? "pointer" : "not-allowed",
                transition: "background .2s, color .2s",
                letterSpacing: ".3px",
              }}
            >
              Ingresar al Documento →
            </button>
          </form>

          <p style={{ fontSize: 11, color: "#CBD5E1", marginTop: 24, lineHeight: 1.6 }}>
            Solo para uso interno del equipo TalentoYA.<br />
            No compartir con terceros.
          </p>
        </div>
      </div>
    </>
  );
}
