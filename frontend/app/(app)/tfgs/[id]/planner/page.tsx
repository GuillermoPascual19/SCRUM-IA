"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SprintItem {
  id: string | number;
  name: string;
  goal?: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
  isPrediction: boolean;
}

interface Forecast {
  avgDuration: number;
  avgGap: number;
}

function isProfessor(role?: string) {
  return role === "teacher" || role === "coordinator" || role === "admin";
}

const STATUS_COLORS: Record<string, string> = {
  completado: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  activo: "bg-green-500/20 text-green-400 border-green-500/30",
  planificado: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  previsto: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  completado: "CERRADO",
  activo: "ACTIVO",
  planificado: "PLANIFICADO",
  previsto: "PREVISTO",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default function PlannerPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [sprints, setSprints] = useState<SprintItem[]>([]);
  const [predictions, setPredictions] = useState<SprintItem[]>([]);
  const [forecast, setForecast] = useState<Forecast>({ avgDuration: 10, avgGap: 1 });
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [form, setForm] = useState({ name: "", goal: "" });
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingSprint, setEditingSprint] = useState<SprintItem | null>(null);
  const [editForm, setEditForm] = useState({ name: "", goal: "" });
  const [editStartDate, setEditStartDate] = useState<Date | undefined>();
  const [editEndDate, setEditEndDate] = useState<Date | undefined>();
  const [editStartOpen, setEditStartOpen] = useState(false);
  const [editEndOpen, setEditEndOpen] = useState(false);

  useEffect(() => { fetchData(); }, [id]);

  async function fetchData() {
    try {
      const { data } = await api.get(`/tfgs/${id}/sprints/planner`);
      setSprints(data.sprints);
      setPredictions(data.predictions);
      setForecast(data.forecast);
    } catch {
      console.error("Error al cargar planner");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSprint(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/tfgs/${id}/sprints`, {
        name: form.name,
        goal: form.goal || undefined,
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
        endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
      });
      setForm({ name: "", goal: "" });
      setStartDate(undefined);
      setEndDate(undefined);
      fetchData();
    } catch {
      console.error("Error al crear sprint");
    } finally {
      setSaving(false);
    }
  }

  async function confirmPrediction(pred: SprintItem) {
    setSaving(true);
    try {
      await api.post(`/tfgs/${id}/sprints`, {
        name: pred.name.replace(" · Previsto", ""),
        startDate: pred.startDate,
        endDate: pred.endDate,
      });
      fetchData();
    } catch {
      console.error("Error al confirmar sprint");
    } finally {
      setSaving(false);
    }
  }

  async function updateSprintStatus(s: SprintItem, newStatus: string) {
    setSaving(true);
    try {
      await api.put(`/tfgs/${id}/sprints/${s.id}`, { status: newStatus });
      fetchData();
    } catch {
      console.error("Error al actualizar estado");
    } finally {
      setSaving(false);
    }
  }

  function openEdit(s: SprintItem) {
    setEditingSprint(s);
    setEditForm({ name: s.name, goal: s.goal || "" });
    setEditStartDate(s.startDate ? new Date(s.startDate) : undefined);
    setEditEndDate(s.endDate ? new Date(s.endDate) : undefined);
  }

  async function handleUpdateSprint(e: React.FormEvent) {
    e.preventDefault();
    if (!editingSprint) return;
    setSaving(true);
    try {
      await api.put(`/tfgs/${id}/sprints/${editingSprint.id}`, {
        name: editForm.name,
        goal: editForm.goal || undefined,
        startDate: editStartDate ? format(editStartDate, "yyyy-MM-dd") : undefined,
        endDate: editEndDate ? format(editEndDate, "yyyy-MM-dd") : undefined,
      });
      setEditingSprint(null);
      fetchData();
    } catch {
      console.error("Error al actualizar sprint");
    } finally {
      setSaving(false);
    }
  }

  const allItems = [...sprints, ...predictions];

  function getSprintsForDay(date: Date): SprintItem[] {
    return allItems.filter((s) => {
      if (!s.startDate || !s.endDate) return false;
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    });
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  const today = new Date();

  if (loading) return (
    <div className="flex items-center justify-center h-full text-[var(--muted-foreground)]">Cargando...</div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">
            Planificación · Roadmap Ágil
          </p>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Calendario de sprints</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Cadencia detectada: {forecast.avgDuration} días por sprint · {forecast.avgGap} día(s) de descanso entre sprints.
          </p>
        </div>
        <button onClick={() => setCurrentDate(new Date())}
          className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors">
          Hoy
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <span className="text-xs text-[var(--muted-foreground)] font-mono">// TIMELINE</span>
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-[var(--foreground)] capitalize">{monthName}</h2>
              <div className="flex gap-1">
                <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                  className="w-7 h-7 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--accent)]">‹</button>
                <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                  className="w-7 h-7 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--accent)]">›</button>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 mb-2">
              {["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-[var(--muted-foreground)] py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(year, month, day);
                const daysSprints = getSprintsForDay(date);
                const isToday = date.toDateString() === today.toDateString();
                return (
                  <div key={day} className={`min-h-[60px] rounded-lg p-1 border transition-colors ${
                    isToday ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] hover:border-[var(--muted-foreground)]"
                  }`}>
                    <span className={`text-xs font-medium block mb-1 ${isToday ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}>{day}</span>
                    {daysSprints.slice(0, 2).map((s) => (
                      <div key={s.id} className={`text-[10px] px-1 py-0.5 rounded mb-0.5 truncate border ${
                        s.isPrediction ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        : s.status === "activo" ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : s.status === "completado" ? "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}>
                        {s.name.split(" · ")[0]}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[var(--primary)]">✦</span>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Pronóstico IA</h3>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mb-4">
              Calculado con la media de duración y la cadencia entre sprints establecidos.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[var(--background)] rounded-lg p-3 text-center border border-[var(--border)]">
                <p className="text-2xl font-bold text-[var(--primary)]">{forecast.avgDuration}d</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Duración</p>
              </div>
              <div className="bg-[var(--background)] rounded-lg p-3 text-center border border-[var(--border)]">
                <p className="text-2xl font-bold text-[var(--primary)]">{forecast.avgGap}d</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Gap</p>
              </div>
            </div>
          </div>

          {isProfessor(user?.role) && (
            <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">+ Nuevo sprint</h3>
              <form onSubmit={handleCreateSprint} className="space-y-3">
                <div>
                  <label className="block text-xs text-[var(--muted-foreground)] mb-1">Nombre</label>
                  <input type="text" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    placeholder="Sprint 4 · Reportes" />
                </div>
                <div>
                  <label className="block text-xs text-[var(--muted-foreground)] mb-1">Objetivo</label>
                  <input type="text" value={form.goal}
                    onChange={(e) => setForm({ ...form, goal: e.target.value })}
                    className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    placeholder="Reporte académico final" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-[var(--muted-foreground)] mb-1">Inicio</label>
                    <Popover open={startOpen} onOpenChange={setStartOpen}>
                      <PopoverTrigger asChild>
                        <button type="button" className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-left text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors">
                          {startDate ? format(startDate, "dd/MM/yyyy") : "dd/mm/aaaa"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 backdrop-blur-md bg-[var(--card)]/90 border border-[var(--border)] shadow-xl z-50" align="start">
                        <Calendar mode="single" selected={startDate} onSelect={(date) => { setStartDate(date); setStartOpen(false); }} locale={es} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--muted-foreground)] mb-1">Fin</label>
                    <Popover open={endOpen} onOpenChange={setEndOpen}>
                      <PopoverTrigger asChild>
                        <button type="button" className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-left text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors">
                          {endDate ? format(endDate, "dd/MM/yyyy") : "dd/mm/aaaa"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 backdrop-blur-md bg-[var(--card)]/90 border border-[var(--border)] shadow-xl z-50" align="start">
                        <Calendar mode="single" selected={endDate} onSelect={(date) => { setEndDate(date); setEndOpen(false); }} locale={es} disabled={startDate ? { before: startDate } : undefined} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <button type="submit" disabled={saving}
                  className="w-full py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {saving ? "Guardando..." : "⊕ Añadir al roadmap"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--primary)]">⎇</span>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Roadmap de sprints</h3>
          </div>
          <span className="text-xs text-[var(--muted-foreground)]">
            {sprints.filter(s => s.startDate).length} establecidos · {predictions.length} previstos
          </span>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {[...sprints, ...predictions].map((s) => (
            <div key={s.id} className="flex items-center justify-between p-4 hover:bg-[var(--accent)]/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded border font-medium ${STATUS_COLORS[s.status] || STATUS_COLORS.planificado}`}>
                  {STATUS_LABELS[s.status] || s.status.toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{s.name}</p>
                  {s.goal && <p className="text-xs text-[var(--muted-foreground)]">{s.goal}</p>}
                  {s.isPrediction && <p className="text-xs text-[var(--muted-foreground)]">Generado en base a histórico (cadencia media)</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {s.startDate && s.endDate && (
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {new Date(s.startDate).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                    {" → "}
                    {new Date(s.endDate).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                    {" · "}
                    {Math.ceil((new Date(s.endDate).getTime() - new Date(s.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1}d
                  </span>
                )}
                {s.isPrediction ? (
                  <button onClick={() => confirmPrediction(s)} disabled={saving}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--primary)] text-[var(--primary)] text-xs font-medium hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-colors disabled:opacity-50">
                    ⊕ Confirmar
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    {isProfessor(user?.role) && s.status === "planificado" && (
                      <>
                        <button onClick={() => updateSprintStatus(s, "activo")} disabled={saving}
                          className="text-xs px-2 py-1 rounded border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-50">
                          ▶ Iniciar
                        </button>
                        <button onClick={() => openEdit(s)}
                          className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                          ✎ Editar
                        </button>
                      </>
                    )}
                    {isProfessor(user?.role) && s.status === "activo" && (
                      <button onClick={() => updateSprintStatus(s, "completado")} disabled={saving}
                        className="text-xs px-2 py-1 rounded border border-gray-500/30 text-gray-400 hover:bg-gray-500/10 transition-colors disabled:opacity-50">
                        ✓ Cerrar sprint
                      </button>
                    )}
                    <button onClick={() => router.push(`/tfgs/${id}/sprints/${s.id}`)}
                      className="text-xs text-[var(--primary)] hover:underline">
                      Ver tablero →
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingSprint && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] rounded-xl p-6 w-full max-w-md border border-[var(--border)] space-y-4">
            <h2 className="text-base font-semibold text-[var(--foreground)]">Editar sprint</h2>
            <form onSubmit={handleUpdateSprint} className="space-y-3">
              <div>
                <label className="block text-xs text-[var(--muted-foreground)] mb-1">Nombre</label>
                <input type="text" required value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
              </div>
              <div>
                <label className="block text-xs text-[var(--muted-foreground)] mb-1">Objetivo</label>
                <input type="text" value={editForm.goal}
                  onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-[var(--muted-foreground)] mb-1">Inicio</label>
                  <Popover open={editStartOpen} onOpenChange={setEditStartOpen}>
                    <PopoverTrigger asChild>
                      <button type="button" className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-left text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors">
                        {editStartDate ? format(editStartDate, "dd/MM/yyyy") : "dd/mm/aaaa"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 backdrop-blur-md bg-[var(--card)]/90 border border-[var(--border)] shadow-xl z-[60]" align="start">
                      <Calendar mode="single" selected={editStartDate} onSelect={(date) => { setEditStartDate(date); setEditStartOpen(false); }} locale={es} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-xs text-[var(--muted-foreground)] mb-1">Fin</label>
                  <Popover open={editEndOpen} onOpenChange={setEditEndOpen}>
                    <PopoverTrigger asChild>
                      <button type="button" className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-left text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors">
                        {editEndDate ? format(editEndDate, "dd/MM/yyyy") : "dd/mm/aaaa"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 backdrop-blur-md bg-[var(--card)]/90 border border-[var(--border)] shadow-xl z-[60]" align="start">
                      <Calendar mode="single" selected={editEndDate} onSelect={(date) => { setEditEndDate(date); setEditEndOpen(false); }} locale={es} disabled={editStartDate ? { before: editStartDate } : undefined} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
                <button type="button" onClick={() => setEditingSprint(null)}
                  className="flex-1 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)]">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
