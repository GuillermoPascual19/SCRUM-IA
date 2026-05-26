"use client";

import Link from "next/link";
import { DEMO_TFG, DEMO_USER } from "../data";

export default function DemoTfgsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Proyectos</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Mis TFGs</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Proyectos en los que participas como estudiante.</p>
      </div>

      <Link href="/demo-student/tfgs/1" className="block bg-[var(--card)] rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-base font-semibold text-[var(--foreground)]">{DEMO_TFG.title}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-medium border border-green-500/30">Activo</span>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] mb-4 max-w-2xl">{DEMO_TFG.description}</p>
            <div className="flex items-center gap-6 text-xs text-[var(--muted-foreground)]">
              <span>Año: {DEMO_TFG.academicYear}</span>
              <span>{DEMO_TFG.members.length} miembros</span>
              <span>3 sprints</span>
            </div>
          </div>
          <div className="flex -space-x-2 ml-4">
            {DEMO_TFG.members.map((m) => (
              <div key={m.name} title={`${m.name} · ${m.scrumRole}`}
                className="w-8 h-8 rounded-full bg-[var(--primary)] border-2 border-[var(--card)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold">
                {m.name.charAt(0)}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-md bg-[var(--accent)] text-[var(--accent-foreground)] font-medium">{DEMO_USER.name}</span>
          <span className="text-xs text-[var(--muted-foreground)]">Developer</span>
        </div>
      </Link>
    </div>
  );
}

