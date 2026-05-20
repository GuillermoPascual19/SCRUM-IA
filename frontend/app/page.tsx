"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#22c55e] flex items-center justify-center text-black font-bold text-sm">S</div>
          <span className="font-semibold text-sm">SCRUM-IA</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
            Iniciar sesión
          </Link>
          <Link href="/register" className="text-sm bg-[#22c55e] text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#16a34a] transition-colors">
            Registrarse
          </Link>
        </div>
      </nav>

      <section className="relative px-8 pt-24 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, #14532d 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block text-xs font-semibold text-[#22c55e] uppercase tracking-widest mb-4 px-3 py-1 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10">
            Plataforma académica · TFG
          </span>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Tu TFG, gestionado con{" "}
            <span className="text-[#22c55e]">SCRUM</span>{" "}
            y evaluado con{" "}
            <span className="text-[#22c55e]">IA</span>.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Conecta tu repositorio de GitHub, organiza sprints, gestiona el backlog y recibe evaluaciones automáticas generadas por inteligencia artificial.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register" className="px-6 py-3 rounded-lg bg-[#22c55e] text-black font-semibold hover:bg-[#16a34a] transition-colors">
              Empezar gratis
            </Link>
            <Link href="/login" className="px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors">
              Ver demo →
            </Link>
          </div>
        </div>
      </section>

      <section className="px-8 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "100%", label: "Metodología SCRUM" },
            { value: "IA", label: "Evaluación automática" },
            { value: "GitHub", label: "Integración commits" },
            { value: "4 roles", label: "Student · Prof · Coord · Admin" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
              <p className="text-2xl font-bold text-[#22c55e] mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Todo lo que necesitas para tu TFG</h2>
          <p className="text-gray-500 text-sm">Desde la planificación hasta la evaluación final</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "◎", title: "Gestión SCRUM", desc: "Sprints, backlog, tablero Kanban y retrospectivas. Todo el flujo ágil en una sola plataforma." },
            { icon: "✦", title: "Evaluación con IA", desc: "Claude analiza tus commits y tareas para generar notas automáticas por sprint y nota final del TFG." },
            { icon: "⎇", title: "Integración GitHub", desc: "Conecta tu repositorio y sincroniza commits automáticamente. Trazabilidad total del código." },
            { icon: "📅", title: "Planificador de sprints", desc: "Calendario visual con predicción de sprints futuros basada en cadencia histórica." },
            { icon: "⊞", title: "Dashboard en tiempo real", desc: "Burn-down chart real, actividad reciente y métricas del sprint en un vistazo." },
            { icon: "◉", title: "Roles y permisos", desc: "Estudiante, profesor, coordinador y admin. Dentro del proyecto: Product Owner, Scrum Master y Developer." },
          ].map((feature) => (
            <div key={feature.title} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-[#22c55e]/30 transition-colors">
              <span className="text-2xl mb-4 block text-[#22c55e]">{feature.icon}</span>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-16 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">¿Cómo funciona?</h2>
          <p className="text-gray-500 text-sm">En 4 pasos sencillos</p>
        </div>
        <div className="space-y-4">
          {[
            { step: "01", title: "Crea tu TFG y añade al equipo", desc: "El profesor crea el proyecto y añade a los estudiantes con sus roles SCRUM." },
            { step: "02", title: "Conecta tu repositorio de GitHub", desc: "Autoriza la app para leer los commits de tu repo privado o público." },
            { step: "03", title: "Trabaja en sprints", desc: "Planifica el backlog, asigna tareas y muévelas por el tablero Kanban." },
            { step: "04", title: "Recibe tu evaluación", desc: "Al finalizar cada sprint, la IA analiza tu actividad y genera notas y feedback." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 p-5 rounded-xl border border-white/10 bg-white/5 hover:border-[#22c55e]/30 transition-colors">
              <span className="text-2xl font-bold text-[#22c55e]/40 shrink-0">{item.step}</span>
              <div>
                <p className="font-semibold mb-1">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-20 text-center"
        style={{ background: "radial-gradient(ellipse at 50% 100%, #14532d 0%, transparent 60%)" }}>
        <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm">
          Únete y gestiona tu TFG con metodología profesional y evaluación inteligente.
        </p>
        <Link href="/register" className="inline-block px-8 py-3 rounded-lg bg-[#22c55e] text-black font-semibold hover:bg-[#16a34a] transition-colors">
          Crear cuenta gratis
        </Link>
      </section>

      <footer className="px-8 py-6 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#22c55e] flex items-center justify-center text-black font-bold text-xs">S</div>
          <span className="text-xs text-gray-600">© 2026 SCRUM-IA · Trabajo Fin de Grado</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs text-gray-600 hover:text-gray-400">Login</Link>
          <Link href="/register" className="text-xs text-gray-600 hover:text-gray-400">Registro</Link>
        </div>
      </footer>
    </div>
  );
}
