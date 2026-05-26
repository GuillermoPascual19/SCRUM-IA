"use client";

import Link from "next/link";
import { DEMO_SPRINTS } from "../../../data";

const statusStyle: Record<string, string> = {
  completado: "bg-green-500/20 text-green-400 border-green-500/30",
  activo: "bg-[var(--primary)]/20 text-[var(--primary)] border-[var(--primary)]/30",
  planificado: "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]",
};

const statusLabel: Record<string, string> = {
  completado: "Completado",
  activo: "Activo",
  planificado: "Planificado",
};

export default function DemoSprintsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Sprints</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Sprints del TFG</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">{DEMO_SPRINTS.length} sprints Â· 1 activo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        {[
          { label: "Total sprints", value: DEMO_SPRINTS.length },
          { label: "Completados", value: DEMO_SPRINTS.filter(s => s.status === "completado").length },
          { label: "Planificados", value: DEMO_SPRINTS.filter(s => s.status === "planificado").length },
        ].map(m => (
          <div key={m.label} className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">{m.label}</p>
            <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {DEMO_SPRINTS.map((sprint) => (
          <Link key={sprint.id} href={sprint.id === 1 ? "/demo-student/tfgs/1/sprints/1" : "#"}
            className="block bg-[var(--card)] rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-base font-semibold text-[var(--foreground)]">{sprint.name}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyle[sprint.status]}`}>
                    {statusLabel[sprint.status]}
                  </span>
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">{sprint.goal}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                  <span>ðŸ“… {sprint.startDate} â†’ {sprint.endDate}</span>
                  <span>{sprint.done}/{sprint.tasks} tareas</span>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-2xl font-bold text-[var(--foreground)]">{sprint.tasks > 0 ? Math.round((sprint.done / sprint.tasks) * 100) : 0}%</p>
                <p className="text-xs text-[var(--muted-foreground)]">completado</p>
              </div>
            </div>
            {sprint.tasks > 0 && (
              <div className="mt-4 w-full bg-[var(--border)] rounded-full h-1.5">
                <div className="bg-[var(--primary)] h-1.5 rounded-full transition-all" style={{ width: `${(sprint.done / sprint.tasks) * 100}%` }} />
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

