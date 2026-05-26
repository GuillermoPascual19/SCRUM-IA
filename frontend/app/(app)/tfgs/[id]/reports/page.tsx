"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

interface Evaluation {
  id: number;
  finalScore: string | null;
  commitsScore: string | null;
  tasksScore: string | null;
  aiGenerated: boolean;
  reviewedByProfessor: boolean;
  student: { id: number; name: string };
  sprint: { id: number; name: string };
}

interface FinalGrade {
  id: number;
  finalScore: string | null;
  sprintsAverage: string | null;
  student: { id: number; name: string };
}

interface TfgReport {
  id: number;
  content: string;
  customPrompt: string | null;
  createdAt: string;
  professor: { id: number; name: string };
}

function isProfessor(role?: string) {
  return role === "teacher" || role === "coordinator" || role === "admin";
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

function ReportContent({ content }: { content: string }) {
  return (
    <div className="space-y-1">
      {content.split("\n").map((line, i) => {
        if (line.startsWith("## ") || line.startsWith("# ")) {
          return (
            <p key={i} className="font-semibold text-[var(--foreground)] mt-4 mb-1">
              {line.replace(/^#+\s/, "")}
            </p>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <p key={i} className="text-sm text-[var(--muted-foreground)] pl-3 before:content-['·'] before:mr-2">
              {line.slice(2)}
            </p>
          );
        }
        if (line.trim() === "") return <div key={i} className="h-2" />;
        return (
          <p key={i} className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}

export default function InformesPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [finalGrades, setFinalGrades] = useState<FinalGrade[]>([]);
  const [reports, setReports] = useState<TfgReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [activeReport, setActiveReport] = useState<TfgReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [evRes, fgRes, rpRes] = await Promise.all([
          api.get(`/tfgs/${id}/evaluations`),
          api.get(`/tfgs/${id}/evaluations/final`),
          api.get(`/tfgs/${id}/evaluations/reports`),
        ]);
        setEvaluations(evRes.data);
        setFinalGrades(fgRes.data);
        setReports(rpRes.data);
        if (rpRes.data.length > 0) setActiveReport(rpRes.data[0]);
      } catch {
        console.error("Error cargando datos");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  async function handleDeleteReport(reportId: number) {
    setDeletingId(reportId);
    try {
      await api.delete(`/tfgs/${id}/evaluations/reports/${reportId}`);
      setReports((prev) => {
        const next = prev.filter((r) => r.id !== reportId);
        if (activeReport?.id === reportId) setActiveReport(next[0] ?? null);
        return next;
      });
    } catch {
      setError("Error al eliminar el informe.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleGenerateSummary() {
    setGenerating(true);
    setError(null);
    try {
      const { data } = await api.post(`/tfgs/${id}/evaluations/tfg-summary`, {
        prompt: prompt.trim() || undefined,
      });
      setReports((prev) => [data, ...prev]);
      setActiveReport(data);
      setPrompt("");
    } catch {
      setError("Error al generar el informe. Inténtalo de nuevo.");
    } finally {
      setGenerating(false);
    }
  }

  if (!isProfessor(user?.role)) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[var(--muted-foreground)]">No tienes acceso a esta sección.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--muted-foreground)]">
        Cargando...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Informes IA</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Informe global del TFG</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Genera y consulta el historial de informes ejecutivos del proyecto.
        </p>
      </div>

      {/* Tabla resumen de evaluaciones */}
      {evaluations.length > 0 ? (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Resumen de evaluaciones por sprint</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                  <th className="text-left px-5 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Estudiante</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Sprint</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Commits</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Tareas</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Nota sprint</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Estado</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((ev) => (
                  <tr key={ev.id} className="border-b border-[var(--border)] hover:bg-[var(--accent)]/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-[var(--foreground)]">{ev.student.name}</td>
                    <td className="px-5 py-3 text-[var(--muted-foreground)]">{ev.sprint.name}</td>
                    <td className="px-4 py-3 text-center text-[var(--foreground)]">{ev.commitsScore ?? "—"}</td>
                    <td className="px-4 py-3 text-center text-[var(--foreground)]">{ev.tasksScore ?? "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold ${parseFloat(ev.finalScore ?? "0") >= 5 ? "text-[var(--primary)]" : "text-red-400"}`}>
                        {ev.finalScore ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {ev.reviewedByProfessor ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Revisado</span>
                      ) : ev.aiGenerated ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]">✦ IA</span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-[var(--border)] text-[var(--muted-foreground)]">Pendiente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-[var(--card)] rounded-xl border border-[var(--border)]">
          <p className="text-[var(--muted-foreground)] text-sm">
            No hay evaluaciones generadas aún. Ve a <strong>Notas</strong> para generarlas.
          </p>
        </div>
      )}

      {/* Notas finales */}
      {finalGrades.length > 0 && (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Notas finales del TFG</h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {finalGrades.map((fg) => (
              <div key={fg.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{fg.student.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Media sprints: {fg.sprintsAverage ?? "—"}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[var(--primary)]">{fg.finalScore ?? "—"}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">/ 10</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generador */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--primary)]/30 p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
            <span className="text-[var(--primary)]">✦</span> Generar informe global con IA
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Claude analizará todas las evaluaciones y producirá un informe ejecutivo que quedará guardado en el historial.
          </p>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="Instrucción adicional (opcional) — ej: 'Enfócate en la evolución del equipo a lo largo de los sprints'"
          className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] resize-none"
        />
        <div className="flex items-center gap-4">
          <button
            onClick={handleGenerateSummary}
            disabled={generating || evaluations.length === 0}
            className="px-6 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-opacity"
          >
            {generating ? (
              <><span className="animate-spin inline-block">⟳</span> Generando informe...</>
            ) : (
              <><span>✦</span> Generar informe global</>
            )}
          </button>
          {evaluations.length === 0 && (
            <p className="text-xs text-[var(--muted-foreground)]">Necesitas al menos una evaluación para generar el informe.</p>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

      {/* Historial + Lector */}
      {reports.length > 0 && (
        <div className="grid grid-cols-[260px_1fr] gap-4 items-start">
          {/* Historial */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider px-1 mb-3">
              Historial ({reports.length})
            </p>
            {reports.map((r) => (
              <div
                key={r.id}
                className={`relative group rounded-lg border transition-colors ${
                  activeReport?.id === r.id
                    ? "border-[var(--primary)] bg-[var(--primary)]/10"
                    : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--accent)]/30"
                }`}
              >
                <button
                  onClick={() => setActiveReport(r)}
                  className="w-full text-left p-3"
                >
                  <p className="text-xs font-medium text-[var(--foreground)]">{formatDate(r.createdAt)}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{r.professor.name}</p>
                  {r.customPrompt && (
                    <p className="text-xs text-[var(--primary)]/70 mt-1 truncate italic">"{r.customPrompt}"</p>
                  )}
                  <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2 leading-relaxed opacity-70">
                    {r.content.slice(0, 90)}…
                  </p>
                </button>
                <button
                  onClick={() => handleDeleteReport(r.id)}
                  disabled={deletingId === r.id}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-[var(--muted-foreground)] hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30"
                  title="Eliminar informe"
                >
                  {deletingId === r.id ? "…" : "✕"}
                </button>
              </div>
            ))}
          </div>

          {/* Lector */}
          {activeReport && (
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-5 gap-4">
                <div>
                  <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">Informe seleccionado</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    {formatDate(activeReport.createdAt)} · generado por {activeReport.professor.name}
                  </p>
                  {activeReport.customPrompt && (
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5 italic">
                      Prompt: "{activeReport.customPrompt}"
                    </p>
                  )}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(activeReport.content)}
                  className="text-xs px-3 py-1.5 rounded-md border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]/30 transition-colors shrink-0"
                >
                  Copiar
                </button>
              </div>
              <ReportContent content={activeReport.content} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
