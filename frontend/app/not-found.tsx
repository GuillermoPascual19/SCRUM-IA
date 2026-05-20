"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, ArrowLeft, GitBranch, AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const stackTrace = [
  { file: "router/resolve.ts", line: 42, fn: "matchRoute()" },
  { file: "router/index.ts", line: 118, fn: "navigate()" },
  { file: "app/main.tsx", line: 24, fn: "render()" },
];

export default function NotFound() {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0f0a] text-white font-sans">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[#22c55e]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <div className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/5">
              <Terminal className="h-4 w-4 text-[#22c55e]" />
            </div>
            SCRUM-IA
          </Link>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-gray-500">
            <GitBranch className="h-3.5 w-3.5" />
            main
            <span className="text-white/20">·</span>
            <span className="text-red-400">error</span>
          </div>
        </header>

        <main className="grid flex-1 grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-red-400">
              <AlertTriangle className="h-3 w-3" />
              HTTP 404 · Route not found
            </div>

            <div className="relative">
              <h1 className="text-[140px] font-bold leading-none tracking-tighter sm:text-[200px]">
                <span className="bg-gradient-to-br from-[#22c55e] via-white to-white/50 bg-clip-text text-transparent">
                  404
                </span>
              </h1>
              <div className="absolute -top-2 right-2 hidden font-mono text-[10px] uppercase tracking-widest text-gray-600 sm:block">
                // unresolved_ref
              </div>
            </div>

            <div className="max-w-md space-y-3">
              <p className="text-2xl font-semibold leading-tight">Sprint sin commits. Ruta sin destino.</p>
              <p className="text-sm leading-relaxed text-gray-500">
                El recurso que buscas no existe en este backlog. Quizá fue movido a otro sprint,
                archivado, o nunca llegó a hacer merge en{" "}
                <span className="font-mono text-white">main</span>.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 bg-[#22c55e] text-black hover:bg-[#16a34a]">
                <Link href="/"><Home className="h-4 w-4" />Volver al inicio</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/5">
                <Link href="/dashboard"><ArrowLeft className="h-4 w-4" />Ir al dashboard</Link>
              </Button>
              <Button size="lg" variant="ghost" className="gap-2 text-white hover:bg-white/5" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4" />Reintentar
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-white/10 backdrop-blur-md bg-white/5">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]/80" />
              </div>
              <div className="font-mono text-[11px] text-gray-500">~/scrum-ia/router/resolve.ts</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-red-400">exit 404</div>
            </div>

            <div className="space-y-4 p-5 font-mono text-[13px] leading-relaxed">
              <div>
                <span className="text-[#22c55e]">$</span>{" "}
                <span className="text-gray-500">router.resolve</span>
                <span className="text-white">(</span>
                <span className="text-yellow-400">"{pathname && pathname.length > 38 ? pathname.slice(0, 35) + "…" : pathname}"</span>
                <span className="text-white">)</span>
              </div>

              <div className="rounded-md border border-red-500/30 bg-red-500/5 p-3">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">RouteNotFoundError</span>
                </div>
                <p className="mt-1.5 text-xs text-white/80">No matching route found for the requested path.</p>
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500">stack trace</div>
                {stackTrace.map((s, i) => (
                  <div key={i} className="flex items-baseline gap-3 text-xs">
                    <span className="w-4 text-gray-600">{i + 1}</span>
                    <span className="text-[#22c55e]">{s.fn}</span>
                    <span className="text-gray-600">at</span>
                    <span className="text-white/80">{s.file}</span>
                    <span className="text-gray-600">:{s.line}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-3">
                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500">suggested action</div>
                <div className="mt-1.5 text-xs">
                  <span className="text-[#22c55e]">→</span>{" "}
                  <span className="text-white">git checkout </span>
                  <span className="text-[#22c55e]">main</span>
                  <span className="text-white"> && cd </span>
                  <span className="text-[#22c55e]">~/dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[11px] text-gray-600">
          <span>SCRUM-IA · academic agile platform</span>
          <span>sprint <span className="text-white">#12</span> · build <span className="text-white">stable</span></span>
        </footer>
      </div>
    </div>
  );
}
