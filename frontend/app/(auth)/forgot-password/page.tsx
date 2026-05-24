"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch {
      setError("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
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
            Si el email está registrado recibirás un enlace para restablecer tu contraseña.
          </p>
          <Link href="/login" className="inline-block text-[#22c55e] text-sm hover:underline">
            Volver al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f0a]">
      <div className="max-w-sm w-full mx-auto space-y-6 px-8">
        <Link href="/login" className="text-gray-500 text-xs hover:text-gray-300 transition-colors flex items-center gap-1">
          ← Volver al login
        </Link>

        <div>
          <h2 className="text-2xl font-bold text-white">Recuperar contraseña</h2>
          <p className="text-gray-500 text-sm mt-1">Introduce tu email y te enviaremos un enlace.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email académico</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#111] border border-[#333] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#22c55e] transition-colors"
                placeholder="alumno@uni.edu"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#22c55e] text-black font-semibold text-sm hover:bg-[#16a34a] transition-colors disabled:opacity-50">
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>
      </div>
    </div>
  );
}
