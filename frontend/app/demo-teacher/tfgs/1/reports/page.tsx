"use client";

import { useState } from "react";
import { DEMO_REPORT } from "../../../data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function ReportContent({ content }: { content: string }) {
  return (
    <div className="space-y-1">
      {content.split("\n").map((line, i) => {
        if (line.startsWith("## ") || line.startsWith("# "))
          return <p key={i} className="font-semibold text-[var(--foreground)] mt-4 mb-1">{line.replace(/^#+\s/, "")}</p>;
        if (line.startsWith("**") && line.endsWith("**"))
          return <p key={i} className="text-sm font-semibold text-[var(--foreground)] mt-2">{line.replace(/\*\*/g, "")}</p>;
        if (line.match(/^\*\*.*\*\*/))
          return <p key={i} className="text-sm text-[var(--foreground)]" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />;
        if (line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3."))
          return <p key={i} className="text-sm text-[var(--muted-foreground)] pl-3">{line}</p>;
        if (line.trim() === "") return <div key={i} className="h-2" />;
        return <p key={i} className="text-sm text-[var(--muted-foreground)] leading-relaxed">{line}</p>;
      })}
    </div>
  );
}

export default function DemoTeacherReportsPage() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 2500);
  }

  function handleCopy() {
    navigator.clipboard.writeText(DEMO_REPORT.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1">Informes IA</p>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Informe global del TFG</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Genera y consulta el historial de informes ejecutivos del proyecto.</p>
      </div>

      {/* Generador */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--primary)]/30 p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
            <span className="text-[var(--primary)]">✦</span> Generar informe global con IA
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Claude analizará todas las evaluaciones y producirá un informe ejecutivo guardado en el historial.
          </p>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          placeholder="Instrucción adicional (opcional) — ej: 'Enfócate en la evolución del equipo'"
          className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] resize-none"
        />
        <button
          onClick={handleGenerate}
          disabled={generating || generated}
          className="px-6 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center gap-2 transition-opacity"
        >
          {generating ? <><span className="animate-spin inline-block">⟳</span> Generando informe...</> : generated ? "✓ Informe generado" : <><span>✦</span> Generar informe global</>}
        </button>
      </div>

      {/* Historial + lector */}
      <div className="grid grid-cols-[220px_1fr] gap-4 items-start">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider px-1 mb-3">Historial (1)</p>
          <div className="relative group rounded-lg border border-[var(--primary)] bg-[var(--primary)]/10 p-3">
            <p className="text-xs font-medium text-[var(--foreground)]">{formatDate(DEMO_REPORT.createdAt)}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Dra. Carmen Navarro</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2 opacity-70">
              {DEMO_REPORT.content.slice(0, 80)}…
            </p>
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-start justify-between mb-5 gap-4">
            <div>
              <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">Informe seleccionado</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">{formatDate(DEMO_REPORT.createdAt)} · generado por Dra. Carmen Navarro</p>
            </div>
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1.5 rounded-md border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors shrink-0"
            >
              {copied ? "✓ Copiado" : "Copiar"}
            </button>
          </div>
          <ReportContent content={DEMO_REPORT.content} />
        </div>
      </div>
    </div>
  );
}
