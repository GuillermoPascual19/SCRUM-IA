"use client";

import Link from "next/link";
import {
  Activity, BarChart3, BookOpenCheck, Bot, CalendarDays, CheckCircle2,
  ClipboardList, GitBranch, GraduationCap, KanbanSquare,
  LockKeyhole, Rocket, ShieldCheck, Sparkles, UsersRound,
} from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const burndown = [
  { day: "D1", ideal: 42, real: 42 },
  { day: "D3", ideal: 36, real: 39 },
  { day: "D5", ideal: 30, real: 32 },
  { day: "D7", ideal: 22, real: 24 },
  { day: "D9", ideal: 14, real: 15 },
  { day: "D10", ideal: 0, real: 6 },
];

const tasks: Record<string, string[]> = {
  "To Do": ["Historia: consentimiento GitHub", "Rúbrica de calidad de código", "Importar issues iniciales"],
  "In Progress": ["Sprint 2: tablero Kanban", "Análisis IA de commits"],
  Done: ["Modelo de roles seguro", "Backlog académico", "Bitácora de decisiones"],
};

const metrics = [
  { label: "Proyectos activos", value: "18", icon: Rocket },
  { label: "Velocidad media", value: "31 SP", icon: Activity },
  { label: "Commits trazados", value: "1.284", icon: GitBranch },
  { label: "Evaluación IA", value: "8,7", icon: Bot },
];

const modules = [
  { title: "Backlog + criterios", text: "Historias priorizadas con aceptación, puntos y trazabilidad a tareas.", icon: ClipboardList },
  { title: "Sprints académicos", text: "Objetivos, fechas, duración, retrospectivas y bitácora de decisiones.", icon: CalendarDays },
  { title: "Evaluación docente", text: "Entregables, versiones, rúbricas y reportes por estudiante o equipo.", icon: GraduationCap },
  { title: "IA sobre commits", text: "Lectura autorizada de GitHub para generar notas, evidencias y mejoras.", icon: Sparkles },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0f0a] text-white overflow-x-hidden">

      {/* Navbar */}
      <section className="relative px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-[#22c55e] text-black shadow-[0_0_16px_rgba(34,197,94,0.4)]">
              <KanbanSquare className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold">SCRUM-IA</p>
              <p className="text-xs text-gray-500">TFG · Gestión ágil académica</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            {["Developer, Scrum Master, Product Owner"].map((role) => (
              <span key={role} className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-400">
                {role}
              </span>
            ))}
          </div>
          <Link href="/login" className="flex items-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2 text-sm font-semibold text-black hover:bg-[#16a34a] transition-colors">
            <LockKeyhole className="size-4" /> Entrar
          </Link>
        </div>
      </section>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-8 pt-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[#22c55e]/40 bg-[#22c55e]/10 px-3 py-2 text-sm font-semibold text-[#22c55e]">
            <ShieldCheck className="size-4" /> Roles seguros + permisos por proyecto
          </div>
          <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-[3.25rem]">
            Aula SCRUM con evaluación inteligente de contribuciones reales.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-400">
            Coordina TFGs tecnológicos con Product Backlog, Sprints, Kanban, burn-down charts, retrospectivas y análisis IA de commits autorizados desde GitHub.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#22c55e] px-6 py-3 text-sm font-semibold text-black hover:bg-[#16a34a] transition-colors shadow-[0_0_24px_rgba(34,197,94,0.25)]"
            >
              <GithubIcon className="size-5" /> Registrarse y autorizar GitHub
            </Link>
            <Link
              href="/demo"
              className="flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
            >
              <UsersRound className="size-5" /> Ver demo
            </Link>
          </div>
        </div>

        {/* Right panel */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#22c55e]">Sprint 2 · Sistema de evaluación</p>
              <h2 className="mt-1.5 text-xl font-bold">Proyecto: EcoTrack TFG</h2>
            </div>
            <span className="rounded-md border border-[#22c55e]/30 bg-[#22c55e]/15 px-3 py-1 text-xs font-bold text-[#22c55e]">
              Activo
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-lg border border-white/10 bg-black/30 p-4 hover:-translate-y-0.5 transition-transform"
              >
                <metric.icon className="mb-3 size-5 text-[#22c55e]" />
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-xs text-gray-500">{metric.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">Permiso GitHub solicitado</p>
              <GithubIcon className="size-4 text-[#22c55e]" />
            </div>
            <p className="text-xs leading-5 text-gray-500">
              Al registrarse, el estudiante acepta leer commits del repositorio del proyecto para vincular evidencia, tareas y evaluación IA.
            </p>
          </div>
        </div>
      </section>

      {/* Burndown + Kanban */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
          <div className="mb-5 flex items-center gap-3">
            <BarChart3 className="size-5 text-[#22c55e]" />
            <div>
              <h2 className="text-lg font-bold">Burn-down automático</h2>
              <p className="text-xs text-gray-500">Comparativa ideal vs progreso real del sprint.</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={burndown} margin={{ left: -18, right: 10, top: 10 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <XAxis dataKey="day" stroke="#4b5563" tick={{ fontSize: 11 }} />
                <YAxis stroke="#4b5563" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "#111827",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    fontSize: 12,
                    borderRadius: 8,
                  }}
                />
                <Area type="monotone" dataKey="ideal" stroke="#4b5563" fill="rgba(75,85,99,0.15)" strokeDasharray="4 4" name="Ideal" />
                <Area type="monotone" dataKey="real" stroke="#22c55e" fill="rgba(34,197,94,0.12)" name="Real" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kanban */}
        <div className="grid gap-3 md:grid-cols-3">
          {Object.entries(tasks).map(([column, items]) => (
            <div key={column} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold">{column}</h3>
                <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-gray-400">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <article
                    key={item}
                    className="rounded-lg border border-white/10 bg-black/30 p-3 hover:-translate-y-0.5 hover:border-[#22c55e]/40 transition-all"
                  >
                    <p className="text-xs font-medium leading-relaxed">{item}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                      <span>TFG-SCRUM</span>
                      <CheckCircle2 className="size-3.5 text-[#22c55e]" />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {modules.map((module) => (
            <article
              key={module.title}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 hover:-translate-y-1 hover:border-[#22c55e]/40 transition-all"
            >
              <module.icon className="mb-4 size-6 text-[#22c55e]" />
              <h3 className="text-base font-bold">{module.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">{module.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* AI Report */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Bot className="size-6 text-[#22c55e]" />
              <h2 className="text-2xl font-bold">Informe IA de contribución</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              El modelo analizará commits, tareas asociadas, calidad del código, frecuencia de aportaciones y evidencia del tablero para generar nota, comentarios y recomendaciones de mejora continua.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm font-semibold">Alumno · Developer</span>
              <span className="rounded border border-[#22c55e]/30 bg-[#22c55e]/15 px-3 py-1 text-sm font-bold text-[#22c55e]">
                8,7/10
              </span>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li className="flex gap-2">
                <BookOpenCheck className="size-4 text-[#22c55e] shrink-0 mt-0.5" /> 42 commits vinculados a 11 tareas.
              </li>
              <li className="flex gap-2">
                <GitBranch className="size-4 text-blue-400 shrink-0 mt-0.5" /> Buena trazabilidad entre historias y cambios.
              </li>
              <li className="flex gap-2">
                <Sparkles className="size-4 text-purple-400 shrink-0 mt-0.5" /> Mejorar mensajes de commit y tests unitarios.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-[#22c55e] grid place-items-center text-black font-bold text-xs">S</div>
          <span className="text-xs text-gray-600">© 2026 SCRUM-IA · Trabajo Fin de Grado</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Login</Link>
          <Link href="/register" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Registro</Link>
        </div>
      </footer>
    </main>
  );
}
