"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity, ArrowUpRight, BarChart3, BookOpenCheck, Bot, CalendarDays, CheckCircle2,
  ClipboardList, GitBranch, GraduationCap, KanbanSquare,
  Rocket, ShieldCheck, Sparkles, UsersRound,
} from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

/** Dot + monospace caption section opener — quiet technical marker between sections. */
function SectionLabel({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className={`mb-4 inline-flex items-center gap-2.5 ${center ? "w-full justify-center" : ""}`}>
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-40" />
        <span className="relative inline-flex size-2 rounded-full bg-[#22c55e]" />
      </span>
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[#888]">
        {children}
      </span>
    </div>
  );
}

/** Faux terminal/IDE frame wrapping product previews — traffic lights + monospace path caption. */
function TerminalFrame({ caption, children, className = "" }: { caption: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] ${className}`}>
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.025] px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ef4444]/60" />
        <span className="size-2.5 rounded-full bg-[#f59e0b]/60" />
        <span className="size-2.5 rounded-full bg-[#22c55e]/60" />
        <span className="ml-2.5 truncate font-mono text-[11px] text-[#5e5e5e]">{caption}</span>
      </div>
      {children}
    </div>
  );
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

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

const stats = [
  { label: "Proyectos activos", value: 18, icon: Rocket },
  { label: "Velocidad media (SP)", value: 31, icon: Activity },
  { label: "Commits trazados", value: 1284, icon: GitBranch },
  { label: "Estudiantes evaluados", value: 47, icon: GraduationCap },
];

const modules = [
  { title: "Backlog + criterios", text: "Historias priorizadas con aceptación, puntos y trazabilidad a tareas.", icon: ClipboardList },
  { title: "Sprints académicos", text: "Objetivos, fechas, duración, retrospectivas y bitácora de decisiones.", icon: CalendarDays },
  { title: "Evaluación docente", text: "Entregables, versiones, rúbricas y reportes por estudiante o equipo.", icon: GraduationCap },
  { title: "IA sobre commits", text: "Lectura autorizada de GitHub para generar notas, evidencias y mejoras.", icon: Sparkles },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  /* Pointer-tracked aurora beam — same --mx pattern as the auth screen, scoped to the hero. */
  useEffect(() => {
    const el = heroRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080808] text-white">

      {/* Navbar */}
      <header className="sticky top-0 z-50 px-4 pt-5 sm:px-6 lg:px-8">
        <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-[#0d0d0d]/70 px-5 py-2.5 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-full bg-[#22c55e] text-black">
              <KanbanSquare className="size-4" />
            </div>
            <div className="leading-none">
              <p className="text-[13px] font-semibold tracking-tight">SCRUM-IA</p>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[#666]">TFG · gestión ágil</p>
            </div>
          </div>
          <div className="hidden items-center gap-7 md:flex">
            <a href="#modulos" className="text-[13px] text-[#999] transition-colors hover:text-white">Módulos</a>
            <a href="#metricas" className="text-[13px] text-[#999] transition-colors hover:text-white">Métricas</a>
            <a href="#ia" className="text-[13px] text-[#999] transition-colors hover:text-white">Evaluación IA</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden items-center rounded-full border border-white/15 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-white/5 sm:inline-flex">
              Entrar
            </Link>
            <Link href="/register" className="inline-flex items-center gap-1.5 rounded-full bg-[#22c55e] px-4 py-2 text-[13px] font-semibold text-black transition-colors hover:bg-[#16a34a]">
              Crear cuenta <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero — aurora beam tracks the pointer in a single brand-green hue family */}
      <section
        ref={heroRef}
        className="relative px-4 pb-20 pt-16 sm:px-6 lg:px-8"
        style={{ "--mx": "50%" } as React.CSSProperties}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute -top-40 h-[620px] w-[440px] -translate-x-1/2 rounded-full opacity-70 blur-[140px]"
            style={{
              left: "var(--mx)",
              background: "linear-gradient(180deg, rgba(34,197,94,0.4), rgba(190,242,100,0.14) 55%, transparent 80%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent" />
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]"
        >
          <div>
            <motion.div variants={fadeUp}>
              <SectionLabel>Plataforma académica de gestión ágil</SectionLabel>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[3.4rem] lg:text-[3.6rem]"
            >
              Aula SCRUM con evaluación inteligente de{" "}
              <span className="bg-gradient-to-r from-[#22c55e] to-[#bef264] bg-clip-text text-transparent">
                contribuciones reales
              </span>
              .
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-5 max-w-xl text-[15px] leading-7 text-[#9b9b9b]">
              Coordina TFGs tecnológicos con Product Backlog, Sprints, Kanban, burn-down charts, retrospectivas y análisis IA de commits autorizados desde GitHub.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#22c55e] px-6 py-3 text-[13px] font-semibold text-black shadow-[0_0_28px_rgba(34,197,94,0.25)] transition-all hover:bg-[#16a34a] hover:shadow-[0_0_36px_rgba(34,197,94,0.4)]"
              >
                <GithubIcon className="size-4" /> Registrarse y autorizar GitHub
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-white/5"
              >
                <UsersRound className="size-4" /> Ver demo
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#666]">
              <ShieldCheck className="size-3.5 text-[#22c55e]" /> Roles seguros · permisos por proyecto
            </motion.div>
          </div>

          <motion.div variants={fadeUp}>
            <TerminalFrame caption="ecotrack-tfg / sprint-2 — evaluacion.tsx">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#22c55e]">Sprint 2 · Evaluación</p>
                    <h2 className="mt-1.5 text-[17px] font-semibold">Proyecto: EcoTrack TFG</h2>
                  </div>
                  <span className="rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#22c55e]">
                    Activo
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 transition-colors hover:border-[#22c55e]/30">
                      <metric.icon className="mb-2.5 size-4 text-[#22c55e]" />
                      <p className="text-[19px] font-semibold tabular-nums">{metric.value}</p>
                      <p className="font-mono text-[9.5px] uppercase tracking-wider text-[#737373]">{metric.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <p className="text-[12.5px] font-medium">Permiso GitHub solicitado</p>
                    <GithubIcon className="size-3.5 text-[#22c55e]" />
                  </div>
                  <p className="font-mono text-[10.5px] leading-relaxed text-[#737373]">
                    {"// lectura autorizada de commits para vincular evidencia, tareas y evaluación IA"}
                  </p>
                </div>
              </div>
            </TerminalFrame>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats band — quiet spec-sheet rhythm between the hero and the feature grid */}
      <section id="metricas" className="border-y border-white/[0.06] bg-white/[0.015] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionLabel center>Métricas en vivo de la plataforma</SectionLabel>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mt-8 grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-white/[0.06]"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="flex flex-col items-center gap-2 px-4 text-center">
                <s.icon className="size-4 text-[#22c55e]" />
                <p className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
                  <AnimatedNumber value={s.value} />
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#737373]">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modules */}
      <section id="modulos" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionLabel>Módulos de la plataforma</SectionLabel>
        <h2 className="max-w-xl text-[1.9rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2.2rem]">
          Todo lo que necesita un equipo de TFG, en un mismo lugar.
        </h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {modules.map((module) => (
            <motion.article
              key={module.title}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d] p-5 transition-all hover:-translate-y-1 hover:border-[#22c55e]/30"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle, rgba(34,197,94,0.25), transparent 70%)" }}
              />
              <div className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[#22c55e]">
                <module.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold">{module.title}</h3>
              <p className="mt-2 text-[13px] leading-6 text-[#8f8f8f]">{module.text}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Burndown + Kanban */}
      <section className="border-y border-white/[0.06] bg-white/[0.015] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Seguimiento en tiempo real</SectionLabel>
          <h2 className="max-w-xl text-[1.9rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2.2rem]">
            Cada sprint, medido y visible para todo el equipo.
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <TerminalFrame caption="01 — burndown.chart.tsx" className="h-full">
                <div className="p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <BarChart3 className="size-4 text-[#22c55e]" />
                    <div>
                      <h3 className="text-[14px] font-semibold">Burn-down automático</h3>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[#737373]">Ideal vs. progreso real</p>
                    </div>
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={burndown} margin={{ left: -18, right: 10, top: 10 }}>
                        <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                        <XAxis dataKey="day" stroke="#4b5563" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#4b5563" tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 12, borderRadius: 8 }}
                        />
                        <Area type="monotone" dataKey="ideal" stroke="#52525b" fill="rgba(82,82,91,0.12)" strokeDasharray="4 4" name="Ideal" />
                        <Area type="monotone" dataKey="real" stroke="#22c55e" fill="rgba(34,197,94,0.14)" name="Real" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TerminalFrame>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <TerminalFrame caption="02 — sprint-board.tsx" className="h-full">
                <div className="grid gap-3 p-5 md:grid-cols-3">
                  {Object.entries(tasks).map(([column, items]) => (
                    <div key={column}>
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-[#999]">{column}</h4>
                        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-[#999]">{items.length}</span>
                      </div>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item} className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5 transition-colors hover:border-[#22c55e]/30">
                            <p className="text-[11.5px] font-medium leading-relaxed">{item}</p>
                            <div className="mt-2 flex items-center justify-between font-mono text-[9.5px] text-[#666]">
                              <span>TFG-SCRUM</span>
                              <CheckCircle2 className="size-3 text-[#22c55e]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TerminalFrame>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI report */}
      <section id="ia" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionLabel>Evaluación impulsada por IA</SectionLabel>
        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <h2 className="max-w-md text-[1.9rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2.2rem]">
              Informes de contribución generados por IA, revisados por el profesor.
            </h2>
            <p className="mt-4 max-w-md text-[14px] leading-7 text-[#9b9b9b]">
              El modelo analiza commits, tareas asociadas, calidad del código, frecuencia de aportaciones y evidencia del tablero para generar nota, comentarios y recomendaciones de mejora continua.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Commits", "Tareas vinculadas", "Calidad de código", "Frecuencia"].map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-wider text-[#999]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <TerminalFrame caption="03 — informe-ia.json">
              <div className="p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <Bot className="size-4 text-[#22c55e]" />
                    <span className="text-[13px] font-medium">Alumno · Developer</span>
                  </div>
                  <span className="rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-3 py-1 text-[13px] font-semibold text-[#22c55e]">
                    8,7 / 10
                  </span>
                </div>
                <ul className="mt-4 space-y-3 text-[12.5px] text-[#9b9b9b]">
                  <li className="flex gap-2.5">
                    <BookOpenCheck className="mt-0.5 size-4 shrink-0 text-[#22c55e]" /> 42 commits vinculados a 11 tareas.
                  </li>
                  <li className="flex gap-2.5">
                    <GitBranch className="mt-0.5 size-4 shrink-0 text-[#60a5fa]" /> Buena trazabilidad entre historias y cambios.
                  </li>
                  <li className="flex gap-2.5">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-[#c084fc]" /> Mejorar mensajes de commit y tests unitarios.
                  </li>
                </ul>
              </div>
            </TerminalFrame>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0d] px-8 py-16 text-center sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-72 w-[420px] rounded-full opacity-50 blur-[120px]"
            style={{ background: "linear-gradient(180deg, rgba(34,197,94,0.45), transparent 75%)" }}
          />
          <div className="relative">
            <SectionLabel center>Empieza ahora</SectionLabel>
            <h2 className="mx-auto max-w-xl text-[2rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2.4rem]">
              Lleva tu TFG a producción con metodología ágil real.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[14px] leading-7 text-[#9b9b9b]">
              Crea tu cuenta, vincula el repositorio de tu proyecto y deja que la plataforma documente tu progreso por ti.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#22c55e] px-7 py-3.5 text-[13px] font-semibold text-black shadow-[0_0_28px_rgba(34,197,94,0.3)] transition-all hover:bg-[#16a34a]"
              >
                <GithubIcon className="size-4" /> Crear cuenta gratuita
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-white/5"
              >
                Ver demo sin registro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/[0.06] px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="grid size-6 place-items-center rounded-full bg-[#22c55e] text-[11px] font-bold text-black">S</div>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#666]">© 2026 SCRUM-IA · Trabajo Fin de Grado</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/login" className="text-[12.5px] text-[#777] transition-colors hover:text-white">Iniciar sesión</Link>
          <Link href="/register" className="text-[12.5px] text-[#777] transition-colors hover:text-white">Crear cuenta</Link>
          <Link href="/demo" className="text-[12.5px] text-[#777] transition-colors hover:text-white">Demo</Link>
        </div>
      </footer>
    </main>
  );
}
