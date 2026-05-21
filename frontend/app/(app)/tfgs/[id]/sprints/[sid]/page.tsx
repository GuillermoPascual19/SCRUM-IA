"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import api from "@/lib/axios";
import { Task, Sprint } from "@/lib/types";
import { useAuthStore } from "@/store/auth.store";

const columns = [
  { id: "to_do", label: "To Do", color: "bg-gray-500" },
  { id: "in_progress", label: "In Progress", color: "bg-yellow-500" },
  { id: "done", label: "Done", color: "bg-green-500" },
];

export default function KanbanPage() {
  const { id, sid } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", userStoryId: "", estimatedHours: "" });
  const [userStories, setUserStories] = useState<{ id: number; title: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [sid]);

  async function fetchData() {
    try {
      const { data: sprintData } = await api.get(`/tfgs/${id}/sprints/${sid}`);
      setSprint(sprintData);

      const { data: taskData } = await api.get(`/tasks/sprint/${sid}`);
      setTasks(taskData);

      const { data: storyData } = await api.get(`/tfgs/${id}/user-stories`);
      setUserStories(storyData);
    } catch {
      router.push(`/tfgs/${id}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    const taskId = parseInt(draggableId);

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus as Task["status"] } : t))
    );

    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
    } catch {
      fetchData();
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/tasks", {
        title: form.title,
        description: form.description || undefined,
        userStoryId: parseInt(form.userStoryId),
        sprintId: parseInt(sid as string),
        estimatedHours: form.estimatedHours ? parseFloat(form.estimatedHours) : undefined,
      });
      setForm({ title: "", description: "", userStoryId: "", estimatedHours: "" });
      setShowForm(false);
      fetchData();
    } catch {
      console.error("Error al crear tarea");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full text-[var(--muted-foreground)]">
      Cargando...
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => router.push(`/tfgs/${id}`)}
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              {sprint?.name || "Sprint"}
            </button>
            <span className="text-xs text-[var(--muted-foreground)]">/</span>
            <span className="text-xs text-[var(--primary)] font-medium">Tablero</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{sprint?.name}</h1>
          {sprint?.goal && (
            <p className="text-sm text-[var(--muted-foreground)] mt-1">{sprint.goal}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-3 text-sm text-[var(--muted-foreground)]">
            {columns.map((col) => (
              <span key={col.id} className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${col.color}`} />
                {tasks.filter((t) => t.status === col.id).length}
              </span>
            ))}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90"
          >
            + Nueva tarea
          </button>
          <button
            onClick={() => router.push(`/tfgs/${id}/sprints/${sid}/retrospective`)}
            className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
          >
            📝 Retrospectiva
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--primary)]">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Nueva tarea</h2>
          <form onSubmit={handleCreateTask} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  placeholder="Título de la tarea"
                />
              </div>
              <div>
                <select
                  required
                  value={form.userStoryId}
                  onChange={(e) => setForm({ ...form, userStoryId: e.target.value })}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                >
                  <option value="">Historia de usuario</option>
                  {userStories.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="number"
                  value={form.estimatedHours}
                  onChange={(e) => setForm({ ...form, estimatedHours: e.target.value })}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  placeholder="Horas estimadas"
                />
              </div>
              <div className="col-span-2">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  placeholder="Descripción (opcional)"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {saving ? "Guardando..." : "Crear tarea"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)]">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0">
            {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
                <div key={col.id} className="flex flex-col bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden min-h-0">
                <div className="flex items-center justify-between p-4 border-b border-[var(--border)] shrink-0">
                    <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">{col.label}</h3>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]">
                    {colTasks.length}
                    </span>
                </div>

                <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 p-3 space-y-2 overflow-y-auto transition-colors ${
                        snapshot.isDraggingOver ? "bg-[var(--accent)]" : ""
                        }`}
                    >
                        {colTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                            {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-[var(--background)] rounded-lg p-3 border border-[var(--border)] cursor-grab active:cursor-grabbing transition-shadow ${
                                snapshot.isDragging ? "shadow-lg border-[var(--primary)]" : "hover:border-[var(--primary)]"
                                }`}
                            >
                                <p className="text-sm font-medium text-[var(--foreground)] mb-2">{task.title}</p>
                                {task.description && (
                                <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mb-2">
                                    {task.description}
                                </p>
                                )}
                                <div className="flex items-center justify-between">
                                {task.estimatedHours && (
                                    <span className="text-xs text-[var(--muted-foreground)]">
                                    ⏱ {String(task.estimatedHours)}h
                                    </span>
                                )}
                                {task.assignee ? (
                                    <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold ml-auto">
                                    {task.assignee.name.charAt(0).toUpperCase()}
                                    </div>
                                ) : (
                                    <span className="text-xs text-[var(--muted-foreground)] ml-auto">Sin asignar</span>
                                )}
                                </div>
                            </div>
                            )}
                        </Draggable>
                        ))}
                        {provided.placeholder}
                        {colTasks.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex items-center justify-center h-20 border-2 border-dashed border-[var(--border)] rounded-lg">
                            <p className="text-xs text-[var(--muted-foreground)]">Sin tareas</p>
                        </div>
                        )}
                    </div>
                    )}
                </Droppable>
                </div>
            );
            })}
        </div>
       </DragDropContext>
    </div>
  );
}