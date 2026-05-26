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

function isProfessor(role?: string) {
  return role === "teacher" || role === "coordinator" || role === "admin";
}

export default function TfgsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [tfgs, setTfgs] = useState<Tfg[]>([]);
  const [filtered, setFiltered] = useState<Tfg[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", academicYear: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showRepoModal, setShowRepoModal] = useState(false);
  const [repoTfgId, setRepoTfgId] = useState<number | null>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [savingRepo, setSavingRepo] = useState(false);

  useEffect(() => { fetchTfgs(); }, []);

  useEffect(() => {
    let result = tfgs;
    if (search) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filter !== "todos") result = result.filter((t) => t.status === filter);
    setFiltered(result);
  }, [search, filter, tfgs]);

  async function fetchTfgs() {
    try {
      const { data } = await api.get("/tfgs/mine");
      setTfgs(data);
      setFiltered(data);
    } catch {
      console.error("Error al cargar TFGs");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/tfgs", form);
      setForm({ title: "", description: "", academicYear: "" });
      setShowForm(false);
      fetchTfgs();
    } catch (e: any) {
      setError(e.response?.data?.error || "Error al crear el TFG");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveRepo(e: React.FormEvent) {
    e.preventDefault();
    if (!repoTfgId) return;
    setSavingRepo(true);
    try {
      await api.put(`/tfgs/${repoTfgId}`, { repositoryUrl: repoUrl });
      setShowRepoModal(false);
      setRepoUrl("");
      setRepoTfgId(null);
      fetchTfgs();
    } catch {
      console.error("Error al vincular repositorio");
    } finally {
      setSavingRepo(false);
    }
  }

  const stats = {
    total: tfgs.length,
    activos: tfgs.filter((t) => t.status === "activo").length,
    revision: tfgs.filter((t) => t.status === "revision").length,
    cerrados: tfgs.filter((t) => t.status === "completado").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Mis Proyectos</p>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            {isProfessor(user?.role) ? "TFGs que tutorizas" : "TFGs vinculados a tu cuenta"}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            {isProfessor(user?.role)
              ? "Gestiona los proyectos de tus estudiantes, genera evaluaciones y revisa el progreso."
              : "Consulta los proyectos en los que participas, tu rol SCRUM y el progreso evaluado por la IA."}
          </p>
        </div>
        <div className="flex gap-2">
          {isProfessor(user?.role) && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition-opacity"
            >
              + Nuevo TFG
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total TFGs", value: stats.total, sub: isProfessor(user?.role) ? "Tutorizados" : "Vinculados a tu perfil" },
          { label: "Activos", value: stats.activos, sub: "Con sprint en curso" },
          { label: "En Revisión", value: stats.revision, sub: "Pendiente de evaluación" },
          { label: "Cerrados", value: stats.cerrados, sub: "Históricos" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
            <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">{stat.label}</p>
            <p className="text-3xl font-bold text-[var(--foreground)] mt-2">{stat.value}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--primary)]">
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-4">Crear nuevo TFG</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Título</label>
                <input type="text" required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  placeholder="Título del proyecto" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Descripción</label>
                <textarea value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  placeholder="Descripción del proyecto" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Curso académico</label>
                <input type="text" value={form.academicYear}
                  onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  placeholder="2024-2025" />
              </div>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={saving}
                className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {saving ? "Guardando..." : "Crear TFG"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)]">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] text-sm">🔍</span>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            placeholder="Buscar por nombre, tutor o repositorio..." />
        </div>
        <div className="flex gap-2">
          {["todos", "activo", "revision", "completado"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)]"
              }`}>
              {f === "todos" ? "Todos" : f === "activo" ? "Activos" : f === "revision" ? "Revisión" : "Cerrados"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[var(--muted-foreground)]">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-[var(--card)] rounded-xl border border-[var(--border)]">
          <p className="text-[var(--muted-foreground)]">No se encontraron TFGs</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((tfg) => (
            <div key={tfg.id}
              className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--primary)] transition-colors cursor-pointer"
              onClick={() => router.push(`/tfgs/${tfg.id}`)}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusColors[tfg.status] || "bg-gray-400"}`} />
                  <span className="text-xs font-medium text-[var(--muted-foreground)]">
                    {statusLabels[tfg.status] || tfg.status}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] font-medium">
                    {isProfessor(user?.role) ? "Tutor" : "Estudiante"}
                  </span>
                </div>
                <span className="text-sm font-bold text-[var(--primary)]">
                  ✦ — <span className="text-xs text-[var(--muted-foreground)] ml-1">NOTA IA</span>
                </span>
              </div>

              <h3 className="text-lg font-bold text-[var(--foreground)] mb-1">{tfg.title}</h3>
              <p className="text-xs text-[var(--muted-foreground)] mb-2">
                {tfg.academicYear} · {isProfessor(user?.role)
                  ? tfg.members && tfg.members.length > 0
                    ? "Estudiantes: " + tfg.members.map((m) => m.user.name).join(", ")
                    : "Sin estudiantes"
                  : `Tutor: ${tfg.tutor?.name || "—"}`}
              </p>

              {tfg.description && (
                <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">{tfg.description}</p>
              )}

              <div className="w-full bg-[var(--border)] rounded-full h-1 mb-3">
                <div className="bg-[var(--primary)] h-1 rounded-full"
                  style={{ width: tfg.status === "completado" ? "100%" : tfg.status === "activo" ? "50%" : "10%" }} />
              </div>

              {isProfessor(user?.role) ? (
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  {[
                    { label: "Estudiantes", value: tfg.members?.length ?? "—" },
                    { label: "Commits", value: "—" },
                    { label: "Entrega", value: "—" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{item.value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 text-center mb-3">
                  {[
                    { label: "Equipo", value: "—" },
                    { label: "Commits", value: "—" },
                    { label: "Entrega", value: "—" },
                    { label: "Rol", value: "—" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                <span className="text-xs text-[var(--muted-foreground)]">
                  {tfg.repositoryUrl
                    ? `⎇ ${tfg.repositoryUrl.replace("https://github.com/", "")}`
                    : "Sin repositorio"}
                </span>
                <div className="flex items-center gap-3">
                  {isProfessor(user?.role) && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRepoTfgId(tfg.id);
                          setRepoUrl(tfg.repositoryUrl || "");
                          setShowRepoModal(true);
                        }}
                        className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-medium transition-colors"
                      >
                        ⎇ {tfg.repositoryUrl ? "Cambiar repo" : "Vincular repo"}
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-[var(--primary)] font-medium hover:underline"
                      >
                        ✦ Evaluar IA
                      </button>
                    </>
                  )}
                  <span className="text-xs text-[var(--primary)] font-medium">Abrir proyecto →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showRepoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] rounded-xl p-6 w-full max-w-md border border-[var(--border)] space-y-4">
            <h2 className="text-base font-semibold text-[var(--foreground)]">Vincular repositorio GitHub</h2>
            <form onSubmit={handleSaveRepo} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
                  URL del repositorio
                </label>
                <input type="url" required value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  placeholder="https://github.com/usuario/repositorio" />
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                ⎇ El repositorio debe ser accesible por la GitHub App instalada.
              </p>
              <div className="flex gap-2">
                <button type="submit" disabled={savingRepo}
                  className="flex-1 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {savingRepo ? "Guardando..." : "Vincular"}
                </button>
                <button type="button" onClick={() => { setShowRepoModal(false); setRepoUrl(""); }}
                  className="flex-1 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)]">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
