"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Tfg, Sprint, TfgMember } from "@/lib/types";
import { useAuthStore } from "@/store/auth.store";
import { useTfgStore } from "@/store/tfg.store";

type Tab = "resumen" | "sprints" | "backlog" | "evaluacion";

function isProfessor(role?: string) {
  return role === "teacher" || role === "coordinator" || role === "admin";
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
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState("developer");
  const [addingMember, setAddingMember] = useState(false);
  const [memberError, setMemberError] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: number; name: string; email: string; role: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string; email: string } | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => { fetchData(); }, [id]);

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

  async function searchUsers(q: string) {
    setMemberEmail(q);
    setSelectedUser(null);
    if (q.length < 2) { setSearchResults([]); setSearchOpen(false); return; }
    try {
      const { data } = await api.get(`/auth/search-users?q=${encodeURIComponent(q)}`);
      setSearchResults(data);
      setSearchOpen(data.length > 0);
    } catch {
      setSearchResults([]);
    }
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    setMemberError("");
    if (!selectedUser) { setMemberError("Selecciona un usuario de la lista"); return; }
    setAddingMember(true);
    try {
      await api.post(`/tfgs/${id}/members`, {
        userId: selectedUser.id,
        scrumRole: memberRole,
      });
      setShowAddMember(false);
      setMemberEmail("");
      setSelectedUser(null);
      setMemberRole("developer");
      fetchData();
    } catch {
      setMemberError("El usuario ya es miembro del TFG");
    } finally {
      setAddingMember(false);
    }
  }

  async function handleRemoveMember(userId: number) {
    try {
      await api.delete(`/tfgs/${id}/members/${userId}`);
      fetchData();
    } catch {
      console.error("Error al eliminar miembro");
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full text-[var(--muted-foreground)]">Cargando...</div>
  );

  if (!tfg) return null;

  const activeSprint = sprints.find((s) => s.status === "activo");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button onClick={() => router.push("/tfgs")}
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              Mis TFGs
            </button>
            <span className="text-xs text-[var(--muted-foreground)]">/</span>
            <span className="text-xs text-[var(--primary)] font-medium">{tfg.title}</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">{tfg.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              tfg.status === "activo" ? "bg-green-500/20 text-green-400" : "bg-[var(--muted)] text-[var(--muted-foreground)]"
            }`}>{tfg.status}</span>
            <span className="text-xs text-[var(--muted-foreground)]">{tfg.academicYear}</span>
            <span className="text-xs text-[var(--muted-foreground)]">Tutor: {tfg.tutor?.name || "—"}</span>
            {activeSprint && (
              <span className="text-xs px-2 py-1 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] font-medium">
                {activeSprint.name} · Activo
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {tfg.repositoryUrl && (
            <a href={tfg.repositoryUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors">
              ⎇ Repo
            </a>
          )}
          {isProfessor(user?.role) && (
            <button
              onClick={() => router.push(`/tfgs/${id}/reports`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 transition-opacity">
              ✦ Informes IA
            </button>

          )}
        </div>
      </div>

      <div className="flex gap-1 border-b border-[var(--border)]">
        {(["resumen", "sprints", "backlog", "evaluacion"] as Tab[]).map((t) => (
          <button key={t}
            onClick={() => {
              if (t === "backlog") { router.push(`/tfgs/${id}/backlog`); return; }
              if (t === "evaluacion") { router.push(`/tfgs/${id}/grades`); return; }
              setTab(t);
            }}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? "border-[var(--primary)] text-[var(--primary)]" : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}>
            {t === "evaluacion" ? "Evaluación IA" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "resumen" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
              <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">Descripción</h2>
              <p className="text-sm text-[var(--muted-foreground)]">{tfg.description || "Sin descripción"}</p>
            </div>
            <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
              <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">Sprints</h2>
              {sprints.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">No hay sprints creados</p>
              ) : (
                <div className="space-y-2">
                  {sprints.map((sprint) => (
                    <div key={sprint.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors cursor-pointer"
                      onClick={() => router.push(`/tfgs/${id}/sprints/${sprint.id}`)}>
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
                          sprint.status === "activo" ? "bg-green-500/20 text-green-400" :
                          sprint.status === "completado" ? "bg-gray-500/20 text-gray-400" :
                          "bg-yellow-500/20 text-yellow-400"
                        }`}>{sprint.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
              <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">Equipo ({members.length})</h2>
              {members.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">Sin miembros</p>
              ) : (
                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold shrink-0">
                        {member.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--foreground)]">{member.user.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{member.scrumRole || "Sin rol SCRUM"}</p>
                      </div>
                      {isProfessor(user?.role) && (
                        <button
                          onClick={() => handleRemoveMember(member.userId)}
                          className="opacity-0 group-hover:opacity-100 text-[var(--muted-foreground)] hover:text-red-500 transition-all text-xs px-1.5 py-1 rounded hover:bg-red-500/10"
                          title="Eliminar miembro"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {isProfessor(user?.role) && (
                <button onClick={() => setShowAddMember(true)}
                  className="mt-3 w-full px-3 py-2 rounded-lg border border-dashed border-[var(--border)] text-xs text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
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
              <button onClick={() => router.push(`/tfgs/${id}/planner`)}
                className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90">
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
              <div key={sprint.id}
                className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--primary)] transition-colors cursor-pointer"
                onClick={() => router.push(`/tfgs/${id}/sprints/${sprint.id}`)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      sprint.status === "activo" ? "bg-green-500" :
                      sprint.status === "completado" ? "bg-gray-400" : "bg-yellow-500"
                    }`} />
                    <h3 className="font-semibold text-[var(--foreground)]">{sprint.name}</h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    sprint.status === "activo" ? "bg-green-500/20 text-green-400" :
                    sprint.status === "completado" ? "bg-gray-500/20 text-gray-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>{sprint.status}</span>
                </div>
                {sprint.goal && <p className="text-sm text-[var(--muted-foreground)] mt-2">{sprint.goal}</p>}
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

      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] rounded-xl p-6 w-full max-w-md border border-[var(--border)] space-y-4">
            <h2 className="text-base font-semibold text-[var(--foreground)]">Añadir miembro al TFG</h2>
            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">Buscar usuario</label>
                <div className="relative">
                  <input type="text" value={memberEmail}
                    onChange={(e) => searchUsers(e.target.value)}
                    onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                    onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
                    className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                    placeholder="Escribe nombre o email..."
                    autoComplete="off"
                  />
                  {searchOpen && searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden">
                      {searchResults.map((u) => (
                        <button key={u.id} type="button"
                          onClick={() => { setSelectedUser(u); setMemberEmail(u.email); setSearchOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[var(--accent)] transition-colors text-left">
                          <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--foreground)]">{u.name}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">{u.email}</p>
                          </div>
                          <span className="ml-auto text-xs text-[var(--muted-foreground)]">{u.role}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {selectedUser && (
                  <p className="mt-1 text-xs text-[var(--primary)]">✓ Seleccionado: {selectedUser.name}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">Rol SCRUM</label>
                <select value={memberRole} onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]">
                  <option value="developer">Developer</option>
                  <option value="scrum_master">Scrum Master</option>
                  <option value="product_owner">Product Owner</option>
                </select>
              </div>
              {memberError && (
                <p className="text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">{memberError}</p>
              )}
              <div className="flex gap-2">
                <button type="submit" disabled={addingMember}
                  className="flex-1 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {addingMember ? "Añadiendo..." : "Añadir miembro"}
                </button>
                <button type="button" onClick={() => { setShowAddMember(false); setMemberError(""); setSelectedUser(null); setMemberEmail(""); }}
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
