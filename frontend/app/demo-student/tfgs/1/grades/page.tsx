"use client";

import { DEMO_EVALUATIONS } from "../../../data";

export default function DemoGradesPage() {
  const ev = DEMO_EVALUATIONS[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Evaluación IA</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Mis evaluaciones</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Notas generadas por IA y revisadas por el profesor.</p>
      </div>

      {/* Tabla de evaluaciones */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Evaluaciones por sprint</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                <th className="text-left px-5 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Sprint</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Commits</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Tareas</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Nota final</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--border)] hover:bg-[var(--accent)]/30 transition-colors">
                <td className="px-5 py-3 font-medium text-[var(--foreground)]">{ev.sprint}</td>
                <td className="px-4 py-3 text-center text-[var(--foreground)]">{ev.commitsScore}</td>
                <td className="px-4 py-3 text-center text-[var(--foreground)]">{ev.tasksScore}</td>
                <td className="px-4 py-3 text-center">
                  <span className="font-bold text-[var(--primary)]">{ev.finalScore}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Revisado</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Detalle de la evaluación */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--primary)]/30 p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
              <span className="text-[var(--primary)]">✓</span> Evaluación IA — {ev.sprint}
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Generada por IA · Revisada por el profesor</p>
          </div>
          <span className="text-3xl font-bold text-[var(--primary)]">{ev.finalScore}<span className="text-base font-normal text-[var(--muted-foreground)]">/10</span></span>
        </div>

        <div>
          <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-2">Comentario general</p>
          <p className="text-sm text-[var(--foreground)] leading-relaxed">{ev.comments}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
            <p className="text-xs font-medium text-green-400 uppercase tracking-wide mb-2">Puntos fuertes</p>
            <ul className="space-y-1.5">
              {ev.strengths.map((s, i) => (
                <li key={i} className="text-sm text-[var(--foreground)] flex gap-2">
                  <span className="text-green-400 shrink-0">✓</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-xs font-medium text-yellow-400 uppercase tracking-wide mb-2">Áreas de mejora</p>
            <ul className="space-y-1.5">
              {ev.improvements.map((s, i) => (
                <li key={i} className="text-sm text-[var(--foreground)] flex gap-2">
                  <span className="text-yellow-400 shrink-0">▲</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--background)] rounded-lg p-3 border border-[var(--border)]">
            <p className="text-xs text-[var(--muted-foreground)]">Nota commits</p>
            <p className="text-xl font-bold text-[var(--foreground)] mt-1">{ev.commitsScore}<span className="text-xs text-[var(--muted-foreground)]">/10</span></p>
          </div>
          <div className="bg-[var(--background)] rounded-lg p-3 border border-[var(--border)]">
            <p className="text-xs text-[var(--muted-foreground)]">Nota tareas</p>
            <p className="text-xl font-bold text-[var(--foreground)] mt-1">{ev.tasksScore}<span className="text-xs text-[var(--muted-foreground)]">/10</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

