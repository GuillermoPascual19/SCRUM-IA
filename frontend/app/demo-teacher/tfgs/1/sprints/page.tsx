"use client";

import { DEMO_SPRINTS } from "../../../data";

const statusColors: Record<string, string> = { completado: "bg-green-500", activo: "bg-yellow-400", planificado: "bg-gray-400" };
const statusLabels: Record<string, string> = { completado: "Completado", activo: "Activo", planificado: "Planificado" };

export default function DemoTeacherSprintsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Sprints</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Sprints del proyecto</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">{DEMO_SPRINTS.length} sprints · 1 activo</p>
      </div>

      <div className="space-y-3">
        {DEMO_SPRINTS.map(sprint => {
          const pct = sprint.tasks > 0 ? Math.round((sprint.done / sprint.tasks) * 100) : 0;
          return (
            <div key={sprint.id} className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${statusColors[sprint.status]}`} />
                    <span className="text-xs text-[var(--muted-foreground)]">{statusLabels[sprint.status]}</span>
                  </div>
                  <h2 className="text-base font-bold text-[var(--foreground)]">{sprint.name}</h2>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{sprint.goal}</p>
                </div>
                <span className="text-sm font-bold text-[var(--primary)]">{pct}%</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] mb-3">
                <span>{sprint.startDate} → {sprint.endDate}</span>
                <span>·</span>
                <span>{sprint.done}/{sprint.tasks} tareas completadas</span>
              </div>
              <div className="w-full bg-[var(--border)] rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${sprint.status === "completado" ? "bg-green-500" : "bg-[var(--primary)]"}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
