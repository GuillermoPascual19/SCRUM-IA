"use client";

import Link from "next/link";
import { DEMO_TFG, DEMO_SPRINTS, DEMO_COMMITS } from "../../data";

export default function DemoTfgPage() {
  const activeSprint = DEMO_SPRINTS.find(s => s.status === "activo");
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">TFG</p>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{DEMO_TFG.title}</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{DEMO_TFG.academicYear} · {DEMO_TFG.members.length} miembros</p>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 font-medium border border-green-500/30">Activo</span>
      </div>

      {/* Descripción */}
      <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-2">Descripción del proyecto</h2>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{DEMO_TFG.description}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
          <span><a href={DEMO_TFG.repositoryUrl} className="text-[var(--primary)] hover:underline">Repositorio GitHub</a></span>
          <span> {DEMO_TFG.academicYear}</span>
        </div>
      </div>

      {/* Sprint activo */}
      {activeSprint && (
        <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--primary)]/30">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
              <span className="text-[var(--primary)]"></span> Sprint activo
            </h2>
            <Link href="/demo-student/tfgs/1/sprints/1" className="text-xs text-[var(--primary)] hover:underline">Ver detalles</Link>
          </div>
          <p className="text-base font-bold text-[var(--foreground)]">{activeSprint.name}</p>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{activeSprint.goal}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
            <span>{activeSprint.startDate} → {activeSprint.endDate}</span>
            <span className="text-[var(--primary)] font-medium">{activeSprint.done}/{activeSprint.tasks} tareas completadas</span>
          </div>
          <div className="mt-3 w-full bg-[var(--border)] rounded-full h-1.5">
            <div className="bg-[var(--primary)] h-1.5 rounded-full" style={{ width: `${(activeSprint.done / activeSprint.tasks) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Equipo */}
      <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Equipo</h2>
        <div className="space-y-3">
          {DEMO_TFG.members.map((m) => (
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

      {/* Últimos commits */}
      <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Commits recientes</h2>
          <span className="text-xs text-[var(--muted-foreground)]">{DEMO_COMMITS.length} total</span>
        </div>
        <div className="space-y-3">
          {DEMO_COMMITS.slice(0, 3).map((c) => (
            <div key={c.hash} className="flex items-start gap-3 py-2 border-b border-[var(--border)] last:border-0">
              <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold shrink-0">
                {c.author.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)] truncate">{c.message}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{c.author} · {c.date} · <span className="text-green-400">+{c.linesAdded}</span> <span className="text-red-400">-{c.linesDeleted}</span></p>
              </div>
              <code className="text-xs text-[var(--muted-foreground)] font-mono">{c.hash}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

