"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";
import { Tfg, Sprint, Task } from "@/lib/types";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const burndownData = [
  { day: "D1", real: 45, ideal: 45 },
  { day: "D2", real: 42, ideal: 40 },
  { day: "D3", real: 38, ideal: 35 },
  { day: "D4", real: 35, ideal: 30 },
  { day: "D5", real: 30, ideal: 25 },
  { day: "D6", real: 28, ideal: 20 },
  { day: "D7", real: 22, ideal: 15 },
  { day: "D8", real: null, ideal: 10 },
  { day: "D9", real: null, ideal: 5 },
  { day: "D10", real: null, ideal: 0 },
];

const recentActivity = [
  { initials: "LM", name: "Lucía M.", role: "Developer", action: "merge PR #84 · Auth GitHub", time: "hace 12 min" },
  { initials: "JR", name: "Jorge R.", role: "Scrum Master", action: "comentó retrospectiva sprint 1", time: "hace 1 h" },
  { initials: "PS", name: "Prof. Sanz", role: "Profesor", action: "validó entregable E2", time: "hace 3 h" },
  { initials: "AP", name: "Ana P.", role: "PO", action: "movió 'Burn-down' a Done", time: "hace 5 h" },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [tfgs, setTfgs] = useState<Tfg[]>([]);
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: tfgData } = await api.get("/tfgs/mine");
        setTfgs(tfgData);

        if (tfgData.length > 0) {
          const { data: sprintData } = await api.get(`/tfgs/${tfgData[0].id}/sprints`);
          const active = sprintData.find((s: Sprint) => s.status === "activo") || sprintData[0];
          if (active) {
            setActiveSprint(active);
            const { data: taskData } = await api.get(`/tasks/sprint/${active.id}`);
            setTasks(taskData);
          }
        }
      } catch {
        console.error("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const doneTasks = tasks.filter((t) => t.status === "done");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const todoTasks = tasks.filter((t) => t.status === "to_do");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          {tfgs[0] && (
            <p className="text-xs font-medium text-[var(--primary)] uppercase tracking-wider mb-1">
              Proyecto · {tfgs[0].title}
            </p>
          )}
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Dashboard del equipo</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Estado general del sprint, velocidad y actividad reciente del repositorio.
          </p>
        </div>
        <div className="flex gap-2">
          {tfgs[0]?.repositoryUrl && (
            <a
              href={tfgs[0].repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
            >
              ⎇ Repo
            </a>
          )}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition-opacity">
            ✦ Generar informe IA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
          <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">Sprint actual</p>
          <p className="text-3xl font-bold text-[var(--foreground)] mt-2">
            {doneTasks.length}/{tasks.length}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">tareas completadas</p>
        </div>
        <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
          <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">En progreso</p>
          <p className="text-3xl font-bold text-[var(--primary)] mt-2">{inProgressTasks.length}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">tareas activas</p>
        </div>
        <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
          <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">TFGs activos</p>
          <p className="text-3xl font-bold text-[var(--foreground)] mt-2">
            {tfgs.filter((t) => t.status === "activo").length}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">proyectos</p>
        </div>
        <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
          <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">Pendientes</p>
          <p className="text-3xl font-bold text-[var(--foreground)] mt-2">{todoTasks.length}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">tareas por hacer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-1">Burn-down del sprint</h2>
          <p className="text-xs text-[var(--muted-foreground)] mb-4">Story Points restantes · ideal vs real</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={burndownData}>
              <defs>
                <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="ideal"
                stroke="var(--muted-foreground)"
                strokeDasharray="5 5"
                fill="none"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="real"
                stroke="var(--primary)"
                fill="url(#colorReal)"
                strokeWidth={2}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-4">Actividad reciente</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold shrink-0">
                  {activity.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {activity.name} · <span className="text-[var(--muted-foreground)] font-normal">{activity.role}</span>
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] truncate">{activity.action}</p>
                </div>
                <span className="text-xs text-[var(--muted-foreground)] shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Objetivos del sprint</h2>
          <span className="text-xs text-[var(--muted-foreground)]">
            {doneTasks.length} de {tasks.length} completados
          </span>
        </div>
        {tasks.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)] text-center py-4">
            No hay tareas en el sprint activo
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                    task.status === "done"
                      ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "border-[var(--border)]"
                  }`}>
                    {task.status === "done" && "✓"}
                  </span>
                  <span className={`text-sm ${task.status === "done" ? "line-through text-[var(--muted-foreground)]" : "text-[var(--foreground)]"}`}>
                    {task.title}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  task.status === "done"
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : task.status === "in_progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                }`}>
                  {task.status === "done" ? "DONE" : task.status === "in_progress" ? "WIP" : "TODO"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}