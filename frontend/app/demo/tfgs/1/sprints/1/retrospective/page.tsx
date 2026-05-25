"use client";

import { DEMO_RETRO } from "../../../../../data";

function parseNotes(val: string): { id: number; text: string }[] {
  try { return JSON.parse(val); } catch { return []; }
}

export default function DemoRetrospectivePage() {
  const wentWell = parseNotes(DEMO_RETRO.wentWell);
  const toImprove = parseNotes(DEMO_RETRO.toImprove);
  const actions = parseNotes(DEMO_RETRO.actions);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Sprint 2 · Retrospectiva</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Retrospectiva del sprint</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Reflexión del equipo al cierre del Sprint 2.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fue bien */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] bg-green-500/5">
            <h2 className="text-sm font-semibold text-green-400">✓ Fue bien</h2>
          </div>
          <div className="p-3 space-y-2">
            {wentWell.map(n => (
              <div key={n.id} className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                <p className="text-sm text-[var(--foreground)]">{n.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* A mejorar */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] bg-yellow-500/5">
            <h2 className="text-sm font-semibold text-yellow-400">△ A mejorar</h2>
          </div>
          <div className="p-3 space-y-2">
            {toImprove.map(n => (
              <div key={n.id} className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-sm text-[var(--foreground)]">{n.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--primary)]/5">
            <h2 className="text-sm font-semibold text-[var(--primary)]">→ Acciones</h2>
          </div>
          <div className="p-3 space-y-2">
            {actions.map(n => (
              <div key={n.id} className="bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-lg p-3">
                <p className="text-sm text-[var(--foreground)]">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
