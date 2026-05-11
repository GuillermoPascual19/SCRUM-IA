"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Sprint } from "@/lib/types";
import { useAuthStore } from "@/store/auth.store";

function isProfessor(role?: string) {
  return role === "profesor" || role === "coordinador" || role === "admin";
}

export default function SprintsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", goal: "", startDate: "", endDate: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSprints();
  }, [id]);

  async function fetchSprints() {
    try {
      const { data } = await api.get(`/tfgs/${id}/sprints`);
      setSprints(data);
    } catch {
      console.error("Error al cargar sprints");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/tfgs/${id}/sprints`, {
        name: form.name,
        goal: form.goal || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      });
      setForm({ name: "", goal: "", startDate: "", endDate: "" });
      setShowForm(false);
      fetchSprints();
    } catch {
      console.error("Error al crear sprint");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full text-[var(--muted-foreground)]">
      Cargando...
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">
            Sprints
          </p>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Gestión de Sprints</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            {sprints.length} sprints · {sprints.filter((s) => s.status === "activo").length} activos
          </p>
        </div>
        {isProfessor(user?.role) && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90"
          >
            + Nuevo sprint
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: sprints.length },
          { label: "Planificados", value: sprints.filter((s) => s.status === "planificado").length },
          { label: "Activos", value: sprints.filter((s) => s.status === "activo").length },
          { label: "Completados", value: sprints.filter((s) => s.status === "completado").length },
        ].map((stat) => (
          <div key={stat.label} className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">{stat.label}</p>
            <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--primary)]">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Nuevo sprint</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  placeholder="Nombre del sprint"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  value={form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value })}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  placeholder="Objetivo del sprint"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--muted-foreground)] mb-1">Fecha inicio</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--muted-foreground)] mb-1">Fecha fin</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {saving ? "Guardando..." : "Crear sprint"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)]">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {sprints.length === 0 ? (
        <div className="text-center py-16 bg-[var(--card)] rounded-xl border border-[var(--border)]">
          <p className="text-[var(--muted-foreground)]">No hay sprints creados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sprints.map((sprint) => (
            <div
              key={sprint.id}
              className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--primary)] transition-colors cursor-pointer"
              onClick={() => router.push(`/tfgs/${id}/sprints/${sprint.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    sprint.status === "activo" ? "bg-green-500" :
                    sprint.status === "completado" ? "bg-gray-400" : "bg-yellow-500"
                  }`} />
                  <h3 className="font-semibold text-[var(--foreground)]">{sprint.name}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    sprint.status === "activo"
                      ? "bg-green-500/20 text-green-400"
                      : sprint.status === "completado"
                      ? "bg-gray-500/20 text-gray-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {sprint.status}
                  </span>
                  <span className="text-xs text-[var(--primary)] font-medium">Ver tablero →</span>
                </div>
              </div>
              {sprint.goal && (
                <p className="text-sm text-[var(--muted-foreground)] mt-2">{sprint.goal}</p>
              )}
              <div className="flex items-center gap-4 mt-3">
                <span className="text-xs text-[var(--muted-foreground)]">
                  Inicio: {sprint.startDate ? new Date(sprint.startDate).toLocaleDateString("es-ES") : "—"}
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  Fin: {sprint.endDate ? new Date(sprint.endDate).toLocaleDateString("es-ES") : "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
