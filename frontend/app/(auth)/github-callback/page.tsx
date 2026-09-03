"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

function GithubCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const token = searchParams.get("token");
  const refreshToken = searchParams.get("refreshToken");

  const [error, setError] = useState(!token || !refreshToken);

  useEffect(() => {
    if (!token || !refreshToken) return;

    api
      .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data: user }) => {
        setAuth(user, token, refreshToken);
        router.push("/dashboard");
      })
      .catch(() => setError(true));
  }, [token, refreshToken, router, setAuth]);

  if (error) {
    return (
      <div className="max-w-sm w-full mx-auto text-center space-y-4 px-8">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">No se ha podido iniciar sesión</h2>
        <p className="text-gray-400 text-sm">Vuelve a intentarlo desde la pantalla de acceso.</p>
        <a href="/login" className="inline-block text-[#22c55e] text-sm hover:underline">
          Ir al login
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-sm w-full mx-auto text-center space-y-4 px-8">
      <div className="w-12 h-12 rounded-full border-2 border-[#22c55e] border-t-transparent animate-spin mx-auto" />
      <p className="text-gray-400 text-sm">Iniciando sesión con GitHub...</p>
    </div>
  );
}

export default function GithubCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f0a]">
      <Suspense fallback={
        <div className="max-w-sm w-full mx-auto text-center space-y-4 px-8">
          <div className="w-12 h-12 rounded-full border-2 border-[#22c55e] border-t-transparent animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Cargando...</p>
        </div>
      }>
        <GithubCallbackContent />
      </Suspense>
    </div>
  );
}
