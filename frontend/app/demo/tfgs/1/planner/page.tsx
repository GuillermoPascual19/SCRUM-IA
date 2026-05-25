"use client";

import { DEMO_TASKS } from "../../../data";

export default function DemoPlannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Planificación</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Tablero Kanban</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Sprint 2 · Sistema de evaluación y dashboard analítico</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        {[
          { label: "Por hacer", key: "to_do" as const, dot: "bg-[var(--muted-foreground)]" },
          { label: "En progreso", key: "in_progress" as const, dot: "bg-yellow-400" },
          { label: "Hecho", key: "done" as const, dot: "bg-green-400" },
        ].map(col => (
          <div key={col.key} className="flex flex-col bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <h3 className="text-sm font-semibold text-[var(--foreground)]">{col.label}</h3>
              </div>
              <span className="text-xs bg-[var(--accent)] text-[var(--accent-foreground)] px-2 py-0.5 rounded-full font-medium">{DEMO_TASKS[col.key].length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {DEMO_TASKS[col.key].map(task => (
                <div key={task.id} className="bg-[var(--background)] rounded-lg border border-[var(--border)] p-3 hover:border-[var(--primary)]/50 transition-colors cursor-default">
                  <p className="text-sm font-medium text-[var(--foreground)] leading-snug">{task.title}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold">
                        {task.assignee.charAt(0)}
                      </div>
                      <span className="text-xs text-[var(--muted-foreground)]">{task.assignee.split(" ")[0]}</span>
                    </div>
                    <span className="text-xs text-[var(--muted-foreground)] bg-[var(--accent)] px-2 py-0.5 rounded">{task.estimatedHours}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
