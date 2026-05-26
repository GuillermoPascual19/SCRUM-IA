"use client";

import { DEMO_USER, DEMO_TFG, DEMO_BURNDOWN, DEMO_TASKS, DEMO_COMMITS } from "../data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const allTasks = [...DEMO_TASKS.to_do, ...DEMO_TASKS.in_progress, ...DEMO_TASKS.done];

export default function DemoDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--primary)] uppercase tracking-wider mb-1">Proyecto {DEMO_TFG.title}</p>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Dashboard del equipo</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Estado general del sprint, velocidad y actividad reciente del repositorio.</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)]">Repo conectado</span>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90">Generar informe IA</button>
        </div>
      </div>

      {/* GitHub status */}
      <div className="flex items-center justify-between bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--foreground)]">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">GitHub</p>
            <p className="text-xs text-[var(--muted-foreground)]">Conectado como @alex-garcia-dev</p>
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-medium"> Conectado</span>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Sprint actual", value: `${DEMO_TASKS.done.length}/${allTasks.length}`, sub: "tareas completadas" },
          { label: "En progreso", value: DEMO_TASKS.in_progress.length, sub: "tareas activas", primary: true },
          { label: "TFGs activos", value: 1, sub: "proyectos" },
          { label: "Commits", value: DEMO_COMMITS.length, sub: "sincronizados" },
        ].map((m) => (
          <div key={m.label} className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">{m.label}</p>
            <p className={`text-3xl font-bold mt-2 ${m.primary ? "text-[var(--primary)]" : "text-[var(--foreground)]"}`}>{m.value}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Burndown + Actividad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-1">Burn-down del sprint <span className="text-xs text-[var(--muted-foreground)] ml-2">Sprint 2</span></h2>
          <p className="text-xs text-[var(--muted-foreground)] mb-4">Story Points restantes, ideal vs real</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={DEMO_BURNDOWN}>
              <defs>
                <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="ideal" stroke="var(--muted-foreground)" strokeDasharray="5 5" fill="none" strokeWidth={1.5} name="Ideal" />
              <Area type="monotone" dataKey="real" stroke="var(--primary)" fill="url(#colorReal)" strokeWidth={2} name="Real" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-4">Actividad reciente</h2>
          <div className="space-y-4">
            {DEMO_COMMITS.slice(0, 4).map((c) => (
              <div key={c.hash} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold shrink-0">
                  {c.author.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)]">{c.author}</p>
                  <p className="text-xs text-[var(--muted-foreground)] truncate">{c.message}</p>
                </div>
                <span className="text-xs text-[var(--muted-foreground)] shrink-0">{c.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tareas del sprint */}
      <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Objetivos del sprint</h2>
          <span className="text-xs text-[var(--muted-foreground)]">{DEMO_TASKS.done.length} de {allTasks.length} completados</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {allTasks.map((task) => {
            const status = DEMO_TASKS.done.find(t => t.id === task.id) ? "done" : DEMO_TASKS.in_progress.find(t => t.id === task.id) ? "in_progress" : "to_do";
            return (
              <div key={task.id} className="flex items-center justify-between px-4 py-3 rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${status === "done" ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]" : "border-[var(--border)]"}`}>
                    {status === "done" && "✓"}
                  </span>
                  <span className={`text-sm ${status === "done" ? "line-through text-[var(--muted-foreground)]" : "text-[var(--foreground)]"}`}>{task.title}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${status === "done" ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : status === "in_progress" ? "bg-yellow-100 text-yellow-700" : "bg-[var(--muted)] text-[var(--muted-foreground)]"}`}>
                  {status === "done" ? "DONE" : status === "in_progress" ? "WIP" : "TODO"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

