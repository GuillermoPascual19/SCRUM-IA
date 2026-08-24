"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { useTfgStore } from "@/store/tfg.store";
import api from "@/lib/axios";
import { Sprint } from "@/lib/types";
import {
  LayoutDashboard, Zap, CalendarDays, List, Sparkles, FileText, Globe,
  GitCommit, ShieldCheck, Menu, X, LogOut, Sun, Moon, ChevronLeft, ChevronRight,
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

/** Monospace "// section" label — collapses to a thin divider in rail mode. */
function NavLabel({ children, collapsed }: { children: React.ReactNode; collapsed: boolean }) {
  if (collapsed) return <div className="mx-3 mb-2 h-px bg-[var(--border)]/50" />;
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
  const [collapsed, setCollapsed] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("sidebar-collapsed") === "true"
  );
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);

  const tfgIdMatch = pathname.match(/^\/tfgs\/(\d+)/);
  const tfgId = tfgIdMatch ? tfgIdMatch[1] : null;
  const isProf = user?.role === "teacher" || user?.role === "coordinator" || user?.role === "admin";

  /* Close the mobile drawer whenever the route changes */
  const [drawerPathname, setDrawerPathname] = useState(pathname);
  if (pathname !== drawerPathname) {
    setDrawerPathname(pathname);
    setOpen(false);
  }

  /* Reset the sprint countdown card whenever the active TFG changes */
  const [sprintTfgId, setSprintTfgId] = useState(tfgId);
  if (tfgId !== sprintTfgId) {
    setSprintTfgId(tfgId);
    setActiveSprint(null);
  }

  const tfgNav = tfgId ? [
    { name: "Resumen", href: `/tfgs/${tfgId}`, icon: <LayoutDashboard size={16} /> },
    { name: "Sprints", href: `/tfgs/${tfgId}/sprints`, icon: <Zap size={16} /> },
    { name: "Planificación", href: `/tfgs/${tfgId}/planner`, icon: <CalendarDays size={16} /> },
    { name: "Backlog", href: `/tfgs/${tfgId}/backlog`, icon: <List size={16} /> },
    { name: "Evaluación IA", href: `/tfgs/${tfgId}/grades`, icon: <Sparkles size={16} /> },
    { name: "Commits", href: `/tfgs/${tfgId}/commits`, icon: <GitCommit size={16} /> },
    ...(isProf ? [{ name: "Informes", href: `/tfgs/${tfgId}/reports`, icon: <FileText size={16} /> }] : []),
  ] : [];

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  }

  /* Active sprint for the countdown card — only fetched while inside a TFG */
  useEffect(() => {
    if (!tfgId) return;
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
      <Link key={item.name} href={item.href} title={collapsed ? item.name : undefined}
        className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${collapsed ? "justify-center px-0" : ""} ${
          active
            ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
            : "text-[var(--foreground)] hover:bg-[var(--accent)]"
        }`}>
        <span className={active ? "shrink-0" : "shrink-0 text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--foreground)]"}>
          {item.icon}
        </span>
        {!collapsed && item.name}
      </Link>
    );
  }

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed left-4 top-4 z-50 grid size-10 place-items-center rounded-xl border border-[var(--border)]/40 bg-[var(--background)]/50 text-[var(--foreground)] backdrop-blur-2xl backdrop-saturate-150 transition-colors hover:bg-[var(--accent)]/60 lg:hidden"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Backdrop (mobile only) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed left-3 top-3 z-40 flex h-[calc(100vh-24px)] w-72 flex-col transition-[width,transform] duration-300 ease-out lg:static lg:z-20 lg:my-3 lg:ml-3 lg:translate-x-0 ${
          collapsed ? "lg:w-[78px]" : "lg:w-64"
        } ${open ? "translate-x-0" : "-translate-x-[calc(100%+12px)]"}`}
      >
        {/* Glass background layer — clipped on its own so the collapse handle and the
            notification panel (both absolutely positioned to spill past the rail) aren't cut off */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl border border-[var(--border)]/30 bg-[var(--background)]/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.09),0_24px_70px_-28px_rgba(0,0,0,0.55)] backdrop-blur-2xl backdrop-saturate-150">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
        </div>

        {/* Collapse handle (desktop only) */}
        <button
          onClick={toggleCollapsed}
          className="absolute -right-3 top-[72px] z-20 hidden size-6 items-center justify-center rounded-full border border-[var(--border)]/50 bg-[var(--background)] text-[var(--muted-foreground)] shadow-md transition-colors hover:text-[var(--foreground)] lg:flex"
          aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>

        {/* Logo */}
        <div className={`relative flex items-center gap-2.5 border-b border-[var(--border)]/50 p-4 ${collapsed ? "justify-center" : ""}`}>
          <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-[var(--border)]/50 bg-white/[0.05] backdrop-blur-sm">
            <Image src="/android-chrome-192x192.png" alt="" width={20} height={20} className="size-5 object-contain" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--foreground)]">SCRUM-IA</p>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Aula ágil</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 space-y-5 overflow-y-auto p-3">
          <div>
            <NavLabel collapsed={collapsed}>Plataforma</NavLabel>
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
              <NavLabel collapsed={collapsed}>{activeTfg?.title || "Proyecto"}</NavLabel>
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
        <div className="relative space-y-3 border-t border-[var(--border)]/50 p-3">
          <div className={`flex items-center gap-2 ${collapsed ? "flex-col" : ""}`}>
            <Link href="/profile" title={collapsed ? user?.name : undefined}
              className={`flex min-w-0 items-center gap-2 rounded-xl transition-colors hover:bg-[var(--accent)] ${collapsed ? "justify-center p-1.5" : "flex-1 px-2 py-1.5"} ${pathname === "/profile" ? "bg-[var(--accent)]" : ""}`}>
              <div className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-xs font-bold text-[var(--primary-foreground)]">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-[var(--foreground)]">{user?.name}</p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">{user?.role}</p>
                </div>
              )}
            </Link>
            <NotificationBell />
          </div>

          {activeSprint && !collapsed && (
            <div className="rounded-xl border border-[var(--border)]/60 bg-white/[0.04] p-3 backdrop-blur-sm">
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
            <NavLabel collapsed={collapsed}>Cuenta</NavLabel>
            <div className={`flex items-center gap-2 px-1 ${collapsed ? "flex-col" : ""}`}>
              <div className={`flex items-center gap-1.5 ${collapsed ? "flex-col" : "flex-1"}`}>
                {(["green", "blue", "red", "orange"] as const).map((t) => (
                  <button key={t} onClick={() => setTheme(t)}
                    className={`size-5 rounded-full border-2 transition-transform ${theme === t ? "scale-110 border-[var(--foreground)]" : "border-transparent"}`}
                    style={{ backgroundColor: themeColors[t] }}
                    aria-label={`Tema ${t}`}
                  />
                ))}
              </div>
              <button onClick={toggleMode}
                className="grid size-8 shrink-0 place-items-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
                aria-label={mode === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}>
                {mode === "light" ? <Moon size={15} /> : <Sun size={15} />}
              </button>
            </div>
            <button onClick={handleLogout} title={collapsed ? "Cerrar sesión" : undefined}
              className={`mt-1.5 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] text-red-500 transition-colors hover:bg-[var(--accent)] ${collapsed ? "justify-center px-0" : ""}`}>
              <LogOut size={16} /> {!collapsed && "Cerrar sesión"}
            </button>
          </div>

          {!collapsed && (
            <p className="truncate text-center font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]/60">
              {pathname}
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
