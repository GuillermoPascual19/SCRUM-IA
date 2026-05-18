"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

interface Evaluation {
  id: number;
  commitsScore: string | null;
  tasksScore: string | null;
  finalScore: string | null;
  comments: string | null;
  strengths: string | null;
  improvements: string | null;
  weight: number | null;
  aiGenerated: boolean;
  reviewedByProfessor: boolean;
  createdAt: string;
  sprintId: number;
  studentId: number;
  student: { id: number; name: string; email: string };
  sprint: { id: number; name: string };
  professor: { id: number; name: string };
}

function isProfessor(role?: string) {
  return role === "profesor" || role === "coordinador" || role === "admin";
}

export default function GradesPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const router = useRouter();

  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [sprints, setSprints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selected, setSelected] = useState<Evaluation | null>(null);
  const [editScore, setEditScore] = useState("");
  const [editComments, setEditComments] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ sprintId: "", studentId: "" });

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    try {
      const [evRes, memRes, spRes] = await Promise.all([
        api.get(`/tfgs/${id}/evaluations`),
        api.get(`/tfgs/${id}/members`),
        api.get(`/tfgs/${id}/sprints`),
      ]);
      setEvaluations(evRes.data);
      setMembers(memRes.data);
      setSprints(spRes.data);
    } catch {
      console.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);
    try {
      await api.post(`/tfgs/${id}/evaluations/generate`, {
        sprintId: Number(form.sprintId),
        studentId: Number(form.studentId),
      });
      fetchData();
      setForm({ sprintId: "", studentId: "" });
    } catch {
      console.error("Error al generar evaluación");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSaveReview() {
    if (!selected) return;
    setSaving(true);
    try {
      await api.put(`/tfgs/${id}/evaluations/${selected.id}`, {
        finalScore: parseFloat(editScore),
        comments: editComments,
      });
      setSelected(null);
      fetchData();
    } catch {
      console.error("Error al guardar revisión");
    } finally {
      setSaving(false);
    }
  }

  function openReview(ev: Evaluation) {
    setSelected(ev);
    setEditScore(ev.finalScore || "");
    setEditComments(ev.comments || "");
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
            Evaluación IA
          </p>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Notas y evaluaciones</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Evaluaciones generadas por IA y revisadas por el profesor
          </p>
        </div>
      </div>

      {isProfessor(user?.role) && (
        <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--primary)]">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">
            ✦ Generar nueva evaluación con IA
          </h2>
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-3">
            <select
              required
              value={form.sprintId}
              onChange={(e) => setForm({ ...form, sprintId: e.target.value })}
              className="flex-1 border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              <option value="">Selecciona un sprint</option>
              {sprints.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <select
              required
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              className="flex-1 border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              <option value="">Selecciona un estudiante</option>
              {members.map((m) => (
                <option key={m.userId} value={m.userId}>{m.user.name}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={generating}
              className="px-6 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            >
              {generating ? (
                <>
                  <span className="animate-spin">⟳</span> Generando...
                </>
              ) : "✦ Generar"}
            </button>
          </form>
        </div>
      )}

      {evaluations.length === 0 ? (
        <div className="text-center py-16 bg-[var(--card)] rounded-xl border border-[var(--border)]">
          <p className="text-[var(--muted-foreground)]">No hay evaluaciones generadas</p>
          {isProfessor(user?.role) && (
            <p className="text-xs text-[var(--muted-foreground)] mt-2">
              Usa el formulario de arriba para generar la primera evaluación
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {evaluations.map((ev) => (
            <div key={ev.id} className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold">
                      {ev.student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{ev.student.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{ev.sprint.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {ev.aiGenerated && (
                    <span className="text-xs px-2 py-1 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]">
                      ✦ IA
                    </span>
                  )}
                  {ev.reviewedByProfessor && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                      ✓ Revisado
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                  <p className="text-xs text-[var(--muted-foreground)] mb-1">Commits</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{ev.commitsScore ?? "—"}</p>
                </div>
                <div className="text-center p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                  <p className="text-xs text-[var(--muted-foreground)] mb-1">Tareas</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{ev.tasksScore ?? "—"}</p>
                </div>
                <div className="text-center p-3 bg-[var(--primary)]/10 rounded-lg border border-[var(--primary)]/30">
                  <p className="text-xs text-[var(--primary)] mb-1">Nota final</p>
                  <p className="text-2xl font-bold text-[var(--primary)]">{ev.finalScore ?? "—"}</p>
                </div>
              </div>

              {ev.comments && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-2">Feedback</p>
                  <p className="text-sm text-[var(--foreground)] leading-relaxed">{ev.comments}</p>
                </div>
              )}

              {ev.strengths && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs font-medium text-green-400 uppercase tracking-wide mb-2">Puntos fuertes</p>
                    <ul className="space-y-1">
                      {JSON.parse(ev.strengths).map((s: string, i: number) => (
                        <li key={i} className="text-xs text-[var(--foreground)] flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {ev.improvements && (
                    <div>
                      <p className="text-xs font-medium text-yellow-400 uppercase tracking-wide mb-2">A mejorar</p>
                      <ul className="space-y-1">
                        {JSON.parse(ev.improvements).map((s: string, i: number) => (
                          <li key={i} className="text-xs text-[var(--foreground)] flex items-start gap-2">
                            <span className="text-yellow-400 mt-0.5">→</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {isProfessor(user?.role) && (
                <div className="pt-3 border-t border-[var(--border)]">
                  <button
                    onClick={() => openReview(ev)}
                    className="text-sm text-[var(--primary)] hover:underline font-medium"
                  >
                    ✎ Revisar y ajustar nota
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] rounded-xl p-6 w-full max-w-md border border-[var(--border)] space-y-4">
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Revisar evaluación — {selected.student.name}
            </h2>
            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
                Nota final (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={editScore}
                onChange={(e) => setEditScore(e.target.value)}
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
                Comentarios
              </label>
              <textarea
                rows={4}
                value={editComments}
                onChange={(e) => setEditComments(e.target.value)}
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveReview}
                disabled={saving}
                className="flex-1 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar revisión"}
              </button>
              <button
                onClick={() => setSelected(null)}
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