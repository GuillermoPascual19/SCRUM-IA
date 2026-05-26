"use client";

import Link from "next/link";
import { DEMO_TFGS, DEMO_SPRINTS, DEMO_COMMITS } from "../../data";

export default function DemoTeacherTfgDetail() {
  const tfg = DEMO_TFGS[0];
  const activeSprint = DEMO_SPRINTS.find(s => s.status === "activo");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">TFG activo</p>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{tfg.title}</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{tfg.academicYear} · {tfg.members.length} estudiantes</p>
        </div>
        <div className="flex gap-2">
          <Link href="/demo-teacher/tfgs/1/grades"
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition-opacity">
            ✦ Evaluar con IA
          </Link>
        </div>
      </div>

      {/* Descripción */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-2">Descripción del proyecto</h2>
        <p className="text-sm text-[var(--muted-foreground)]">{tfg.description}</p>
        <div className="mt-3 flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
          <span>⎇ {tfg.repositoryUrl.replace("https://github.com/", "")}</span>
          <span>Curso {tfg.academicYear}</span>
        </div>
      </div>

      {/* Sprint activo */}
      {activeSprint && (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">Sprint activo</p>
              <h2 className="text-sm font-semibold text-[var(--foreground)]">{activeSprint.name}</h2>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{activeSprint.goal}</p>
            </div>
            <Link href="/demo-teacher/tfgs/1/sprints"
              className="text-xs text-[var(--primary)] font-medium hover:underline">Ver sprints →</Link>
          </div>
          <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-2">
            <span>{activeSprint.startDate} → {activeSprint.endDate}</span>
            <span>{activeSprint.done}/{activeSprint.tasks} tareas</span>
          </div>
          <div className="w-full bg-[var(--border)] rounded-full h-1.5">
            <div className="bg-[var(--primary)] h-1.5 rounded-full" style={{ width: `${Math.round((activeSprint.done / activeSprint.tasks) * 100)}%` }} />
          </div>
        </div>
      )}

      {/* Equipo */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Equipo</h2>
        <div className="space-y-3">
          {tfg.members.map(m => (
            <div key={m.name} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold shrink-0">
                {m.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{m.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{m.scrumRole}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commits recientes */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Commits recientes</h2>
        <div className="space-y-3">
          {DEMO_COMMITS.map(c => (
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
