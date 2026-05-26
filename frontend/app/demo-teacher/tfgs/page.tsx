"use client";

import Link from "next/link";
import { DEMO_TFGS } from "../data";

const statusColors: Record<string, string> = { activo: "bg-green-500", revision: "bg-yellow-500", completado: "bg-gray-400" };
const statusLabels: Record<string, string> = { activo: "Activo", revision: "En revisión", completado: "Cerrado" };

export default function DemoTeacherTfgsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Docencia</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">TFGs que tutorizas</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Gestiona los proyectos de tus estudiantes, genera evaluaciones y revisa el progreso.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: DEMO_TFGS.length },
          { label: "Activos", value: DEMO_TFGS.filter(t => t.status === "activo").length },
          { label: "En revisión", value: DEMO_TFGS.filter(t => t.status === "revision").length },
          { label: "Cerrados", value: DEMO_TFGS.filter(t => t.status === "completado").length },
        ].map(s => (
          <div key={s.label} className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEMO_TFGS.map(tfg => (
          <Link key={tfg.id} href={`/demo-teacher/tfgs/${tfg.id}`}
            className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--primary)] transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${statusColors[tfg.status]}`} />
              <span className="text-xs text-[var(--muted-foreground)]">{statusLabels[tfg.status]}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] ml-auto">{tfg.academicYear}</span>
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-1">{tfg.title}</h3>
            <p className="text-xs text-[var(--muted-foreground)] mb-3 line-clamp-2">{tfg.description}</p>
            <div className="w-full bg-[var(--border)] rounded-full h-1 mb-3">
              <div className="bg-[var(--primary)] h-1 rounded-full" style={{ width: `${tfg.progress}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
              <span>Estudiantes: {tfg.members.map(m => m.name.split(" ")[0]).join(", ")}</span>
              <span className="text-[var(--primary)] font-medium">Abrir →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
