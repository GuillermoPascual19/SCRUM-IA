"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import api from "@/lib/axios";

interface Notification {
  id: number;
  message: string;
  type: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${Math.floor(hours / 24)}d`;
}

const typeIcon: Record<string, string> = {
  evaluation: "✦",
  evaluation_reviewed: "✓",
  member_added: "＋",
};

export default function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function fetchNotifications() {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data);
    } catch {}
  }

  async function handleMarkRead(id: number) {
    await api.patch(`/notifications/${id}/read`).catch(() => {});
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  async function handleMarkAllRead() {
    await api.patch("/notifications/read-all").catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  async function handleClick(n: Notification) {
    if (!n.read) await handleMarkRead(n.id);
    if (n.link) { router.push(n.link); setOpen(false); }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center w-8 h-8 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute bottom-10 left-0 w-72 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <p className="text-xs font-semibold text-[var(--foreground)]">Notificaciones</p>
            {unread > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs text-[var(--primary)] hover:underline">
                Marcar todo como leído
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border)]">
            {notifications.length === 0 ? (
              <p className="text-xs text-[var(--muted-foreground)] text-center py-8">Sin notificaciones</p>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full text-left px-4 py-3 hover:bg-[var(--accent)]/50 transition-colors flex gap-3 items-start ${!n.read ? "bg-[var(--primary)]/5" : ""}`}
                >
                  <span className="text-[var(--primary)] text-sm shrink-0 mt-0.5">{typeIcon[n.type] ?? "·"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--foreground)] leading-snug">{n.message}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0 mt-1.5" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
