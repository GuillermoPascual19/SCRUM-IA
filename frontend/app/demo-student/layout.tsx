"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Zap, CalendarDays, List, Sparkles, FolderKanban, ArrowLeft } from "lucide-react";
import { DEMO_USER, DEMO_TFG } from "./data";

const tfgNav = [
  { name: "Resumen", href: "/demo-student/tfgs/1", icon: <LayoutDashboard size={16} />, exact: true },
  { name: "Sprints", href: "/demo-student/tfgs/1/sprints", icon: <Zap size={16} /> },
  { name: "Planificación", href: "/demo-student/tfgs/1/planner", icon: <CalendarDays size={16} /> },
  { name: "Backlog", href: "/demo-student/tfgs/1/backlog", icon: <List size={16} /> },
  { name: "Evaluación IA", href: "/demo-student/tfgs/1/grades", icon: <Sparkles size={16} /> },
];

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[var(--background)] relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "var(--primary)" }} />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full opacity-5 blur-3xl pointer-events-none" style={{ background: "var(--primary)" }} />

      {/* Sidebar demo */}
      <aside className="w-56 shrink-0 my-3 ml-3 h-[calc(100vh-24px)] flex flex-col bg-[var(--background)]/70 backdrop-blur-2xl border border-[var(--border)]/40 rounded-2xl relative z-20 overflow-hidden">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[var(--primary)] flex items-center justify-center shrink-0">
              <FolderKanban size={14} className="text-[var(--primary-foreground)]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--foreground)]">SCRUM-IA</p>
              <p className="text-xs text-[var(--muted-foreground)]">Vista demo</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          <div>
            <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider px-3 mb-2">Plataforma</p>
            <div className="space-y-1">
              <Link href="/demo-student/dashboard"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === "/demo-student/dashboard" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-[var(--foreground)] hover:bg-[var(--accent)]"}`}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link href="/demo-student/tfgs"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === "/demo-student/tfgs" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-[var(--foreground)] hover:bg-[var(--accent)]"}`}>
                <List size={16} /> Mis TFGs
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider px-3 mb-2 truncate">{DEMO_TFG.title}</p>
            <div className="space-y-1">
              {tfgNav.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link key={item.name} href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-[var(--foreground)] hover:bg-[var(--accent)]"}`}>
                    {item.icon} {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="p-3 border-t border-[var(--border)] space-y-3">
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold shrink-0">
              {DEMO_USER.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--foreground)] truncate">{DEMO_USER.name}</p>
              <p className="text-xs text-[var(--muted-foreground)] truncate">{DEMO_USER.role}</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors">
            <ArrowLeft size={13} /> Volver a la web
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 relative z-10">
        {/* Banner demo */}
        <div className="mb-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-xs text-[var(--primary)] font-medium">
          <Sparkles size={13} /> Vista demo con datos de ejemplo <Link href="/" className="underline underline-offset-2">Regi­strate para usar la plataforma real</Link>
        </div>
        {children}
      </main>
    </div>
  );
}

