export const DEMO_TEACHER = { name: "Dra. Carmen Navarro", email: "carmen.navarro@usal.es", role: "Profesora" };

export const DEMO_TFGS = [
  {
    id: 1,
    title: "EcoTrack TFG",
    description: "Plataforma de seguimiento de huella de carbono para empresas medianas con dashboard analítico e integración IoT.",
    academicYear: "2025-2026",
    status: "activo",
    repositoryUrl: "https://github.com/demo/ecotrack",
    members: [
      { name: "Alex García", scrumRole: "Developer" },
      { name: "María López", scrumRole: "Scrum Master" },
      { name: "Carlos Ruiz", scrumRole: "Product Owner" },
    ],
    sprints: { total: 3, active: 1, completed: 1 },
    progress: 55,
  },
  {
    id: 2,
    title: "MediSync",
    description: "Sistema de gestión de citas y expedientes médicos para clínicas pequeñas con integración de telemedicina.",
    academicYear: "2025-2026",
    status: "revision",
    repositoryUrl: "https://github.com/demo/medisync",
    members: [
      { name: "Laura Pérez", scrumRole: "Developer" },
      { name: "Javier Moreno", scrumRole: "Scrum Master" },
    ],
    sprints: { total: 3, active: 0, completed: 3 },
    progress: 100,
  },
];

export const DEMO_SPRINTS = [
  { id: 1, name: "Sprint 1", goal: "MVP de autenticación y onboarding", status: "completado", startDate: "2026-02-01", endDate: "2026-02-14", tasks: 8, done: 8 },
  { id: 2, name: "Sprint 2", goal: "Sistema de evaluación y dashboard analítico", status: "activo",     startDate: "2026-02-15", endDate: "2026-02-28", tasks: 7, done: 4 },
  { id: 3, name: "Sprint 3", goal: "Integraciones externas y reportes PDF",       status: "planificado", startDate: "2026-03-01", endDate: "2026-03-14", tasks: 6, done: 0 },
];

export const DEMO_COMMITS = [
  { hash: "a1b2c3d", message: "feat: añadir exportación de datos a CSV",           author: "Alex García",  date: "2026-02-22", linesAdded: 145, linesDeleted: 12 },
  { hash: "e4f5a6b", message: "fix: corregir cálculo de emisiones",                author: "Alex García",  date: "2026-02-21", linesAdded: 23,  linesDeleted: 18 },
  { hash: "c7d8e9f", message: "feat: integrar Chart.js en dashboard de métricas",  author: "Alex García",  date: "2026-02-20", linesAdded: 210, linesDeleted: 5  },
  { hash: "a0b1c2d", message: "test: tests de integración para el módulo auth",    author: "María López",  date: "2026-02-19", linesAdded: 88,  linesDeleted: 0  },
  { hash: "e3f4a5b", message: "chore: actualizar dependencias de seguridad",       author: "Carlos Ruiz",  date: "2026-02-18", linesAdded: 4,   linesDeleted: 4  },
];

export const DEMO_EVALUATIONS = [
  {
    student: "Alex García",
    sprint: "Sprint 1",
    commitsScore: 8.5,
    tasksScore: 9.0,
    finalScore: 8.8,
    status: "revisado",
    comments: "Excelente contribución durante el sprint. Commits bien documentados y tareas completadas en plazo.",
    strengths: ["Alta frecuencia de commits", "Buena trazabilidad tarea-código", "Proactividad ante bloqueos"],
    improvements: ["Mejorar mensajes de commit", "Aumentar cobertura de tests"],
  },
  {
    student: "María López",
    sprint: "Sprint 1",
    commitsScore: 7.5,
    tasksScore: 8.5,
    finalScore: 8.0,
    status: "revisado",
    comments: "Buen rol de Scrum Master. Coordinó bien las dailies y desbloqueó al equipo en varias ocasiones.",
    strengths: ["Gestión ágil del equipo", "Buena comunicación", "Cumplimiento de ceremonias"],
    improvements: ["Aumentar commits directos", "Más participación técnica"],
  },
  {
    student: "Carlos Ruiz",
    sprint: "Sprint 1",
    commitsScore: 6.0,
    tasksScore: 7.5,
    finalScore: 6.8,
    status: "ia",
    comments: "Rol de Product Owner bien ejecutado en cuanto a definición de historias, pero baja contribución técnica.",
    strengths: ["Criterios de aceptación bien definidos", "Backlog priorizado correctamente"],
    improvements: ["Mayor participación técnica", "Más commits al repositorio"],
  },
];

export const DEMO_REPORT = {
  createdAt: "2026-02-23T10:30:00Z",
  content: `# Informe Global — EcoTrack TFG

## Resumen ejecutivo

El equipo ha demostrado una progresión sólida durante el Sprint 1, completando el 100% de las historias planificadas. La coordinación entre los roles SCRUM es destacable, con una comunicación fluida y un ritmo de entrega constante.

## Rendimiento por estudiante

**Alex García (Developer)** — Nota media: 8.8/10
Contribución técnica ejemplar con 145 líneas netas añadidas. Lidera el desarrollo del core de la aplicación.

**María López (Scrum Master)** — Nota media: 8.0/10
Excelente gestión del equipo. Mantiene las ceremonias Scrum y facilita la resolución de impedimentos.

**Carlos Ruiz (Product Owner)** — Nota media: 6.8/10
Backlog bien definido y priorizado. Se recomienda mayor implicación técnica en sprints futuros.

## Evolución del proyecto

El burndown del Sprint 1 muestra una velocidad superior a la ideal en los primeros días, estabilizándose hacia el final. El equipo tiene capacidad para asumir más story points en el siguiente sprint.

## Recomendaciones

1. Implementar Conventional Commits para mejorar la trazabilidad
2. Establecer cobertura mínima de tests del 70% antes de mergear
3. Carlos Ruiz debería incrementar su participación técnica
`,
};
