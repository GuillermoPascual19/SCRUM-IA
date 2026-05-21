import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "../lib/prisma";

const client = new Anthropic({ apiKey: process.env.AI_API_KEY });

export async function generateEvaluation(
  tfgId: number,
  sprintId: number,
  studentId: number,
  professorId: number
) {
  const [tfg, sprint, student, commits, tasks] = await Promise.all([
    prisma.tfg.findUnique({ where: { id: tfgId }, select: { title: true } }),
    prisma.sprint.findUnique({ where: { id: sprintId }, select: { name: true, goal: true, startDate: true, endDate: true } }),
    prisma.user.findUnique({ where: { id: studentId }, select: { name: true, email: true } }),
    prisma.commit.findMany({
      where: { tfgId, sprintId, studentId },
      orderBy: { date: "asc" },
    }),
    prisma.task.findMany({
      where: { sprintId, assignedTo: studentId },
      select: { title: true, status: true, estimatedHours: true, actualHours: true },
    }),
  ]);

  if (!tfg || !sprint || !student) throw new Error("DATA_NOT_FOUND");

  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length;

  const prompt = `Eres un evaluador académico experto en metodología SCRUM y desarrollo de software. 
Analiza la actividad del siguiente estudiante en su TFG y genera una evaluación detallada.

## Contexto
- **Proyecto TFG:** ${tfg.title}
- **Sprint:** ${sprint.name}
- **Objetivo del sprint:** ${sprint.goal || "No especificado"}
- **Periodo:** ${sprint.startDate ? new Date(sprint.startDate).toLocaleDateString("es-ES") : "?"} - ${sprint.endDate ? new Date(sprint.endDate).toLocaleDateString("es-ES") : "?"}
- **Estudiante:** ${student.name} (${student.email})

## Actividad en commits (${commits.length} commits)
${commits.map((c) => `- [${new Date(c.date).toLocaleDateString("es-ES")}] ${c?.message?.split("\n")[0]} (+${c.linesAdded}/-${c.linesDeleted}, ${c.filesChanged} archivos)`).join("\n") || "Sin commits en este sprint"}

## Tareas asignadas (${doneTasks}/${totalTasks} completadas)
${tasks.map((t) => `- [${t.status === "done" ? "✓" : t.status === "in_progress" ? "⏳" : "○"}] ${t.title} (estimado: ${t.estimatedHours || "?"}h, real: ${t.actualHours || "?"}h)`).join("\n") || "Sin tareas asignadas"}

## Instrucciones
Evalúa del 0 al 10 los siguientes aspectos y devuelve ÚNICAMENTE un JSON válido con esta estructura exacta:

{
  "commitsScore": <número 0-10>,
  "tasksScore": <número 0-10>,
  "finalScore": <número 0-10>,
  "strengths": ["punto fuerte 1", "punto fuerte 2", "punto fuerte 3"],
  "improvements": ["mejora 1", "mejora 2", "mejora 3"],
  "comments": "Feedback detallado de 3-4 frases sobre el rendimiento del estudiante en este sprint"
}

Criterios de evaluación:
- commitsScore: frecuencia, calidad de mensajes, volumen de cambios, consistencia
- tasksScore: porcentaje de tareas completadas, estimaciones vs tiempo real
- finalScore: nota global del sprint considerando ambos aspectos`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("AI_INVALID_RESPONSE");

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI_INVALID_JSON");

  const result = JSON.parse(jsonMatch[0]);

  const existing = await prisma.evaluation.findFirst({
    where: { tfgId, sprintId, studentId },
  });

  if (existing) {
    return prisma.evaluation.update({
      where: { id: existing.id },
      data: {
        commitsScore: result.commitsScore,
        tasksScore: result.tasksScore,
        finalScore: result.finalScore,
        strengths: JSON.stringify(result.strengths),
        improvements: JSON.stringify(result.improvements),
        comments: result.comments,
        aiGenerated: true,
        reviewedByProfessor: false,
        professorId,
      },
    });
  }

  return prisma.evaluation.create({
    data: {
      tfgId,
      sprintId,
      studentId,
      professorId,
      commitsScore: result.commitsScore,
      tasksScore: result.tasksScore,
      finalScore: result.finalScore,
      strengths: JSON.stringify(result.strengths),
      improvements: JSON.stringify(result.improvements),
      comments: result.comments,
      aiGenerated: true,
    },
  });
}

export async function getEvaluationsByTfg(tfgId: number) {
  return prisma.evaluation.findMany({
    where: { tfgId },
    include: {
      student: { select: { id: true, name: true, email: true } },
      sprint: { select: { id: true, name: true } },
      professor: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateEvaluation(
  id: number,
  data: {
    finalScore?: number;
    comments?: string;
    weight?: number;
  }
) {
  return prisma.evaluation.update({
    where: { id },
    data: { ...data, reviewedByProfessor: true },
  });
}

export async function generateFinalGrade(tfgId: number, studentId: number, professorId: number) {
  const evaluations = await prisma.evaluation.findMany({
    where: { tfgId, studentId },
    include: { sprint: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
  });

  if (evaluations.length === 0) throw new Error("NO_EVALUATIONS");

  const validScores = evaluations
    .filter((e) => e.finalScore !== null)
    .map((e) => parseFloat(String(e.finalScore)));

  const average = validScores.reduce((a, b) => a + b, 0) / validScores.length;

  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: { name: true },
  });

  const tfg = await prisma.tfg.findUnique({
    where: { id: tfgId },
    select: { title: true },
  });

  const prompt = `Eres un evaluador académico experto. Resume el rendimiento global de un estudiante en su TFG.

## Datos
- **Proyecto:** ${tfg?.title}
- **Estudiante:** ${student?.name}
- **Evaluaciones por sprint:**
${evaluations.map((e) => `  - ${e.sprint.name}: nota ${e.finalScore ?? "sin nota"} — ${e.comments?.slice(0, 100)}...`).join("\n")}
- **Media de sprints:** ${average.toFixed(2)}

Genera un resumen global del trabajo del estudiante durante todo el TFG.
Devuelve ÚNICAMENTE un JSON válido:

{
  "finalScore": <número 0-10, puede ajustar ligeramente la media si hay tendencia clara>,
  "finalComment": "Valoración global de 4-5 frases sobre el rendimiento total del estudiante durante el TFG"
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("AI_INVALID_RESPONSE");

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI_INVALID_JSON");

  const result = JSON.parse(jsonMatch[0]);

  const existing = await prisma.tfgFinalGrade.findUnique({
    where: { tfgId_studentId: { tfgId, studentId } },
  });

  if (existing) {
    return prisma.tfgFinalGrade.update({
      where: { id: existing.id },
      data: {
        sprintsAverage: average,
        finalScore: result.finalScore,
        finalComment: result.finalComment,
        aiGenerated: true,
        reviewedByProfessor: false,
        professorId,
      },
    });
  }

  return prisma.tfgFinalGrade.create({
    data: {
      tfgId,
      studentId,
      professorId,
      sprintsAverage: average,
      finalScore: result.finalScore,
      finalComment: result.finalComment,
      aiGenerated: true,
    },
  });
}

export async function getFinalGradesByTfg(tfgId: number) {
  return prisma.tfgFinalGrade.findMany({
    where: { tfgId },
    include: {
      student: { select: { id: true, name: true, email: true } },
      professor: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateFinalGrade(id: number, data: { finalScore?: number; finalComment?: string }) {
  return prisma.tfgFinalGrade.update({
    where: { id },
    data: { ...data, reviewedByProfessor: true },
  });
}

export async function generateRetroInsights(
  tfgId: number,
  sprintId: number
) {
  const [sprint, commits, tasks, retro] = await Promise.all([
    prisma.sprint.findUnique({
      where: { id: sprintId },
      select: { name: true, startDate: true, endDate: true },
    }),
    prisma.commit.findMany({
      where: { tfgId, sprintId },
      include: { student: { select: { name: true } } },
    }),
    prisma.task.findMany({
      where: { sprintId },
      include: { assignee: { select: { name: true } } },
    }),
    prisma.retrospective.findUnique({
      where: { sprintId },
    }),
  ]);

  if (!sprint) throw new Error("SPRINT_NOT_FOUND");

  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const commitsByAuthor: Record<string, number> = {};
  commits.forEach((c) => {
    const name = c.student?.name || "desconocido";
    commitsByAuthor[name] = (commitsByAuthor[name] || 0) + 1;
  });

  let retroNotes = "";
  if (retro) {
    const wentWell = tryParseNotes(retro.wentWell);
    const toImprove = tryParseNotes(retro.toImprove);
    retroNotes = `
Cosas que fueron bien: ${wentWell.map((n: any) => n.text).join(", ") || "ninguna registrada"}
Cosas a mejorar: ${toImprove.map((n: any) => n.text).join(", ") || "ninguna registrada"}`;
  }

  const prompt = `Eres un coach ágil experto. Analiza los datos de este sprint y genera exactamente 3 insights accionables para el equipo.

SPRINT: ${sprint.name}
COMMITS: ${commits.length} commits en total
COMMITS POR PERSONA: ${Object.entries(commitsByAuthor).map(([k, v]) => `${k}: ${v}`).join(", ") || "sin datos"}
TAREAS: ${doneTasks}/${tasks.length} completadas
${retroNotes}

Devuelve ÚNICAMENTE un JSON válido con esta estructura:
[
  { "tipo": "Patrón detectado", "texto": "..." },
  { "tipo": "Riesgo identificado", "texto": "..." },
  { "tipo": "Recomendación", "texto": "..." }
]

Sé específico con los datos reales. Máximo 2 frases por insight.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("AI_INVALID_RESPONSE");

  const jsonMatch = content.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("AI_INVALID_JSON");

  return JSON.parse(jsonMatch[0]);
}

function tryParseNotes(val: string | null): any[] {
  if (!val) return [];
  try { return JSON.parse(val); } catch { return []; }
}
