"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const ROLES = ["student", "teacher", "coordinator", "admin"];

const roleLabels: Record<string, string> = {
  student: "Estudiante",
  teacher: "Profesor",
  coordinator: "Coordinador",
  admin: "Admin",
};

const roleColors: Record<string, string> = {
  student: "bg-blue-500/20 text-blue-400",
  teacher: "bg-green-500/20 text-green-400",
  coordinator: "bg-yellow-500/20 text-yellow-400",
  admin: "bg-red-500/20 text-red-400",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminPage() {
  const router = useRouter();
  const { user: me } = useAuthStore();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [updating, setUpdating] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (me && me.role !== "admin") router.replace("/dashboard");
  }, [me, router]);

  async function fetchUsers() {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch {
      console.error("Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await fetchUsers();
    })();
  }, []);

  async function handleRoleChange(userId: number, role: string) {
    setUpdating(userId);
    try {
      const { data } = await api.patch(`/admin/users/${userId}`, { role });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: data.role } : u));
    } catch {
      console.error("Error actualizando rol");
    } finally {
      setUpdating(null);
    }
  }

  async function handleToggleActive(userId: number, isActive: boolean) {
    setUpdating(userId);
    try {
      const { data } = await api.patch(`/admin/users/${userId}`, { isActive: !isActive });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: data.isActive } : u));
    } catch {
      console.error("Error actualizando estado");
    } finally {
      setUpdating(null);
    }
  }

  async function handleDelete(userId: number) {
    setDeleting(userId);
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setConfirmDelete(null);
    } catch {
      console.error("Error eliminando usuario");
    } finally {
      setDeleting(null);
    }
  }

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "todos" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    students: users.filter(u => u.role === "student").length,
    teachers: users.filter(u => u.role === "teacher").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Administración</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Panel de administración</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Gestiona los usuarios de la plataforma.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total usuarios", value: stats.total },
          { label: "Activos", value: stats.active },
          { label: "Estudiantes", value: stats.students },
          { label: "Profesores", value: stats.teachers },
        ].map(s => (
          <div key={s.label} className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] text-sm">⌕</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full pl-8 pr-4 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        </div>
        <div className="flex gap-2">
          {["todos", ...ROLES].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${roleFilter === r ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)]"}`}>
              {r === "todos" ? "Todos" : roleLabels[r]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[var(--muted-foreground)]">Cargando...</div>
      ) : (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)]">
            <p className="text-sm font-semibold text-[var(--foreground)]">{filtered.length} usuario{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                  <th className="text-left px-5 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Usuario</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Rol</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Registro</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map(u => (
                  <tr key={u.id} className={`transition-colors ${updating === u.id ? "opacity-50" : "hover:bg-[var(--accent)]/30"}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--foreground)]">{u.name} {u.id === me?.id && <span className="text-xs text-[var(--muted-foreground)]">(tú)</span>}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        disabled={u.id === me?.id || updating === u.id}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--ring)] ${roleColors[u.role] ?? "bg-[var(--accent)] text-[var(--foreground)]"} disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {ROLES.map(r => <option key={r} value={r}>{roleLabels[r]}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        disabled={u.id === me?.id || updating === u.id}
                        onClick={() => handleToggleActive(u.id, u.isActive)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${u.isActive ? "bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400" : "bg-red-500/20 text-red-400 hover:bg-green-500/20 hover:text-green-400"}`}
                      >
                        {u.isActive ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        disabled={u.id === me?.id || deleting === u.id}
                        onClick={() => setConfirmDelete(u)}
                        className="text-xs px-2.5 py-1 rounded-md text-[var(--muted-foreground)] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal confirmación eliminar */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] rounded-xl p-6 w-full max-w-sm border border-[var(--border)] space-y-4">
            <h2 className="text-base font-semibold text-[var(--foreground)]">Eliminar usuario</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              ¿Seguro que quieres eliminar a <strong className="text-[var(--foreground)]">{confirmDelete.name}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                disabled={deleting === confirmDelete.id}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {deleting === confirmDelete.id ? "Eliminando..." : "Sí, eliminar"}
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
