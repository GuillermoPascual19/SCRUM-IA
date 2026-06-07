"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { useTfgStore } from "@/store/tfg.store";
import api from "@/lib/axios";
import { Sprint } from "@/lib/types";
import {
  LayoutDashboard, Zap, CalendarDays, List, Sparkles, FileText, Globe,
  GitCommit, ShieldCheck, Menu, X, LogOut, Sun, Moon,
} from "lucide-react";
import NotificationBell from "@/components/layout/NotificationBell";

const platformNav = [
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={16} /> },
  { name: "Mis TFGs", href: "/tfgs", icon: <List size={16} /> },
];

const themeColors: Record<string, string> = {
  green: "#16a34a",
  blue: "#2563eb",
  red: "#dc2626",
  orange: "#ea580c",
};

/** Monospace "// section" label — matches the landing/auth typographic system. */
function NavLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
      <span className="opacity-50">{"// "}</span>{children}
    </p>
  );
}

function sprintProgress(sprint: Sprint) {
  if (!sprint.startDate || !sprint.endDate) return null;
  const start = new Date(sprint.startDate).getTime();
  const end = new Date(sprint.endDate).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  const totalDays = Math.max(1, Math.round((end - start) / 86400000));
  const elapsedDays = Math.min(totalDays, Math.max(0, Math.round((Date.now() - start) / 86400000)));
  return { day: elapsedDays, total: totalDays, pct: Math.round((elapsedDays / totalDays) * 100) };
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { theme, mode, setTheme, toggleMode } = useThemeStore();
  const { activeTfg } = useTfgStore();

  const [open, setOpen] = useState(false);
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);

  const tfgIdMatch = pathname.match(/^\/tfgs\/(\d+)/);
  const tfgId = tfgIdMatch ? tfgIdMatch[1] : null;
  const isProf = user?.role === "teacher" || user?.role === "coordinator" || user?.role === "admin";

  const tfgNav = tfgId ? [
    { name: "Resumen", href: `/tfgs/${tfgId}`, icon: <LayoutDashboard size={16} /> },
    { name: "Sprints", href: `/tfgs/${tfgId}/sprints`, icon: <Zap size={16} /> },
    { name: "Planificación", href: `/tfgs/${tfgId}/planner`, icon: <CalendarDays size={16} /> },
    { name: "Backlog", href: `/tfgs/${tfgId}/backlog`, icon: <List size={16} /> },
    { name: "Evaluación IA", href: `/tfgs/${tfgId}/grades`, icon: <Sparkles size={16} /> },
    { name: "Commits", href: `/tfgs/${tfgId}/commits`, icon: <GitCommit size={16} /> },
    ...(isProf ? [{ name: "Informes", href: `/tfgs/${tfgId}/reports`, icon: <FileText size={16} /> }] : []),
  ] : [];

  /* Close the mobile drawer on navigation */
  useEffect(() => { setOpen(false); }, [pathname]);

  /* Active sprint for the countdown card — only fetched while inside a TFG */
  useEffect(() => {
    if (!tfgId) { setActiveSprint(null); return; }
    let cancelled = false;
    api.get(`/tfgs/${tfgId}/sprints`)
      .then(({ data }) => {
        if (cancelled) return;
        setActiveSprint((data as Sprint[]).find((s) => s.status === "activo") || null);
      })
      .catch(() => { if (!cancelled) setActiveSprint(null); });
    return () => { cancelled = true; };
  }, [tfgId]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const progress = activeSprint ? sprintProgress(activeSprint) : null;

  function navLink(item: { name: string; href: string; icon: React.ReactNode }, active: boolean) {
    return (
      <Link key={item.name} href={item.href}
        className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${
          active
            ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
            : "text-[var(--foreground)] hover:bg-[var(--accent)]"
        }`}>
        <span className={active ? "" : "text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--foreground)]"}>
          {item.icon}
        </span>
        {item.name}
      </Link>
    );
  }

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed left-4 top-4 z-50 grid size-10 place-items-center rounded-xl border border-[var(--border)]/50 bg-[var(--background)]/80 text-[var(--foreground)] backdrop-blur-xl transition-colors hover:bg-[var(--accent)] lg:hidden"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Backdrop (mobile only) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed left-3 top-3 z-40 flex h-[calc(100vh-24px)] w-72 flex-col rounded-2xl border border-[var(--border)]/40 bg-[var(--background)]/95 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-out lg:static lg:z-20 lg:my-3 lg:ml-3 lg:w-64 lg:translate-x-0 lg:bg-[var(--background)]/70 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-[calc(100%+12px)]"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-[var(--border)] p-4">
          <div className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-[var(--primary)]">
            <img src="/android-chrome-192x192.png" alt="SCRUM-IA" className="size-5 object-contain" />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--foreground)]">SCRUM-IA</p>
            <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Aula ágil</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-5 overflow-y-auto p-3">
          <div>
            <NavLabel>Plataforma</NavLabel>
            <div className="space-y-1">
              {platformNav.map((item) => navLink(item, pathname === item.href))}
              {(user?.role === "coordinator" || user?.role === "admin") &&
                navLink({ name: "Coordinación", href: "/coordinator", icon: <Globe size={16} /> }, pathname === "/coordinator")}
              {user?.role === "admin" &&
                navLink({ name: "Administración", href: "/admin", icon: <ShieldCheck size={16} /> }, pathname === "/admin")}
            </div>
          </div>

          {tfgId && (
            <div>
              <NavLabel>{activeTfg?.title || "Proyecto"}</NavLabel>
              <div className="space-y-1">
                {tfgNav.map((item) => {
                  const active = item.name === "Resumen" ? pathname === item.href : pathname.startsWith(item.href);
                  return navLink(item, active);
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Footer — account, profile, active sprint, theme & access */}
        <div className="space-y-3 border-t border-[var(--border)] p-3">
          <div className="flex items-center gap-2">
            <Link href="/profile"
              className={`flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-[var(--accent)] ${pathname === "/profile" ? "bg-[var(--accent)]" : ""}`}>
              <div className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-xs font-bold text-[var(--primary-foreground)]">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-[var(--foreground)]">{user?.name}</p>
                <p className="truncate text-xs text-[var(--muted-foreground)]">{user?.role}</p>
              </div>
            </Link>
            <NotificationBell />
          </div>

          {activeSprint && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--accent)]/40 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="flex min-w-0 items-center gap-1.5 truncate text-xs font-semibold text-[var(--foreground)]">
                  <span className="size-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                  <span className="truncate">{activeSprint.name} · Activo</span>
                </p>
                {progress && (
                  <span className="shrink-0 font-mono text-[10px] text-[var(--muted-foreground)]">
                    día {progress.day}/{progress.total}
                  </span>
                )}
              </div>
              {activeTfg?.title && <p className="mt-0.5 truncate text-[11px] text-[var(--muted-foreground)]">{activeTfg.title}</p>}
              {progress && (
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--border)]">
                  <div className="h-full rounded-full bg-[var(--primary)] transition-all" style={{ width: `${progress.pct}%` }} />
                </div>
              )}
            </div>
          )}

          <div>
            <NavLabel>Cuenta</NavLabel>
            <div className="flex items-center gap-2 px-1">
              <div className="flex flex-1 items-center gap-1.5">
                {(["green", "blue", "red", "orange"] as const).map((t) => (
                  <button key={t} onClick={() => setTheme(t)}
                    className={`size-5 rounded-full border-2 transition-transform ${theme === t ? "scale-110 border-[var(--foreground)]" : "border-transparent"}`}
                    style={{ backgroundColor: themeColors[t] }}
                    aria-label={`Tema ${t}`}
                  />
                ))}
              </div>
              <button onClick={toggleMode}
                className="grid size-8 place-items-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
                aria-label={mode === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}>
                {mode === "light" ? <Moon size={15} /> : <Sun size={15} />}
              </button>
            </div>
            <button onClick={handleLogout}
              className="mt-1.5 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] text-red-500 transition-colors hover:bg-[var(--accent)]">
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>

          <p className="truncate text-center font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]/60">
            {pathname}
          </p>
        </div>
      </aside>
    </>
  );
}
