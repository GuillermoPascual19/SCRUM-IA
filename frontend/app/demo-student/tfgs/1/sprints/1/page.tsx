"use client";

import Link from "next/link";
import { DEMO_SPRINTS, DEMO_TASKS, DEMO_COMMITS } from "../../../../data";

export default function DemoSprintDetailPage() {
  const sprint = DEMO_SPRINTS[1]; // Sprint 2 (activo)
  const allTasks = [...DEMO_TASKS.to_do, ...DEMO_TASKS.in_progress, ...DEMO_TASKS.done];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Sprint activo</p>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{sprint.name}</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{sprint.goal}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/demo-student/tfgs/1/sprints/1/retrospective"
            className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors">
            Retrospectiva
          </Link>
        </div>
      </div>

      {/* Info sprint */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Inicio", value: sprint.startDate },
          { label: "Fin", value: sprint.endDate },
          { label: "Tareas totales", value: allTasks.length },
          { label: "Completadas", value: DEMO_TASKS.done.length },
        ].map(m => (
          <div key={m.label} className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">{m.label}</p>
            <p className="text-lg font-bold text-[var(--foreground)] mt-1">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Kanban del sprint */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Por hacer", key: "to_do" as const, color: "text-[var(--muted-foreground)]" },
          { label: "En progreso", key: "in_progress" as const, color: "text-yellow-400" },
          { label: "Hecho", key: "done" as const, color: "text-green-400" },
        ].map(col => (
          <div key={col.key} className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
              <h3 className={`text-sm font-semibold ${col.color}`}>{col.label}</h3>
              <span className="text-xs bg-[var(--accent)] text-[var(--accent-foreground)] px-2 py-0.5 rounded-full">{DEMO_TASKS[col.key].length}</span>
            </div>
            <div className="p-3 space-y-2">
              {DEMO_TASKS[col.key].map(task => (
                <div key={task.id} className="bg-[var(--background)] rounded-lg border border-[var(--border)] p-3">
                  <p className="text-sm font-medium text-[var(--foreground)]">{task.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold">
                        {task.assignee.charAt(0)}
                      </div>
                      <span className="text-xs text-[var(--muted-foreground)]">{task.assignee.split(" ")[0]}</span>
                    </div>
                    <span className="text-xs text-[var(--muted-foreground)]">{task.estimatedHours}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Commits del sprint */}
      <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Commits en este sprint</h2>
        <div className="space-y-3">
          {DEMO_COMMITS.map(c => (
            <div key={c.hash} className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0">
              <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold shrink-0">
                {c.author.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--foreground)] truncate">{c.message}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{c.author} Â· {c.date}</p>
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

