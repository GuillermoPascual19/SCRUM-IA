"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Tfg, Sprint, TfgMember } from "@/lib/types";
import { useAuthStore } from "@/store/auth.store";
import { useTfgStore } from "@/store/tfg.store";

type Tab = "resumen" | "sprints" | "backlog" | "evaluacion";

function isProfessor(role?: string) {
  return role === "profesor" || role === "coordinador" || role === "admin";
}

export default function TfgDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { setActiveTfg } = useTfgStore();

  const [tfg, setTfg] = useState<Tfg | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [members, setMembers] = useState<TfgMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("resumen");

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    try {
      const { data: tfgData } = await api.get(`/tfgs/${id}`);
      setTfg(tfgData);
      setActiveTfg(tfgData);

      const { data: sprintData } = await api.get(`/tfgs/${id}/sprints`);
      setSprints(sprintData);

      const { data: memberData } = await api.get(`/tfgs/${id}/members`);
      setMembers(memberData);
    } catch {
      router.push("/tfgs");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full text-[var(--muted-foreground)]">
      Cargando...
    </div>
  );

  if (!tfg) return null;

  const activeSprint = sprints.find((s) => s.status === "activo");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => router.push("/tfgs")}
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Mis TFGs
            </button>
            <span className="text-xs text-[var(--muted-foreground)]">/</span>
            <span className="text-xs text-[var(--primary)] font-medium">{tfg.title}</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">{tfg.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              tfg.status === "activo"
                ? "bg-green-500/20 text-green-400"
                : "bg-[var(--muted)] text-[var(--muted-foreground)]"
            }`}>
              {tfg.status}
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">{tfg.academicYear}</span>
            <span className="text-xs text-[var(--muted-foreground)]">
              Tutor: {tfg.tutor?.name || "—"}
            </span>
            {activeSprint && (
              <span className="text-xs px-2 py-1 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] font-medium">
                {activeSprint.name} · Activo
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {tfg.repositoryUrl && (
            <a
              href={tfg.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
            >
              ⎇ Repo
            </a>
          )}
          {isProfessor(user?.role) && (
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition-opacity">
              ✦ Generar informe IA
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1 border-b border-[var(--border)]">
        {(["resumen", "sprints", "backlog", "evaluacion"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              if (t === "backlog") {
                router.push(`/tfgs/${id}/backlog`);
                return;
              }
              if (t === "evaluacion") {
                router.push(`/tfgs/${id}/grades`);
                return;
              }
              setTab(t);
            }}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {t === "evaluacion" ? "Evaluación IA" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "resumen" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
              <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">Descripción</h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                {tfg.description || "Sin descripción"}
              </p>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
              <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">Sprints</h2>
              {sprints.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">No hay sprints creados</p>
              ) : (
                <div className="space-y-2">
                  {sprints.map((sprint) => (
                    <div
                      key={sprint.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors cursor-pointer"
                      onClick={() => router.push(`/tfgs/${id}/sprints/${sprint.id}`)}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          sprint.status === "activo" ? "bg-green-500" :
                          sprint.status === "completado" ? "bg-gray-400" : "bg-yellow-500"
                        }`} />
                        <span className="text-sm font-medium text-[var(--foreground)]">{sprint.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {sprint.startDate ? new Date(sprint.startDate).toLocaleDateString("es-ES") : "—"}
                          {" → "}
                          {sprint.endDate ? new Date(sprint.endDate).toLocaleDateString("es-ES") : "—"}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          sprint.status === "activo"
                            ? "bg-green-500/20 text-green-400"
                            : sprint.status === "completado"
                            ? "bg-gray-500/20 text-gray-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {sprint.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
              <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">
                Equipo ({members.length})
              </h2>
              {members.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">Sin miembros</p>
              ) : (
                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold shrink-0">
                        {member.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{member.user.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {member.scrumRole || "Sin rol SCRUM"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {isProfessor(user?.role) && (
                <button className="mt-3 w-full px-3 py-2 rounded-lg border border-dashed border-[var(--border)] text-xs text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                  + Añadir miembro
                </button>
              )}
            </div>

            <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
              <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">Info</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--muted-foreground)]">Curso</span>
                  <span className="text-xs font-medium text-[var(--foreground)]">{tfg.academicYear || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--muted-foreground)]">Sprints</span>
                  <span className="text-xs font-medium text-[var(--foreground)]">{sprints.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--muted-foreground)]">Estado</span>
                  <span className="text-xs font-medium text-[var(--foreground)]">{tfg.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--muted-foreground)]">Repositorio</span>
                  <span className="text-xs font-medium text-[var(--foreground)]">
                    {tfg.repositoryUrl ? "Vinculado" : "Sin vincular"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "sprints" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold text-[var(--foreground)]">Sprints</h2>
            {isProfessor(user?.role) && (
              <button className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90">
                + Nuevo sprint
              </button>
            )}
          </div>
          {sprints.length === 0 ? (
            <div className="text-center py-16 bg-[var(--card)] rounded-xl border border-[var(--border)]">
              <p className="text-[var(--muted-foreground)]">No hay sprints creados</p>
            </div>
          ) : (
            sprints.map((sprint) => (
              <div
                key={sprint.id}
                className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--primary)] transition-colors cursor-pointer"
                onClick={() => router.push(`/tfgs/${id}/sprints/${sprint.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      sprint.status === "activo" ? "bg-green-500" :
                      sprint.status === "completado" ? "bg-gray-400" : "bg-yellow-500"
                    }`} />
                    <h3 className="font-semibold text-[var(--foreground)]">{sprint.name}</h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    sprint.status === "activo"
                      ? "bg-green-500/20 text-green-400"
                      : sprint.status === "completado"
                      ? "bg-gray-500/20 text-gray-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {sprint.status}
                  </span>
                </div>
                {sprint.goal && (
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">{sprint.goal}</p>
                )}
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-[var(--muted-foreground)]">
                    Inicio: {sprint.startDate ? new Date(sprint.startDate).toLocaleDateString("es-ES") : "—"}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    Fin: {sprint.endDate ? new Date(sprint.endDate).toLocaleDateString("es-ES") : "—"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}