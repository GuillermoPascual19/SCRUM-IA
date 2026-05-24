"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { useRouter } from "next/navigation";
import { useTfgStore } from "@/store/tfg.store";

const platformNav = [
  { name: "Dashboard", href: "/dashboard", icon: "⊞" },
  { name: "Mis TFGs", href: "/tfgs", icon: "☰" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { theme, mode, setTheme, toggleMode } = useThemeStore();
  const { activeTfg } = useTfgStore();
  const router = useRouter();

  const tfgIdMatch = pathname.match(/^\/tfgs\/(\d+)/);
  const tfgId = tfgIdMatch ? tfgIdMatch[1] : null;

  const isProf = user?.role === "profesor" || user?.role === "coordinador" || user?.role === "admin";

  const tfgNav = tfgId ? [
    { name: "Resumen", href: `/tfgs/${tfgId}`, icon: "◉" },
    { name: "Sprints", href: `/tfgs/${tfgId}/sprints`, icon: "◎" },
    { name: "Planificación", href: `/tfgs/${tfgId}/planner`, icon: "📅" },
    { name: "Backlog", href: `/tfgs/${tfgId}/backlog`, icon: "☰" },
    { name: "Evaluación IA", href: `/tfgs/${tfgId}/grades`, icon: "✦" },
    ...(isProf ? [{ name: "Informes", href: `/tfgs/${tfgId}/reports`, icon: "◈" }] : []),
  ] : [];


  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="w-56 h-screen flex flex-col bg-[var(--card)] border-r border-[var(--border)]">
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[var(--primary)] flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src="/android-chrome-192x192.png"
              alt="SCRUM-IA"
              className="w-5 h-5 object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--foreground)]">SCRUM-IA</p>
            <p className="text-xs text-[var(--muted-foreground)]">Aula Ágil</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        <div>
          <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider px-3 mb-2">
            Plataforma
          </p>
          <div className="space-y-1">
            {platformNav.map((item) => (
              <Link key={item.name} href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "text-[var(--foreground)] hover:bg-[var(--accent)]"
                }`}>
                <span className="text-base">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {tfgId && (
          <div>
            <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider px-3 mb-2 truncate">
              {activeTfg?.title || "Proyecto"}
            </p>
            <div className="space-y-1">
              {tfgNav.map((item) => {
                const isActive =
                  item.name === "Resumen"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <Link key={item.name} href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "text-[var(--foreground)] hover:bg-[var(--accent)]"
                    }`}>
                    <span className="text-base">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider px-3 mb-2">
            Acceso
          </p>
          <div className="space-y-1">
            <button onClick={toggleMode}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors">
              {mode === "light" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                </svg>
              )}
              {mode === "light" ? "Modo oscuro" : "Modo claro"}
            </button>
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-[var(--accent)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider px-3 mb-2">
            Tema
          </p>
          <div className="flex gap-2 px-3">
            {(["green", "blue", "red", "orange"] as const).map((t) => (
              <button key={t} onClick={() => setTheme(t)}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${
                  theme === t ? "scale-125 border-[var(--foreground)]" : "border-transparent"
                }`}
                style={{
                  backgroundColor:
                    t === "green" ? "#16a34a" :
                    t === "blue" ? "#2563eb" :
                    t === "red" ? "#dc2626" : "#ea580c",
                }}
              />
            ))}
          </div>
        </div>
      </nav>

      <div className="p-3 border-t border-[var(--border)] space-y-3">
        <div className="flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--foreground)] truncate">{user?.name}</p>
            <p className="text-xs text-[var(--muted-foreground)] truncate">{user?.role}</p>
          </div>
        </div>

        {activeTfg && (
          <div className="px-2 py-2 rounded-lg bg-[var(--accent)]">
            <p className="text-xs font-semibold text-[var(--accent-foreground)] truncate">{activeTfg.title}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{user?.name}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
