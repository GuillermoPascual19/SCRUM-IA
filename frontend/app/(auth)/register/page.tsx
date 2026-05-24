"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "estudiante",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      toast({ variant: "destructive", title: "Error", description: "La contraseña debe tener al menos 6 caracteres" })
      return;
    }
    if (!/[A-Z]/.test(form.password)) {
      toast({ variant: "destructive", title: "Error", description: "La contraseña debe contener al menos una letra mayúscula" })
      return;
    }
    if (!/[0-9]/.test(form.password)) {
      toast({ variant: "destructive", title: "Error", description: "La contraseña debe contener al menos un número" })
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast({ variant: "destructive", title: "Error", description: "Las contraseñas no coinciden" })
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      toast({ variant: "success", title: "Cuenta creada", description: "Revisa tu correo para activarla" })
      router.push("/login");
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: "Fallo al registrarse" })
      setRegistered(true);
      
    } finally {
      setLoading(false);
    }
  }

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f0a]">
        <div className="max-w-sm w-full mx-auto text-center space-y-4 px-8">
          <div className="w-12 h-12 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center mx-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Revisa tu correo</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Hemos enviado un enlace de activación a{" "}
            <span className="text-[#22c55e]">{form.email}</span>. Haz clic en el enlace para activar tu cuenta.
          </p>
          <Link href="/login" className="inline-block text-[#22c55e] text-sm hover:underline">
            Volver al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0a0f0a]">
      <div
        className="hidden lg:flex lg:w-[55%] flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: "radial-gradient(ellipse at bottom right, #14532d 0%, #0a0f0a 60%)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#22c55e] flex items-center justify-center text-black font-bold text-sm">S</div>
          <span className="text-white font-semibold text-sm">SCRUM-IA</span>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-[#22c55e] text-xs font-semibold uppercase tracking-widest">Plataforma TFG</p>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Tu TFG, gestionado con SCRUM y evaluado con IA.
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Conecta tu repositorio de GitHub y deja que la plataforma cruce tus commits con el backlog para emitir feedback continuo.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { title: "Roles seguros", desc: "Estudiante, profesor, coordinador, admin." },
              { title: "Permisos por proyecto", desc: "Product Owner, Scrum Master, Developer." },
              { title: "Privacidad de datos", desc: "Solo se leen commits autorizados explícitamente." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-3 rounded-lg border border-[#22c55e]/20 bg-[#22c55e]/5">
                <div className="w-5 h-5 rounded-full border border-[#22c55e] flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-xs">© 2026 SCRUM-IA · Trabajo Fin de Grado</p>
      </div>

      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 md:px-16">
        <div className="max-w-sm w-full mx-auto space-y-6">
          <Link href="/login" className="text-gray-500 text-xs hover:text-gray-300 transition-colors flex items-center gap-1">
            ← Volver al inicio
          </Link>

          <div>
            <h2 className="text-2xl font-bold text-white">Crea tu cuenta</h2>
            <p className="text-gray-500 text-sm mt-1">Únete y conecta tu repositorio para empezar.</p>
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-[#333] text-white text-sm font-medium hover:bg-[#222] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Continuar con GitHub
          </button>

          <div className="p-3 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20">
            <p className="text-[#22c55e] text-xs leading-relaxed">
              Al continuar autorizas a SCRUM-IA a leer los commits de tu repositorio de proyecto. Esos datos se usan para evaluación académica.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#333]" />
            <span className="text-gray-600 text-xs">O CON EMAIL</span>
            <div className="flex-1 h-px bg-[#333]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Nombre completo</label>
              <input type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#111] border border-[#333] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#22c55e] transition-colors"
                placeholder="Ada Lovelace" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email académico</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#111] border border-[#333] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#22c55e] transition-colors"
                  placeholder="alumno@uni.edu" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Contraseña</label>
              <input type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#111] border border-[#333] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#22c55e] transition-colors"
                placeholder="••••••••" />
            </div>

            {form.password && (
              <ul className="text-xs space-y-1 mt-1.5">
                <li className={form.password.length >= 6 ? "text-[#22c55e]" : "text-gray-500"}>
                  {form.password.length >= 6 ? "✓" : "·"} Mínimo 6 caracteres
                </li>
                <li className={/[A-Z]/.test(form.password) ? "text-[#22c55e]" : "text-gray-500"}>
                  {/[A-Z]/.test(form.password) ? "✓" : "·"} Al menos una mayúscula
                </li>
                <li className={/[0-9]/.test(form.password) ? "text-[#22c55e]" : "text-gray-500"}>
                  {/[0-9]/.test(form.password) ? "✓" : "·"} Al menos un número
                </li>
              </ul>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirmar contraseña</label>
              <input type="password" required value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#111] border border-[#333] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#22c55e] transition-colors"
                placeholder="••••••••" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Rol académico</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#111] border border-[#333] text-white text-sm focus:outline-none focus:border-[#22c55e] transition-colors">
                <option value="estudiante">Estudiante</option>
                <option value="profesor">Profesor</option>
                <option value="coordinador">Coordinador</option>
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#22c55e] text-black font-semibold text-sm hover:bg-[#16a34a] transition-colors disabled:opacity-50">
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-[#22c55e] hover:underline font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
