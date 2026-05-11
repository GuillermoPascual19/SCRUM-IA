"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { UserStory } from "@/lib/types";
import { useAuthStore } from "@/store/auth.store";

const statusColors: Record<string, string> = {
  backlog: "bg-gray-500",
  en_sprint: "bg-yellow-500",
  completada: "bg-green-500",
};

const statusLabels: Record<string, string> = {
  backlog: "Backlog",
  en_sprint: "En Sprint",
  completada: "Completada",
};

function isProfessor(role?: string) {
  return role === "profesor" || role === "coordinador" || role === "admin";
}

export default function BacklogPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [stories, setStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    acceptanceCriteria: "",
    storyPoints: "",
    priority: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStories();
  }, [id]);

  async function fetchStories() {
    try {
      const { data } = await api.get(`/tfgs/${id}/user-stories`);
      setStories(data);
    } catch {
      console.error("Error al cargar historias");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/tfgs/${id}/user-stories`, {
        title: form.title,
        description: form.description || undefined,
        acceptanceCriteria: form.acceptanceCriteria || undefined,
        storyPoints: form.storyPoints ? parseInt(form.storyPoints) : undefined,
        priority: form.priority ? parseInt(form.priority) : undefined,
      });
      setForm({ title: "", description: "", acceptanceCriteria: "", storyPoints: "", priority: "" });
      setShowForm(false);
      fetchStories();
    } catch {
      console.error("Error al crear historia");
    } finally {
      setSaving(false);
    }
  }

  const totalPoints = stories.reduce((acc, s) => acc + (s.storyPoints || 0), 0);
  const completedPoints = stories
    .filter((s) => s.status === "completada")
    .reduce((acc, s) => acc + (s.storyPoints || 0), 0);

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
            Product Backlog
          </p>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Historias de usuario</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            {stories.length} historias · {completedPoints}/{totalPoints} story points completados
          </p>
        </div>
        {isProfessor(user?.role) && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90"
          >
            + Nueva historia
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stories.length },
          { label: "En Backlog", value: stories.filter((s) => s.status === "backlog").length },
          { label: "En Sprint", value: stories.filter((s) => s.status === "en_sprint").length },
          { label: "Completadas", value: stories.filter((s) => s.status === "completada").length },
        ].map((stat) => (
          <div key={stat.label} className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">{stat.label}</p>
            <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--primary)]">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Nueva historia de usuario</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  placeholder="Como [usuario] quiero [acción] para [beneficio]"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={form.storyPoints}
                  onChange={(e) => setForm({ ...form, storyPoints: e.target.value })}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  placeholder="Story points"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  placeholder="Prioridad (1 = mayor)"
                />
              </div>
              <div className="col-span-2">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  placeholder="Descripción"
                />
              </div>
              <div className="col-span-2">
                <textarea
                  value={form.acceptanceCriteria}
                  onChange={(e) => setForm({ ...form, acceptanceCriteria: e.target.value })}
                  rows={2}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  placeholder="Criterios de aceptación"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {saving ? "Guardando..." : "Crear historia"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)]">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {stories.length === 0 ? (
        <div className="text-center py-16 bg-[var(--card)] rounded-xl border border-[var(--border)]">
          <p className="text-[var(--muted-foreground)]">No hay historias de usuario</p>
        </div>
      ) : (
        <div className="space-y-2">
          {stories
            .sort((a, b) => (a.priority || 99) - (b.priority || 99))
            .map((story) => (
              <div
                key={story.id}
                className="bg-[var(--card)] rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => setExpanded(expanded === story.id ? null : story.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${statusColors[story.status] || "bg-gray-400"}`} />
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">{story.title}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    {story.storyPoints && (
                      <span className="text-xs px-2 py-1 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] font-medium">
                        {story.storyPoints} SP
                      </span>
                    )}
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {statusLabels[story.status] || story.status}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {expanded === story.id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {expanded === story.id && (
                  <div className="px-4 pb-4 space-y-3 border-t border-[var(--border)] pt-3">
                    {story.description && (
                      <div>
                        <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-1">Descripción</p>
                        <p className="text-sm text-[var(--foreground)]">{story.description}</p>
                      </div>
                    )}
                    {story.acceptanceCriteria && (
                      <div>
                        <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-1">Criterios de aceptación</p>
                        <p className="text-sm text-[var(--foreground)]">{story.acceptanceCriteria}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      {story.priority && (
                        <span className="text-xs text-[var(--muted-foreground)]">Prioridad: {story.priority}</span>
                      )}
                      <span className="text-xs text-[var(--muted-foreground)]">
                        Tareas: {story.tasks?.length || 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}