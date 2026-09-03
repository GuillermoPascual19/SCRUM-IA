"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, Eye, EyeOff, Sparkles, Command, ShieldCheck, KeyRound, Check } from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

interface Props { mode: "login" | "register" }

const GITHUB_LOGIN_ERRORS: Record<string, string> = {
  no_account: "No existe ninguna cuenta con el email de esa cuenta de GitHub. Regístrate primero con tu email.",
  not_activated: "Esa cuenta existe pero no está activada. Revisa tu correo electrónico.",
  no_email: "No hemos podido leer un email verificado de tu cuenta de GitHub.",
  invalid_state: "La solicitud de GitHub expiró o no es válida. Inténtalo de nuevo.",
  error: "No se ha podido iniciar sesión con GitHub. Inténtalo de nuevo.",
};

function githubLoginUrl() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  return `${apiBase}/auth/github`;
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Floating label field                                                 */
/* ------------------------------------------------------------------ */
interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  focused?: boolean;
  type?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
}

function FloatingField({ id, label, value, onChange, onFocus, onBlur, focused, type = "text", icon, right }: FieldProps) {
  const filled = value.length > 0;
  return (
    <div className="relative">
      <div className={`relative flex h-12 items-center rounded-xl border transition-all duration-200 ${
        focused
          ? "border-[#22c55e]/70 bg-[#111] shadow-[0_0_0_3px_rgba(34,197,94,0.15)]"
          : "border-[#2a2a2a] bg-[#0d0d0d] hover:border-[#333]"
      }`}>
        {icon && (
          <span className={`pl-3.5 shrink-0 transition-colors duration-200 ${focused ? "text-[#22c55e]" : "text-[#555]"}`}>
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder=" "
          className="peer h-full flex-1 bg-transparent px-3 pt-4 pb-1 text-[14px] text-white outline-none placeholder-transparent"
        />
        <label
          htmlFor={id}
          className={`pointer-events-none absolute transition-all duration-200 ${icon ? "left-[44px]" : "left-3"} ${
            focused || filled
              ? "top-1.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[#22c55e]"
              : "top-1/2 -translate-y-1/2 text-[13px] text-[#555]"
          }`}
        >
          {label}
        </label>
        {right && <span className="pr-2 shrink-0">{right}</span>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */
export default function AuthScreen({ mode }: Props) {
  const isLogin = mode === "login";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  const stageRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);
  const [error, setError] = useState(() => {
    const ghError = searchParams.get("github");
    return ghError ? GITHUB_LOGIN_ERRORS[ghError] || GITHUB_LOGIN_ERRORS.error : "";
  });
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  /* Pointer-tracked aurora + magnetic CTA */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);

        const c = ctaRef.current;
        if (c) {
          const cr = c.getBoundingClientRect();
          const dx = e.clientX - (cr.left + cr.width / 2);
          const dy = e.clientY - (cr.top + cr.height / 2);
          const dist = Math.hypot(dx, dy);
          const radius = 160;
          if (dist < radius) {
            const f = (1 - dist / radius) * 7;
            c.style.transform = `translate(${(dx / dist) * f}px,${(dy / dist) * f}px)`;
          } else {
            c.style.transform = "translate(0,0)";
          }
        }
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  /* Password strength 0-4 */
  const strength = useMemo(() => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  }, [pwd]);

  const strengthLabel = ["—", "frágil", "aceptable", "sólido", "excelente"][strength];
  const strengthColor = strength <= 1 ? "#ef4444" : strength === 2 ? "#f59e0b" : "#22c55e";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      if (pwd.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
      if (!/[A-Z]/.test(pwd)) { setError("La contraseña debe contener al menos una mayúscula"); return; }
      if (!/[0-9]/.test(pwd)) { setError("La contraseña debe contener al menos un número"); return; }
      if (pwd !== confirmPwd) { setError("Las contraseñas no coinciden"); return; }
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { data } = await api.post("/auth/login", { email, password: pwd });
        setAuth(data.user, data.token, data.refreshToken);
        router.push("/dashboard");
      } else {
        await api.post("/auth/register", { name, email, password: pwd });
        setRegistered(true);
      }
    } catch (err: any) {
      const msg = err.response?.data?.error;
      if (msg === "ACCOUNT_NOT_ACTIVATED") {
        setError("Debes activar tu cuenta. Revisa tu correo electrónico.");
      } else {
        setError(msg || (isLogin ? "Error al iniciar sesión" : "Error al crear la cuenta"));
      }
    } finally {
      setLoading(false);
    }
  }

  /* Register success screen */
  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808]">
        <div
          className="max-w-sm w-full mx-auto text-center space-y-5 px-8"
          style={{ animation: "rise-in 0.6s ease-out both" }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center mx-auto">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Revisa tu correo</h2>
          <p className="text-[#666] text-sm leading-relaxed">
            Hemos enviado un enlace de activación a{" "}
            <span className="text-[#22c55e] font-medium">{email}</span>.
            Haz clic en él para activar tu cuenta.
          </p>
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-[#22c55e] hover:underline underline-offset-4">
            Ir al inicio de sesión <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={stageRef}
      className="relative min-h-screen overflow-hidden bg-[#080808] lg:grid lg:grid-cols-[1.15fr_1fr]"
      style={{ "--mx": "50%", "--my": "30%" } as React.CSSProperties}
    >
      {/* Aurora */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(600px circle at var(--mx) var(--my), rgba(34,197,94,0.13), transparent 60%), radial-gradient(800px circle at calc(100% - var(--mx)) calc(100% - var(--my)), rgba(34,197,94,0.05), transparent 65%)",
          transition: "background 0.1s linear",
        }}
      />

      {/* Grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "linear-gradient(#333 1px,transparent 1px),linear-gradient(90deg,#333 1px,transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at center,#000 30%,transparent 80%)",
        }}
      />

      {/* Noise */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      {/* ── LEFT — Brand ─────────────────────────────────── */}
      <aside className="relative z-10 hidden lg:flex flex-col justify-between p-12">
        {/* Logo */}
        <div className="flex items-center gap-3" style={{ animation: "rise-in 0.6s ease-out both" }}>
          <div className="relative grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#22c55e] to-[#16a34a]/50 text-black shadow-[0_0_20px_rgba(34,197,94,0.35)]">
            <Sparkles size={16} />
          </div>
          <div className="leading-tight">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#555]">Trabajo de fin de grado</p>
            <p className="text-lg font-bold tracking-tight text-white">SCRUM-IA</p>
          </div>
        </div>

        {/* Hero */}
        <div className="max-w-[520px]">
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#22c55e]/20 bg-[#22c55e]/5 px-3 py-1 text-[11px] text-[#555]"
            style={{ animation: "rise-in 0.7s ease-out 0.05s both" }}
          >
            <span className="size-1.5 rounded-full bg-[#22c55e]" style={{ animation: "pulse 2s infinite" }} />
            Plataforma activa · evaluación continua con IA
          </div>

          <h1
            className="text-[56px] font-bold leading-[0.97] tracking-[-0.03em] text-white"
            style={{ animation: "rise-in 0.8s ease-out 0.1s both" }}
          >
            {isLogin ? "Bienvenido" : "Únete"}<span className="text-[#22c55e]">.</span>
          </h1>

          <p
            className="mt-5 max-w-[420px] text-[15px] leading-relaxed text-[#666]"
            style={{ animation: "rise-in 0.8s ease-out 0.2s both" }}
          >
            Tu workspace ágil con evaluación continua mediante IA. Conecta GitHub,
            define el sprint y deja que el motor lea el código por ti.
          </p>

          {/* Animated SVG signature */}
          <svg
            viewBox="0 0 320 60"
            className="mt-8 h-10 w-auto text-[#22c55e]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            style={{ animation: "rise-in 0.9s ease-out 0.35s both" }}
          >
            <path
              d="M4 38 C 28 8, 52 8, 70 36 S 110 60, 132 30 T 196 30 T 260 30"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: 1,
                animation: "draw 2.2s cubic-bezier(.7,.1,.2,1) 0.6s forwards",
              }}
            />
            <circle
              cx="260" cy="30" r="3"
              fill="currentColor"
              style={{ opacity: 0, animation: "fade-dot 0.4s ease 2.6s forwards" }}
            />
          </svg>
        </div>

        {/* Footer */}
        <div
          className="flex flex-col gap-1.5 text-[11px] text-[#444]"
          style={{ animation: "rise-in 0.9s ease-out 0.5s both" }}
        >
          <span className="inline-flex items-center gap-2 text-[#555]">
            <ShieldCheck size={13} className="text-[#22c55e]" />
            JWT · Zod validation · Helmet.js · Rate limiting
          </span>
          <span>© 2026 SCRUM-IA · Trabajo Fin de Grado</span>
        </div>
      </aside>

      {/* ── RIGHT — Form ─────────────────────────────────── */}
      <main className="relative z-10 flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[400px]">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-[11px] text-[#444] hover:text-[#666] transition-colors"
          >
            ← Volver al inicio
          </Link>

          {/* Card */}
          <div
            className="relative rounded-2xl border border-[#1f1f1f] bg-[#0d0d0d]/80 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            style={{ animation: "rise-in 0.65s ease-out both" }}
          >
            {/* Gradient hairline top */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-8 -top-px h-px"
              style={{ background: "linear-gradient(90deg,transparent,rgba(34,197,94,0.6),transparent)" }}
            />

            {/* Header */}
            <div className="mb-7 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#444]">
                  {isLogin ? "Acceso" : "Crear cuenta"}
                </p>
                <h2 className="mt-1 text-[26px] font-bold tracking-tight text-white">
                  {isLogin ? "Inicia sesión" : "Únete a SCRUM-IA"}
                </h2>
              </div>
              <div className="hidden sm:flex items-center gap-1 rounded-md border border-[#1f1f1f] bg-[#111] px-2 py-1 text-[10px] text-[#444]">
                <Command size={10} />
                <span>+</span>
                <span>⏎</span>
              </div>
            </div>

            {/* OAuth row */}
            <button
              type="button"
              onClick={() => { window.location.href = githubLoginUrl(); }}
              className="group relative inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#1f1f1f] bg-[#111] text-sm font-medium text-[#aaa] transition-all hover:border-[#22c55e]/40 hover:text-white"
            >
              <GithubIcon />
              Continuar con GitHub
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full"
                style={{
                  background: "linear-gradient(90deg,transparent,rgba(34,197,94,0.1),transparent)",
                  animation: "shimmer-slide 2s infinite",
                }}
              />
            </button>
            {!isLogin && (
              <p className="mt-2 text-center text-[11px] text-[#555]">
                Solo para cuentas ya registradas — no crea una cuenta nueva.
              </p>
            )}

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-[#1f1f1f]" />
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#333]">o con email</span>
              <span className="h-px flex-1 bg-[#1f1f1f]" />
            </div>

            {/* Form */}
            <form
              className="space-y-3.5"
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") ctaRef.current?.click();
              }}
            >
              {!isLogin && (
                <FloatingField
                  id="name" label="Nombre completo" value={name} onChange={setName}
                  onFocus={() => setFocus("name")} onBlur={() => setFocus(null)} focused={focus === "name"}
                />
              )}

              <FloatingField
                id="email" type="email" label="Correo electrónico"
                icon={<Mail size={15} />}
                value={email} onChange={setEmail}
                onFocus={() => setFocus("email")} onBlur={() => setFocus(null)} focused={focus === "email"}
              />

              <div>
                <FloatingField
                  id="pwd" type={showPwd ? "text" : "password"} label="Contraseña"
                  icon={<KeyRound size={15} />}
                  value={pwd} onChange={setPwd}
                  onFocus={() => setFocus("pwd")} onBlur={() => setFocus(null)} focused={focus === "pwd"}
                  right={
                    <button
                      type="button" tabIndex={-1}
                      onClick={() => setShowPwd(v => !v)}
                      className="grid size-7 place-items-center rounded-lg text-[#444] transition hover:bg-[#1a1a1a] hover:text-white"
                      aria-label={showPwd ? "Ocultar" : "Mostrar"}
                    >
                      {showPwd ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  }
                />

                {/* Strength */}
                {!isLogin && pwd && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex flex-1 gap-1">
                      {[0, 1, 2, 3].map(i => (
                        <span
                          key={i}
                          className="h-1 flex-1 rounded-full transition-all duration-500"
                          style={{ background: i < strength ? strengthColor : "#1f1f1f" }}
                        />
                      ))}
                    </div>
                    <span className="w-16 text-right text-[9.5px] uppercase tracking-wider text-[#444]">
                      {strengthLabel}
                    </span>
                  </div>
                )}

                {/* Remember / Forgot */}
                {isLogin && (
                  <div className="mt-2.5 flex items-center justify-between">
                    <label className="inline-flex cursor-pointer items-center gap-2 text-[12px] text-[#555]">
                      <span className="relative inline-grid size-4 place-items-center rounded border border-[#2a2a2a] bg-[#111] transition has-[:checked]:border-[#22c55e] has-[:checked]:bg-[#22c55e]/10">
                        <input type="checkbox" className="peer absolute inset-0 cursor-pointer opacity-0" />
                        <Check size={10} className="text-[#22c55e] opacity-0 transition peer-checked:opacity-100" />
                      </span>
                      Recuérdame
                    </label>
                    <Link href="/forgot-password" className="text-[12px] font-medium text-[#22c55e] hover:underline underline-offset-4">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              {!isLogin && (
                <FloatingField
                  id="confirmPwd" type={showConfirmPwd ? "text" : "password"} label="Confirmar contraseña"
                  icon={<KeyRound size={15} />}
                  value={confirmPwd} onChange={setConfirmPwd}
                  onFocus={() => setFocus("confirmPwd")} onBlur={() => setFocus(null)} focused={focus === "confirmPwd"}
                  right={
                    <button
                      type="button" tabIndex={-1}
                      onClick={() => setShowConfirmPwd(v => !v)}
                      className="grid size-7 place-items-center rounded-lg text-[#444] transition hover:bg-[#1a1a1a] hover:text-white"
                    >
                      {showConfirmPwd ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  }
                />
              )}

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p className="text-[12px] text-red-400">{error}</p>
                </div>
              )}

              {/* CTA */}
              <button
                ref={ctaRef}
                type="submit"
                disabled={loading}
                className="group relative mt-1 w-full overflow-hidden rounded-xl bg-[#22c55e] py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ transition: "transform 0.2s ease-out, background 0.2s" }}
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      {isLogin ? "Entrando..." : "Creando cuenta..."}
                    </>
                  ) : (
                    <>
                      {isLogin ? "Entrar" : "Crear cuenta"}
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
                {/* Shimmer on hover */}
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700"
                />
              </button>

              <p className="pt-0.5 text-center text-[12px] text-[#444]">
                {isLogin ? "¿Aún no tienes cuenta?" : "¿Ya estás dentro?"}{" "}
                <Link
                  href={isLogin ? "/register" : "/login"}
                  className="group relative font-semibold text-white"
                >
                  {isLogin ? "Crear una" : "Inicia sesión"}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-[#22c55e] transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
