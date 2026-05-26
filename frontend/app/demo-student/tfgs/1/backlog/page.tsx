"use client";

import { useState } from "react";
import { DEMO_STORIES } from "../../../data";

const statusColors: Record<string, string> = {
  backlog: "bg-gray-500",
  en_sprint: "bg-yellow-500",
  completada: "bg-green-500",
};

const statusLabels: Record<string, string> = {
  backlog: "Backlog",
  en_sprint: "En Sprint",
  completada: "Completada",
};

export default function DemoBacklogPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const totalPoints = DEMO_STORIES.reduce((acc, s) => acc + s.storyPoints, 0);
  const completedPoints = DEMO_STORIES.filter(s => s.status === "completada").reduce((acc, s) => acc + s.storyPoints, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Product Backlog</p>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Historias de usuario</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{DEMO_STORIES.length} historias Â· {completedPoints}/{totalPoints} story points completados</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: DEMO_STORIES.length },
          { label: "En Backlog", value: DEMO_STORIES.filter(s => s.status === "backlog").length },
          { label: "En Sprint", value: DEMO_STORIES.filter(s => s.status === "en_sprint").length },
          { label: "Completadas", value: DEMO_STORIES.filter(s => s.status === "completada").length },
        ].map(stat => (
          <div key={stat.label} className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">{stat.label}</p>
            <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {DEMO_STORIES.sort((a, b) => a.priority - b.priority).map(story => (
          <div key={story.id} className="bg-[var(--card)] rounded-xl border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors">
            <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpanded(expanded === story.id ? null : story.id)}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xs text-[var(--muted-foreground)] font-mono shrink-0">#{story.priority}</span>
                <span className={`w-2 h-2 rounded-full shrink-0 ${statusColors[story.status]}`} />
                <p className="text-sm font-medium text-[var(--foreground)] truncate">{story.title}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="text-xs px-2 py-1 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] font-medium">{story.storyPoints} SP</span>
                <span className="text-xs text-[var(--muted-foreground)]">{statusLabels[story.status]}</span>
                <span className="text-xs text-[var(--muted-foreground)]">{expanded === story.id ? "â–²" : "â–¼"}</span>
              </div>
            </div>
            {expanded === story.id && (
              <div className="px-4 pb-4 space-y-3 border-t border-[var(--border)] pt-3">
                <div>
                  <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-1">DescripciÃ³n</p>
                  <p className="text-sm text-[var(--foreground)]">{story.description}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-1">Criterios de aceptaciÃ³n</p>
                  <p className="text-sm text-[var(--foreground)]">{story.acceptanceCriteria}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

