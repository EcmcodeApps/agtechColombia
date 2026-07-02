"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 59;

type VerifyState = "idle" | "loading" | "error" | "success";

// ── Página ────────────────────────────────────────────────────────────────────
export default function VerificarCodigoPage() {
  const router = useRouter();

  // OTP digits
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // Verify state
  const [verifyState, setVerifyState] = useState<VerifyState>("idle");

  // Resend countdown
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);

  // ── Countdown timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(RESEND_SECONDS);
    setCanResend(false);
    setDigits(Array(CODE_LENGTH).fill(""));
    setVerifyState("idle");
    inputs.current[0]?.focus();
    // TODO: Firebase Auth — resend OTP
  };

  // ── Input handlers ─────────────────────────────────────────────────────────
  const handleChange = (index: number, value: string) => {
    // Accept only the last numeric character typed
    const num = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = num;
    setDigits(next);
    setVerifyState("idle");

    if (num && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        // Clear current cell
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        // Move to previous cell
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
        inputs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    const next = Array(CODE_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const nextFocus = Math.min(pasted.length, CODE_LENGTH - 1);
    inputs.current[nextFocus]?.focus();
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const isFilled = digits.every((d) => d !== "");

  const handleVerify = () => {
    if (!isFilled || verifyState === "loading") return;
    setVerifyState("loading");
    // TODO: Firebase Auth — verifyPasswordResetCode(auth, code)
    setTimeout(() => {
      const isValid = true; // placeholder; replace with real check
      if (isValid) {
        setVerifyState("success");
        setTimeout(() => router.push("/nueva-contrasena"), 900);
      } else {
        setVerifyState("error");
        setDigits(Array(CODE_LENGTH).fill(""));
        inputs.current[0]?.focus();
        setTimeout(() => setVerifyState("idle"), 1800);
      }
    }, 1600);
  };

  // ── Derived styles ─────────────────────────────────────────────────────────
  const cellBase =
    "w-11 h-14 sm:w-12 sm:h-16 rounded-xl border-2 text-headline-md text-center font-bold text-on-surface bg-surface-container-low caret-primary outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20";

  const cellState =
    verifyState === "error"
      ? "border-error animate-[shake_0.35s_ease]"
      : verifyState === "success"
      ? "border-secondary"
      : "border-outline-variant";

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-margin-mobile md:px-margin-desktop h-16 bg-surface/80 backdrop-blur-md">
        <span className="text-headline-md font-bold text-primary">TalentoYa</span>
        <Link
          href="/recuperar-contrasena"
          className="inline-flex items-center gap-xs text-label-md text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          Volver
        </Link>
      </header>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-grow flex items-center justify-center px-margin-mobile py-xl mt-16">
        <div className="w-full max-w-[480px] space-y-lg">

          {/* Icono decorativo */}
          <div className="flex justify-center mb-xl">
            <div className="relative h-24 w-24 rounded-2xl bg-secondary-container flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
              <span
                className="material-symbols-outlined text-on-secondary-container text-[48px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                sms
              </span>
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-md">
                <span
                  className="material-symbols-outlined text-white text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta */}
          <section className="bg-white/80 backdrop-blur-md border border-outline-variant/30 rounded-xl p-lg md:p-xl shadow-[0px_4px_20px_rgba(15,76,129,0.05)]">
            <div className="space-y-xs text-center mb-xl">
              <h1 className="text-headline-lg text-on-surface">Verificar código</h1>
              <p className="text-body-md text-on-surface-variant mx-auto">
                Ingresa el código de 6 dígitos que enviamos a tu correo electrónico.
              </p>
            </div>

            {/* ── Celdas OTP ────────────────────────────────────────────── */}
            <div
              className="flex justify-center gap-xs sm:gap-sm mb-lg"
              onPaste={handlePaste}
            >
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  value={digit}
                  autoComplete="one-time-code"
                  aria-label={`Dígito ${i + 1} de ${CODE_LENGTH}`}
                  className={`${cellBase} ${cellState}`}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                  disabled={verifyState === "loading" || verifyState === "success"}
                />
              ))}
            </div>

            {/* ── Reenviar código ────────────────────────────────────────── */}
            <div className="text-center mb-lg min-h-[24px]">
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="text-label-md text-energy-orange hover:underline transition-all active:scale-95"
                >
                  Reenviar código
                </button>
              ) : (
                <p className="text-body-sm text-on-surface-variant">
                  Reenviar en{" "}
                  <span className="text-primary font-semibold tabular-nums">
                    0:{String(countdown).padStart(2, "0")}
                  </span>
                </p>
              )}
            </div>

            {/* ── Mensaje de error ───────────────────────────────────────── */}
            {verifyState === "error" && (
              <div className="mb-md flex items-center gap-xs text-error text-body-sm justify-center animate-fade-in">
                <span className="material-symbols-outlined text-[18px]">
                  error
                </span>
                Código incorrecto. Por favor intenta de nuevo.
              </div>
            )}

            {/* ── Botón verificar ────────────────────────────────────────── */}
            <button
              onClick={handleVerify}
              disabled={!isFilled || verifyState === "loading" || verifyState === "success"}
              className={`w-full text-white text-label-md font-bold py-md rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-sm disabled:cursor-not-allowed ${
                verifyState === "success"
                  ? "bg-secondary"
                  : "bg-energy-orange hover:brightness-110 disabled:opacity-60"
              }`}
            >
              {verifyState === "idle" && (
                <>
                  <span>Verificar código</span>
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </>
              )}
              {verifyState === "loading" && (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">
                    sync
                  </span>
                  <span>Verificando...</span>
                </>
              )}
              {verifyState === "error" && (
                <>
                  <span>Verificar código</span>
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </>
              )}
              {verifyState === "success" && (
                <>
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span>¡Verificado!</span>
                </>
              )}
            </button>
          </section>

          {/* ── Insignias de confianza ─────────────────────────────────── */}
          <div className="flex items-center justify-center gap-lg flex-wrap">
            <div className="flex items-center gap-xs">
              <span
                className="material-symbols-outlined text-secondary text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                security
              </span>
              <span className="text-body-sm text-on-surface-variant">
                Conexión 100% segura
              </span>
            </div>
            <div className="w-px h-4 bg-outline-variant hidden sm:block" />
            <div className="flex items-center gap-xs">
              <span
                className="material-symbols-outlined text-tertiary text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                support_agent
              </span>
              <span className="text-body-sm text-on-surface-variant">
                Soporte 24/7
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="w-full py-xl px-margin-mobile flex items-center justify-center bg-surface-container/50">
        <p className="text-body-sm text-on-surface-variant text-center">
          © 2025 TalentoYa Colombia. Todos los derechos reservados.
        </p>
      </footer>

      {/* ── Fondo atmosférico ────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary-fixed-dim blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary-fixed-dim blur-[100px]" />
      </div>
    </div>
  );
}
