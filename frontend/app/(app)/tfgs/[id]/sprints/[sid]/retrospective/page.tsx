"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import {
  ArrowRight, CheckCircle2, GitBranch, Heart, Lightbulb,
  ListChecks, MessageSquarePlus, Plus, Smile, Sparkles,
  Terminal, ThumbsDown, ThumbsUp, TrendingUp, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ColumnKey = "went_well" | "to_improve" | "action_items";

interface Note {
  id: string;
  text: string;
  author: string;
  votes: number;
}

const emptyNotes: Record<ColumnKey, Note[]> = {
  went_well: [],
  to_improve: [],
  action_items: [],
};

const columnMeta: Record<ColumnKey, {
  title: string;
  cmd: string;
  icon: typeof ThumbsUp;
  tone: string;
  accent: string;
}> = {
  went_well: {
    title: "went_well",
    cmd: "git log --good",
    icon: ThumbsUp,
    tone: "text-[#22c55e]",
    accent: "bg-[#22c55e]/10 border-[#22c55e]/30",
  },
  to_improve: {
    title: "to_improve",
    cmd: "git diff HEAD~1",
    icon: ThumbsDown,
    tone: "text-yellow-400",
    accent: "bg-yellow-400/10 border-yellow-400/30",
  },
  action_items: {
    title: "action_items",
    cmd: "git commit -m 'fix'",
    icon: ListChecks,
    tone: "text-[var(--primary)]",
    accent: "bg-[var(--primary)]/10 border-[var(--primary)]/30",
  },
};

const moodSeries = [
  { d: "L", v: 6 }, { d: "M", v: 7 }, { d: "X", v: 5 },
  { d: "J", v: 8 }, { d: "V", v: 9 }, { d: "S", v: 8 }, { d: "D", v: 9 },
];

function Metric({ icon: Icon, label, value, tone, suffix }: {
  icon: typeof ThumbsUp;
  label: string;
  value: number;
  tone: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--background)]/40 p-4">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${tone}`} />
        <span className="font-mono text-[11px] text-[var(--muted-foreground)]">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">
        {value}{suffix && <span className="text-base text-[var(--muted-foreground)]">{suffix}</span>}
      </p>
    </div>
  );
}

export default function RetrospectivePage() {
  const { id, sid } = useParams();
  const { user } = useAuthStore();

  const [notes, setNotes] = useState<Record<ColumnKey, Note[]>>(emptyNotes);
  const [drafts, setDrafts] = useState<Record<ColumnKey, string>>({ went_well: "", to_improve: "", action_items: "" });
  const [sprintName, setSprintName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<{ tipo: string; texto: string }[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  function tryParse(val: string | null): Note[] {
    if (!val) return [];
    try { return JSON.parse(val); } catch { return []; }
  }

  async function fetchData() {
    try {
      const { data: sprint } = await api.get(`/tfgs/${id}/sprints/${sid}`);
      setSprintName(sprint.name);

      const { data: retro } = await api.get(`/tfgs/${id}/sprints/${sid}/retrospective`);
      if (retro) {
        setNotes({
          went_well: tryParse(retro.wentWell),
          to_improve: tryParse(retro.toImprove),
          action_items: tryParse(retro.actions),
        });
      }
    } catch {
      // no retrospective yet
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [sid]);

  async function handleSave() {
    setSaving(true);
    try {
      await api.post(`/tfgs/${id}/sprints/${sid}/retrospective`, {
        wentWell: JSON.stringify(notes.went_well),
        toImprove: JSON.stringify(notes.to_improve),
        actions: JSON.stringify(notes.action_items),
      });
    } catch {
      console.error("Error al guardar retrospectiva");
    } finally {
      setSaving(false);
    }
  }

  async function handleInsights() {
    setLoadingInsights(true);
    try {
      const { data } = await api.get(`/tfgs/${id}/evaluations/retro-insights/${sid}`);
      setInsights(data);
    } catch {
      console.error("Error al generar insights");
    } finally {
      setLoadingInsights(false);
    }
  }

  function add(key: ColumnKey) {
    const text = drafts[key].trim();
    if (!text) return;
    const note: Note = {
      id: crypto.randomUUID(),
      text,
      author: user?.name || "Tú",
      votes: 0,
    };
    setNotes((n) => ({ ...n, [key]: [note, ...n[key]] }));
    setDrafts((d) => ({ ...d, [key]: "" }));
  }

  function vote(key: ColumnKey, noteId: string, delta: number) {
    setNotes((n) => ({
      ...n,
      [key]: n[key].map((it) => it.id === noteId ? { ...it, votes: Math.max(0, it.votes + delta) } : it),
    }));
  }

  function remove(key: ColumnKey, noteId: string) {
    setNotes((n) => ({ ...n, [key]: n[key].filter((it) => it.id !== noteId) }));
  }

  const totals = useMemo(() => ({
    went_well: notes.went_well.length,
    to_improve: notes.to_improve.length,
    action_items: notes.action_items.length,
  }), [notes]);

  if (loading) return (
    <div className="flex items-center justify-center h-full text-[var(--muted-foreground)]">Cargando...</div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">
            {sprintName} · Retrospectiva
          </p>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Retrospectiva del sprint</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Lo que celebramos, lo que mejoramos y los compromisos para el próximo sprint.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-[var(--border)] text-[var(--foreground)]"
            onClick={handleInsights} disabled={loadingInsights}>
            <Sparkles className="w-4 h-4" />
            {loadingInsights ? "Analizando..." : "Insights IA"}
          </Button>
          <Button size="sm" className="gap-2 bg-[var(--primary)] text-[var(--primary-foreground)]"
            onClick={handleSave} disabled={saving}>
            <CheckCircle2 className="w-4 h-4" /> {saving ? "Guardando..." : "Guardar retro"}
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--background)]/40 px-4 py-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/80" />
          <p className="ml-3 font-mono text-xs text-[var(--muted-foreground)]">~/scrum-ia/sprints/{sid}/retro.md</p>
          <span className="ml-auto flex items-center gap-1.5 rounded-md bg-[var(--accent)] px-2 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)]">
            <GitBranch className="w-3 h-3" /> main · open
          </span>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5">
          <Metric icon={ThumbsUp} label="went_well" value={totals.went_well} tone="text-[#22c55e]" />
          <Metric icon={ThumbsDown} label="to_improve" value={totals.to_improve} tone="text-yellow-400" />
          <Metric icon={ListChecks} label="action_items" value={totals.action_items} tone="text-[var(--primary)]" />
          <Metric icon={Heart} label="team_mood" value={7.4} suffix="/10" tone="text-purple-400" />
          <Metric icon={Smile} label="participants" value={5} tone="text-[var(--foreground)]" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {(Object.keys(columnMeta) as ColumnKey[]).map((key) => {
          const meta = columnMeta[key];
          const Icon = meta.icon;
          return (
            <section key={key} className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)]/40">
              <header className={`flex items-center justify-between rounded-t-xl border-b border-[var(--border)] ${meta.accent} px-4 py-3`}>
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${meta.tone}`} />
                  <h3 className="font-mono text-sm font-bold text-[var(--foreground)]">{meta.title}</h3>
                </div>
                <span className="rounded-full bg-[var(--background)]/60 px-2 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)]">
                  {notes[key].length}
                </span>
              </header>
              <div className="space-y-3 p-3">
                <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--background)]/30 p-2">
                  <div className="mb-1 flex items-center gap-2 px-1">
                    <Terminal className="w-3 h-3 text-[var(--muted-foreground)]" />
                    <span className="font-mono text-[10px] text-[var(--muted-foreground)]">$ {meta.cmd}</span>
                  </div>
                  <textarea
                    value={drafts[key]}
                    onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) add(key); }}
                    placeholder="Escribe una nota… (⌘/Ctrl + Enter)"
                    rows={2}
                    className="w-full resize-none rounded-md bg-transparent px-2 py-1 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/70 focus:outline-none"
                  />
                  <div className="flex items-center justify-end">
                    <Button size="sm" onClick={() => add(key)} disabled={!drafts[key].trim()}
                      className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90">
                      <Plus className="w-3.5 h-3.5" /> Añadir
                    </Button>
                  </div>
                </div>
                {notes[key].map((n) => (
                  <article key={n.id}
                    className="group relative rounded-lg border border-[var(--border)] bg-[var(--background)]/60 p-3 transition hover:-translate-y-0.5 hover:border-[var(--primary)]/60">
                    <p className="pr-6 text-sm leading-snug text-[var(--foreground)]">{n.text}</p>
                    <button onClick={() => remove(key, n.id)}
                      className="absolute right-2 top-2 rounded p-1 text-[var(--muted-foreground)]/60 opacity-0 transition group-hover:opacity-100 hover:bg-[var(--accent)] hover:text-[var(--foreground)]">
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="grid w-6 h-6 place-items-center rounded-full bg-[var(--primary)]/15 text-[10px] font-bold text-[var(--primary)]">
                          {n.author.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-mono text-[10px] text-[var(--muted-foreground)]">@{n.author.toLowerCase().replace(" ", "")}</span>
                      </div>
                      {key !== "action_items" ? (
                        <div className="flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--accent)]/40 px-1.5 py-0.5">
                          <button onClick={() => vote(key, n.id, -1)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">−</button>
                          <span className="min-w-4 text-center font-mono text-[11px] font-bold text-[var(--foreground)]">{n.votes}</span>
                          <button onClick={() => vote(key, n.id, 1)} className="text-[var(--primary)] hover:opacity-80">+</button>
                        </div>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-2 py-0.5 font-mono text-[10px] text-[var(--primary)]">
                          <ArrowRight className="w-3 h-3" /> sprint+1
                        </span>
                      )}
                    </div>
                  </article>
                ))}
                {notes[key].length === 0 && (
                  <p className="rounded-lg border border-dashed border-[var(--border)] py-6 text-center font-mono text-xs text-[var(--muted-foreground)]">
                    {"// empty — sé el primero en aportar"}
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-[var(--foreground)]">Pulso del equipo</h2>
            </div>
            <span className="font-mono text-[11px] text-[var(--muted-foreground)]">daily_mood</span>
          </div>
          <div className="flex h-44 items-end gap-3">
            {moodSeries.map((p) => (
              <div key={p.d} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-md bg-gradient-to-t from-[var(--primary)]/30 to-[var(--primary)] transition-all hover:opacity-80"
                  style={{ height: `${(p.v / 10) * 100}%` }} title={`${p.v}/10`} />
                <span className="font-mono text-[10px] text-[var(--muted-foreground)]">{p.d}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#22c55e]" /> +1,4 vs sprint anterior
            </span>
            <span className="font-mono">avg = 7.4 / 10</span>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md p-5">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-bold text-[var(--foreground)]">Insights de la IA</h2>
          </div>
          {insights.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-[var(--muted-foreground)] mb-3">
                Pulsa &quot;Insights IA&quot; para analizar el sprint con Claude
              </p>
              <Button variant="outline" size="sm" onClick={handleInsights} disabled={loadingInsights}
                className="gap-2 border-[var(--border)] text-[var(--foreground)]">
                <Sparkles className="w-4 h-4" />
                {loadingInsights ? "Analizando..." : "Generar insights"}
              </Button>
            </div>
          ) : (
            <ul className="space-y-3 text-sm">
              {insights.map((i, idx) => (
                <li key={idx} className="rounded-lg border border-[var(--border)] bg-[var(--background)]/40 p-3">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
                    <MessageSquarePlus className="w-3.5 h-3.5" />{i.tipo}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">{i.texto}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 p-5">
        <div className="mb-4 flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-[var(--primary)]" />
          <h2 className="text-lg font-bold text-[var(--foreground)]">Plan de acción · próximo sprint</h2>
        </div>
        <div className="overflow-hidden rounded-lg border border-[var(--border)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--accent)]/40 font-mono text-[11px] uppercase tracking-wider text-[var(--muted-foreground)]">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Compromiso</th>
                <th className="px-4 py-2">Responsable</th>
                <th className="px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {notes.action_items.map((a, idx) => (
                <tr key={a.id} className="border-t border-[var(--border)] hover:bg-[var(--background)]/40">
                  <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)]">AC-{(idx + 1).toString().padStart(2, "0")}</td>
                  <td className="px-4 py-3 text-[var(--foreground)]">{a.text}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-[var(--primary)]/10 px-2 py-0.5 font-mono text-[11px] text-[var(--primary)]">
                      @{a.author.toLowerCase().replace(" ", "")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400/15 px-2 py-0.5 text-[11px] font-semibold text-yellow-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> pendiente
                    </span>
                  </td>
                </tr>
              ))}
              {notes.action_items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-xs text-[var(--muted-foreground)]">
                    Aún no hay compromisos. Añade alguno desde la columna <span className="font-mono">action_items</span>.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
