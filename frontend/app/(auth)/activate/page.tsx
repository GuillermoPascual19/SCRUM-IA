"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function ActivatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Enlace de activación inválido.");
      return;
    }
    api
      .get(`/auth/activate?token=${token}`)
      .then(() => {
        setStatus("success");
        setTimeout(() => router.push("/login"), 3000);
      })
      .catch((e) => {
        setStatus("error");
        setMessage(e.response?.data?.error || "Error al activar la cuenta.");
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f0a]">
      <div className="max-w-sm w-full mx-auto text-center space-y-4 px-8">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 rounded-full border-2 border-[#22c55e] border-t-transparent animate-spin mx-auto" />
            <p className="text-gray-400 text-sm">Activando tu cuenta...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-12 h-12 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center mx-auto">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Cuenta activada</h2>
            <p className="text-gray-400 text-sm">Tu cuenta está lista. Redirigiendo al login...</p>
            <Link href="/login" className="inline-block text-[#22c55e] text-sm hover:underline">
              Ir al login ahora
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Enlace inválido</h2>
            <p className="text-gray-400 text-sm">{message}</p>
            <Link href="/register" className="inline-block text-[#22c55e] text-sm hover:underline">
              Volver al registro
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
