"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";

interface Commit {
  id: number;
  hash: string;
  message: string | null;
  date: string;
  linesAdded: number;
  linesDeleted: number;
  filesChanged: number;
  student: { id: number; name: string; email: string } | null;
  sprint: { id: number; name: string } | null;
  task: { id: number; title: string } | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CommitsPage() {
  const { id } = useParams();
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [authorFilter, setAuthorFilter] = useState("todos");
  const [sprintFilter, setSprintFilter] = useState("todos");

  useEffect(() => {
    api.get(`/tfgs/${id}/github/commits`)
      .then(({ data }) => setCommits(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const authors = Array.from(
    new Map(commits.filter(c => c.student).map(c => [c.student!.id, c.student!])).values()
  );
  const sprints = Array.from(
    new Map(commits.filter(c => c.sprint).map(c => [c.sprint!.id, c.sprint!])).values()
  );

  const filtered = commits.filter((c) => {
    const matchSearch = !search ||
      c.message?.toLowerCase().includes(search.toLowerCase()) ||
      c.hash.toLowerCase().includes(search.toLowerCase()) ||
      c.student?.name.toLowerCase().includes(search.toLowerCase());
    const matchAuthor = authorFilter === "todos" || String(c.student?.id) === authorFilter;
    const matchSprint = sprintFilter === "todos" || String(c.sprint?.id) === sprintFilter;
    return matchSearch && matchAuthor && matchSprint;
  });

  const totalAdded = filtered.reduce((acc, c) => acc + c.linesAdded, 0);
  const totalDeleted = filtered.reduce((acc, c) => acc + c.linesDeleted, 0);
  const totalFiles = filtered.reduce((acc, c) => acc + c.filesChanged, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Repositorio</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Historial de commits</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Actividad de desarrollo sincronizada desde GitHub.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Commits", value: filtered.length },
          { label: "Líneas añadidas", value: `+${totalAdded.toLocaleString()}`, color: "text-green-400" },
          { label: "Líneas eliminadas", value: `-${totalDeleted.toLocaleString()}`, color: "text-red-400" },
          { label: "Ficheros cambiados", value: totalFiles.toLocaleString() },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color ?? "text-[var(--foreground)]"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] text-sm">⌕</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por mensaje, hash o autor..."
            className="w-full pl-8 pr-4 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        </div>
        <select
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          className="px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        >
          <option value="todos">Todos los autores</option>
          {authors.map((a) => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
        </select>
        <select
          value={sprintFilter}
          onChange={(e) => setSprintFilter(e.target.value)}
          className="px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        >
          <option value="todos">Todos los sprints</option>
          {sprints.map((s) => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
        </select>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-10 text-[var(--muted-foreground)]">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-[var(--card)] rounded-xl border border-[var(--border)]">
          <p className="text-[var(--muted-foreground)] text-sm">
            {commits.length === 0
              ? "No hay commits sincronizados. Sincroniza el repositorio GitHub desde el resumen del TFG."
              : "No se encontraron commits con esos filtros."}
          </p>
        </div>
      ) : (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="divide-y divide-[var(--border)]">
            {filtered.map((c) => (
              <div key={c.id} className="flex items-start gap-4 px-5 py-4 hover:bg-[var(--accent)]/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold shrink-0 mt-0.5">
                  {c.student?.name.charAt(0).toUpperCase() ?? "?"}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)] leading-snug">
                    {c.message ?? <span className="italic text-[var(--muted-foreground)]">Sin mensaje</span>}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    <span className="text-xs font-mono text-[var(--muted-foreground)] bg-[var(--accent)] px-1.5 py-0.5 rounded">
                      {c.hash.slice(0, 7)}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {c.student?.name ?? "Desconocido"}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {formatDate(c.date)}
                    </span>
                    {c.sprint && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]">
                        {c.sprint.name}
                      </span>
                    )}
                    {c.task && (
                      <span className="text-xs text-[var(--primary)]/70 truncate max-w-[160px]" title={c.task.title}>
                        ↳ {c.task.title}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                  <span className="text-green-400">+{c.linesAdded}</span>
                  <span className="text-red-400">-{c.linesDeleted}</span>
                  <span className="text-[var(--muted-foreground)]">{c.filesChanged}f</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
