"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Mínimo 6 caracteres"); return; }
    if (!/[A-Z]/.test(form.password)) { setError("Debe contener al menos una mayúscula"); return; }
    if (!/[0-9]/.test(form.password)) { setError("Debe contener al menos un número"); return; }
    if (form.password !== form.confirmPassword) { setError("Las contraseñas no coinciden"); return; }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password: form.password });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (e: any) {
      setError(e.response?.data?.error || "Error al restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-sm w-full mx-auto text-center space-y-4 px-8">
        <div className="w-12 h-12 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center mx-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">Contraseña actualizada</h2>
        <p className="text-gray-400 text-sm">Redirigiendo al login...</p>
        <Link href="/login" className="inline-block text-[#22c55e] text-sm hover:underline">Ir al login ahora</Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm w-full mx-auto space-y-6 px-8">
      <Link href="/login" className="text-gray-500 text-xs hover:text-gray-300 transition-colors flex items-center gap-1">
        ← Volver al login
      </Link>
      <div>
        <h2 className="text-2xl font-bold text-white">Nueva contraseña</h2>
        <p className="text-gray-500 text-sm mt-1">Introduce tu nueva contraseña.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Nueva contraseña</label>
          <input type="password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-[#111] border border-[#333] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#22c55e] transition-colors"
            placeholder="••••••••"/>
          {form.password && (
            <ul className="text-xs space-y-1 mt-1.5">
              <li className={form.password.length >= 6 ? "text-[#22c55e]" : "text-gray-500"}>{form.password.length >= 6 ? "✓" : "·"} Mínimo 6 caracteres</li>
              <li className={/[A-Z]/.test(form.password) ? "text-[#22c55e]" : "text-gray-500"}>{/[A-Z]/.test(form.password) ? "✓" : "·"} Al menos una mayúscula</li>
              <li className={/[0-9]/.test(form.password) ? "text-[#22c55e]" : "text-gray-500"}>{/[0-9]/.test(form.password) ? "✓" : "·"} Al menos un número</li>
            </ul>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirmar contraseña</label>
          <input type="password" required value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-[#111] border border-[#333] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#22c55e] transition-colors"
            placeholder="••••••••"/>
        </div>
        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</p>
        )}
        <button type="submit" disabled={loading}
          className="w-full py-2.5 rounded-lg bg-[#22c55e] text-black font-semibold text-sm hover:bg-[#16a34a] transition-colors disabled:opacity-50">
          {loading ? "Guardando..." : "Guardar contraseña"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f0a]">
      <Suspense fallback={
        <div className="max-w-sm w-full mx-auto text-center px-8">
          <div className="w-12 h-12 rounded-full border-2 border-[#22c55e] border-t-transparent animate-spin mx-auto"/>
        </div>
      }>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
