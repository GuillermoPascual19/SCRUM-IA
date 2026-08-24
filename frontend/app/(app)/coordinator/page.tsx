"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Tfg } from "@/lib/types";
import { useAuthStore } from "@/store/auth.store";

const statusColors: Record<string, string> = {
  activo: "bg-green-500",
  completado: "bg-gray-400",
  archivado: "bg-gray-600",
  revision: "bg-yellow-500",
};

const statusLabels: Record<string, string> = {
  activo: "Activo",
  completado: "Cerrado",
  archivado: "Archivado",
  revision: "Revisión",
};

export default function CoordinatorPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [tfgs, setTfgs] = useState<Tfg[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tutorFilter, setTutorFilter] = useState("todos");

  useEffect(() => {
    if (user && user.role !== "coordinator" && user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  async function fetchAll() {
    try {
      const { data } = await api.get("/tfgs");
      setTfgs(data);
    } catch {
      console.error("Error al cargar TFGs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await fetchAll();
    })();
  }, []);

  const tutorMap = new Map<number, { id: number; name: string; email: string }>();
  tfgs.forEach((t) => { if (t.tutor?.id != null) tutorMap.set(t.tutor.id, t.tutor as { id: number; name: string; email: string }); });
  const tutors = Array.from(tutorMap.values());

  const filtered = tfgs.filter((t) => {
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.tutor?.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || t.status === statusFilter;
    const matchTutor = tutorFilter === "todos" || String(t.tutor?.id) === tutorFilter;
    return matchSearch && matchStatus && matchTutor;
  });

  const stats = {
    total: tfgs.length,
    activos: tfgs.filter((t) => t.status === "activo").length,
    revision: tfgs.filter((t) => t.status === "revision").length,
    cerrados: tfgs.filter((t) => t.status === "completado").length,
    tutores: tutors.length,
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Coordinación</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Vista general de proyectos</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Todos los TFGs de la plataforma — {stats.total} proyectos · {stats.tutores} tutores
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total },
          { label: "Activos", value: stats.activos },
          { label: "En revisión", value: stats.revision },
          { label: "Cerrados", value: stats.cerrados },
          { label: "Tutores", value: stats.tutores },
        ].map((s) => (
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, tutor o descripción..."
            className="w-full pl-8 pr-4 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        </div>

        <select
          value={tutorFilter}
          onChange={(e) => setTutorFilter(e.target.value)}
          className="px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        >
          <option value="todos">Todos los tutores</option>
          {tutors.map((t) => (
            <option key={t.id} value={String(t.id)}>{t.name}</option>
          ))}
        </select>

        <div className="flex gap-2">
          {["todos", "activo", "revision", "completado"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === f
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)]"
              }`}
            >
              {f === "todos" ? "Todos" : f === "activo" ? "Activos" : f === "revision" ? "Revisión" : "Cerrados"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[var(--muted-foreground)]">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-[var(--card)] rounded-xl border border-[var(--border)]">
          <p className="text-[var(--muted-foreground)]">No se encontraron proyectos</p>
        </div>
      ) : (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              {filtered.length} proyecto{filtered.length !== 1 ? "s" : ""}
            </h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {filtered.map((tfg) => (
              <div
                key={tfg.id}
                onClick={() => router.push(`/tfgs/${tfg.id}`)}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--accent)]/40 transition-colors cursor-pointer"
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${statusColors[tfg.status] || "bg-gray-400"}`} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--foreground)] truncate">{tfg.title}</p>
                  {tfg.description && (
                    <p className="text-xs text-[var(--muted-foreground)] truncate mt-0.5">{tfg.description}</p>
                  )}
                </div>

                <div className="shrink-0 text-right hidden md:block">
                  <p className="text-xs font-medium text-[var(--foreground)]">{tfg.tutor?.name ?? "—"}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Tutor</p>
                </div>

                <div className="shrink-0 text-center hidden md:block w-20">
                  <p className="text-sm font-bold text-[var(--foreground)]">{tfg.members?.length ?? 0}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Estudiantes</p>
                </div>

                <div className="shrink-0 text-center hidden md:block w-24">
                  <p className="text-xs text-[var(--muted-foreground)]">{tfg.academicYear ?? "—"}</p>
                </div>

                <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
                  tfg.status === "activo" ? "bg-green-500/20 text-green-400" :
                  tfg.status === "revision" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-[var(--accent)] text-[var(--muted-foreground)]"
                }`}>
                  {statusLabels[tfg.status] ?? tfg.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
