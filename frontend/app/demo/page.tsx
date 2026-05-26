import Link from "next/link";

export default function DemoChoicePage() {
  return (
    <div className="min-h-screen bg-[#0a0f0a] flex flex-col items-center justify-center p-6">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-3">Vista demo</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">¿Qué rol quieres explorar?</h1>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Elige un perfil para ver cómo funciona SCRUM-IA desde su perspectiva. No se requiere registro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
        {/* Estudiante */}
        <Link href="/demo-student/dashboard" className="group relative rounded-2xl border border-white/10 bg-white/5 p-7 hover:border-green-500/50 hover:bg-white/8 transition-all duration-200 backdrop-blur-sm">
          <div className="mb-5">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white mb-1">Estudiante</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Consulta el estado de tu TFG, tus tareas, sprints y las evaluaciones generadas por la IA.
            </p>
          </div>
          <ul className="space-y-1.5 mb-6">
            {["Dashboard personal", "Kanban de tareas", "Backlog de historias", "Evaluaciones IA por sprint"].map(f => (
              <li key={f} className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-green-400">✓</span> {f}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 text-sm font-semibold text-green-400 group-hover:gap-3 transition-all">
            Explorar como estudiante <span>→</span>
          </div>
        </Link>

        {/* Profesor */}
        <Link href="/demo-teacher/dashboard" className="group relative rounded-2xl border border-white/10 bg-white/5 p-7 hover:border-blue-500/50 hover:bg-white/8 transition-all duration-200 backdrop-blur-sm">
          <div className="mb-5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white mb-1">Profesor</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Supervisa los proyectos de tus estudiantes, genera evaluaciones con IA y consulta informes.
            </p>
          </div>
          <ul className="space-y-1.5 mb-6">
            {["Dashboard con todos los TFGs", "Vista de sprints y commits", "Generación de evaluaciones IA", "Informes ejecutivos del proyecto"].map(f => (
              <li key={f} className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-blue-400">✓</span> {f}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-400 group-hover:gap-3 transition-all">
            Explorar como profesor <span>→</span>
          </div>
        </Link>
      </div>

      <Link href="/" className="mt-10 text-xs text-gray-600 hover:text-gray-400 transition-colors">
        ← Volver a la web
      </Link>
    </div>
  );
}
