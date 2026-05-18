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