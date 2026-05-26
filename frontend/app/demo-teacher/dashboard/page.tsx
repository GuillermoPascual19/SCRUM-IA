"use client";

import Link from "next/link";
import { DEMO_TFGS, DEMO_COMMITS, DEMO_EVALUATIONS } from "../data";

const statusColors: Record<string, string> = {
  activo: "bg-green-500",
  revision: "bg-yellow-500",
  completado: "bg-gray-400",
};
const statusLabels: Record<string, string> = {
  activo: "Activo",
  revision: "En revisión",
  completado: "Cerrado",
};

export default function DemoTeacherDashboard() {
  const pendingEvals = DEMO_EVALUATIONS.filter(e => e.status === "ia").length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Panel docente</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Resumen de tus TFGs y actividad reciente.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "TFGs tutorizados", value: DEMO_TFGS.length },
          { label: "Activos", value: DEMO_TFGS.filter(t => t.status === "activo").length },
          { label: "Evaluaciones pendientes", value: pendingEvals },
          { label: "Commits recientes", value: DEMO_COMMITS.length },
        ].map(s => (
          <div key={s.label} className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* TFGs */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">Mis TFGs</h2>
        {DEMO_TFGS.map(tfg => (
          <Link key={tfg.id} href={`/demo-teacher/tfgs/${tfg.id}`}
            className="block bg-[var(--card)] rounded-xl border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${statusColors[tfg.status]}`} />
                <span className="text-xs text-[var(--muted-foreground)]">{statusLabels[tfg.status]}</span>
              </div>
              <span className="text-xs text-[var(--muted-foreground)]">{tfg.academicYear}</span>
            </div>
            <h3 className="text-base font-bold text-[var(--foreground)] mb-1">{tfg.title}</h3>
            <p className="text-xs text-[var(--muted-foreground)] mb-3 line-clamp-1">{tfg.description}</p>
            <div className="w-full bg-[var(--border)] rounded-full h-1.5 mb-2">
              <div className="bg-[var(--primary)] h-1.5 rounded-full transition-all" style={{ width: `${tfg.progress}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--muted-foreground)]">{tfg.members.length} estudiantes</span>
              <span className="text-xs text-[var(--primary)] font-medium">{tfg.progress}% completado</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Actividad reciente */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Commits recientes — EcoTrack</h2>
        <div className="space-y-3">
          {DEMO_COMMITS.slice(0, 4).map(c => (
            <div key={c.hash} className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0">
              <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold shrink-0">
                {c.author.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--foreground)] truncate">{c.message}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{c.author} · {c.date}</p>
              </div>
              <div className="text-xs shrink-0 flex gap-2">
                <span className="text-green-400">+{c.linesAdded}</span>
                <span className="text-red-400">-{c.linesDeleted}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
