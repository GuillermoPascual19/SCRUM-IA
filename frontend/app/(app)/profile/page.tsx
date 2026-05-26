"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

const ROLE_LABELS: Record<string, string> = {
  student: "Estudiante",
  teacher: "Profesor",
  coordinator: "Coordinador",
  admin: "Administrador",
};

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();

  const [name, setName] = useState(user?.name ?? "");
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || name.trim() === user?.name) return;
    setSavingName(true);
    setNameMsg(null);
    try {
      const { data } = await api.put("/auth/profile", { name: name.trim() });
      updateUser({ name: data.name });
      setNameMsg({ ok: true, text: "Nombre actualizado correctamente." });
    } catch {
      setNameMsg({ ok: false, text: "Error al actualizar el nombre." });
    } finally {
      setSavingName(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdMsg(null);

    if (newPassword.length < 6) {
      setPwdMsg({ ok: false, text: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setPwdMsg({ ok: false, text: "La contraseña debe contener al menos una mayúscula." });
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setPwdMsg({ ok: false, text: "La contraseña debe contener al menos un número." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ ok: false, text: "Las contraseñas no coinciden." });
      return;
    }

    setSavingPwd(true);
    try {
      await api.put("/auth/change-password", { currentPassword, newPassword });
      setPwdMsg({ ok: true, text: "Contraseña actualizada correctamente." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg = err.response?.data?.error ?? "Error al cambiar la contraseña.";
      setPwdMsg({ ok: false, text: msg });
    } finally {
      setSavingPwd(false);
    }
  }

  return (
    <div className="flex justify-center">
    <div className="w-full max-w-xl space-y-8">
      <div>
        <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Cuenta</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Perfil</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Gestiona tu información personal y contraseña.</p>
      </div>

      {/* Avatar + rol */}
      <div className="flex items-center gap-4 bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
        <div className="w-14 h-14 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xl font-bold shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-base font-semibold text-[var(--foreground)]">{user?.name}</p>
          <p className="text-sm text-[var(--muted-foreground)]">{user?.email}</p>
          <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full bg-[var(--primary)]/15 text-[var(--primary)] font-medium">
            {ROLE_LABELS[user?.role ?? ""] ?? user?.role}
          </span>
        </div>
      </div>

      {/* Información */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Información personal</h2>
        <form onSubmit={handleSaveName} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5">Email</label>
            <input
              type="email"
              value={user?.email ?? ""}
              disabled
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--muted-foreground)] opacity-60 cursor-not-allowed"
            />
          </div>
          {nameMsg && (
            <p className={`text-xs ${nameMsg.ok ? "text-[var(--primary)]" : "text-red-400"}`}>{nameMsg.text}</p>
          )}
          <button
            type="submit"
            disabled={savingName || !name.trim() || name.trim() === user?.name}
            className="px-5 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {savingName ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>

      {/* Contraseña */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Cambiar contraseña</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5">Contraseña actual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5">Nueva contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
            {newPassword && (
              <div className="mt-2 space-y-1">
                <Check ok={newPassword.length >= 6} text="Mínimo 6 caracteres" />
                <Check ok={/[A-Z]/.test(newPassword)} text="Una mayúscula" />
                <Check ok={/[0-9]/.test(newPassword)} text="Un número" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5">Confirmar nueva contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>
          {pwdMsg && (
            <p className={`text-xs ${pwdMsg.ok ? "text-[var(--primary)]" : "text-red-400"}`}>{pwdMsg.text}</p>
          )}
          <button
            type="submit"
            disabled={savingPwd || !currentPassword || !newPassword || !confirmPassword}
            className="px-5 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {savingPwd ? "Actualizando..." : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}

function Check({ ok, text }: { ok: boolean; text: string }) {
  return (
    <p className={`text-xs flex items-center gap-1.5 ${ok ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}>
      <span>{ok ? "✓" : "○"}</span> {text}
    </p>
  );
}
