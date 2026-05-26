export const DEMO_USER = { name: "Alex García", email: "alex.garcia@usal.es", role: "student" };

export const DEMO_TFG = {
  title: "EcoTrack TFG",
  description: "Plataforma de seguimiento de huella de carbono para empresas medianas. Incluye dashboard de métricas, integración con sensores IoT y sistema de reporting automatizado.",
  academicYear: "2025-2026",
  status: "activo",
  repositoryUrl: "https://github.com/demo/ecotrack",
  members: [
    { name: "Alex García", scrumRole: "Developer" },
    { name: "María López", scrumRole: "Scrum Master" },
    { name: "Carlos Ruiz", scrumRole: "Product Owner" },
  ],
};

export const DEMO_SPRINTS = [
  { id: 1, name: "Sprint 1", goal: "MVP de autenticación y onboarding de usuarios", status: "completado", startDate: "2026-02-01", endDate: "2026-02-14", tasks: 8, done: 8 },
  { id: 2, name: "Sprint 2", goal: "Sistema de evaluación de huella y dashboard analítico", status: "activo", startDate: "2026-02-15", endDate: "2026-02-28", tasks: 7, done: 4 },
  { id: 3, name: "Sprint 3", goal: "Integraciones externas, exportación y reportes PDF", status: "planificado", startDate: "2026-03-01", endDate: "2026-03-14", tasks: 6, done: 0 },
];

export const DEMO_BURNDOWN = [
  { day: "D1",  ideal: 42, real: 42 },
  { day: "D3",  ideal: 36, real: 40 },
  { day: "D5",  ideal: 28, real: 33 },
  { day: "D7",  ideal: 20, real: 26 },
  { day: "D9",  ideal: 12, real: 18 },
  { day: "D11", ideal: 4,  real: 12 },
  { day: "D14", ideal: 0,  real: 5  },
];

export const DEMO_TASKS = {
  to_do: [
    { id: 1, title: "Implementar webhook de Stripe", assignee: "Alex García", estimatedHours: 4 },
    { id: 2, title: "Diseñar pantalla de alertas de emisiones", assignee: "María López", estimatedHours: 3 },
    { id: 3, title: "Documentar API REST", assignee: "Carlos Ruiz", estimatedHours: 2 },
  ],
  in_progress: [
    { id: 4, title: "API de exportación a PDF", assignee: "Alex García", estimatedHours: 6 },
    { id: 5, title: "Integración Chart.js en dashboard", assignee: "Alex García", estimatedHours: 4 },
    { id: 6, title: "Tests de integración módulo auth", assignee: "María López", estimatedHours: 3 },
  ],
  done: [
    { id: 7, title: "Modelo de datos de emisiones", assignee: "Alex García", estimatedHours: 5 },
    { id: 8, title: "Autenticación JWT + refresh tokens", assignee: "María López", estimatedHours: 4 },
    { id: 9, title: "Seed de datos de prueba", assignee: "Carlos Ruiz", estimatedHours: 2 },
    { id: 10, title: "Configuración CI/CD pipeline", assignee: "Alex García", estimatedHours: 3 },
  ],
};

export const DEMO_STORIES = [
  { id: 1, title: "Como usuario quiero registrarme con email y contraseña", description: "Formulario de registro con validación y confirmación de email.", acceptanceCriteria: "El usuario recibe un email de confirmación tras registrarse.", storyPoints: 5, priority: 1, status: "completada" },
  { id: 2, title: "Como empresa quiero ver mi huella de carbono mensual", description: "Dashboard con gráficas de emisiones por categoría.", acceptanceCriteria: "El dashboard muestra datos del mes actual y comparativa con el mes anterior.", storyPoints: 8, priority: 2, status: "completada" },
  { id: 3, title: "Como admin quiero gestionar los planes de suscripción", description: "Panel de administración para crear, editar y desactivar planes.", acceptanceCriteria: "El admin puede cambiar el plan de cualquier empresa.", storyPoints: 13, priority: 3, status: "en_sprint" },
  { id: 4, title: "Como usuario quiero exportar mis datos en PDF", description: "Generación de informe PDF con las métricas del período seleccionado.", acceptanceCriteria: "El PDF incluye gráficas, tablas y resumen ejecutivo.", storyPoints: 5, priority: 4, status: "en_sprint" },
  { id: 5, title: "Como empresa quiero recibir alertas cuando supere el umbral", description: "Sistema de notificaciones por email y en app.", acceptanceCriteria: "La empresa puede configurar umbrales personalizados por categoría.", storyPoints: 8, priority: 5, status: "backlog" },
  { id: 6, title: "Como usuario quiero comparar mi huella con el sector", description: "Benchmarking con datos anonimizados de empresas del mismo sector.", acceptanceCriteria: "El gráfico muestra el percentil de la empresa respecto al sector.", storyPoints: 13, priority: 6, status: "backlog" },
  { id: 7, title: "Como empresa quiero conectar sensores IoT", description: "Integración vía API con dispositivos de monitoreo de consumo.", acceptanceCriteria: "Los datos del sensor se sincronizan cada hora.", storyPoints: 21, priority: 7, status: "backlog" },
];

export const DEMO_COMMITS = [
  { hash: "a1b2c3d", message: "feat: añadir exportación de datos a CSV", author: "Alex García", date: "2026-02-22", linesAdded: 145, linesDeleted: 12 },
  { hash: "e4f5a6b", message: "fix: corregir cálculo de emisiones por categoría", author: "Alex García", date: "2026-02-21", linesAdded: 23, linesDeleted: 18 },
  { hash: "c7d8e9f", message: "feat: integrar Chart.js en el dashboard de métricas", author: "Alex García", date: "2026-02-20", linesAdded: 210, linesDeleted: 5 },
  { hash: "a0b1c2d", message: "test: añadir tests de integración para el módulo auth", author: "María López", date: "2026-02-19", linesAdded: 88, linesDeleted: 0 },
  { hash: "e3f4a5b", message: "chore: actualizar dependencias de seguridad", author: "Carlos Ruiz", date: "2026-02-18", linesAdded: 4, linesDeleted: 4 },
];

export const DEMO_RETRO = {
  wentWell: JSON.stringify([
    { id: 1, text: "Alta frecuencia de commits y buena documentación" },
    { id: 2, text: "Comunicación fluida en daily standups" },
    { id: 3, text: "Todas las historias del sprint fueron completadas" },
  ]),
  toImprove: JSON.stringify([
    { id: 1, text: "Mejorar los mensajes de commit (más descriptivos)" },
    { id: 2, text: "Añadir más tests unitarios antes de mergear" },
  ]),
  actions: JSON.stringify([
    { id: 1, text: "Adoptar Conventional Commits desde el Sprint 2" },
    { id: 2, text: "Fijar cobertura mínima de tests al 70%" },
  ]),
};

export const DEMO_EVALUATIONS = [
  {
    id: 1,
    sprint: "Sprint 1",
    student: "Alex García",
    commitsScore: 8.5,
    tasksScore: 9.0,
    finalScore: 8.8,
    comments: "Excelente contribución durante el sprint. Commits bien documentados y todas las tareas asignadas completadas dentro del plazo.",
    strengths: ["Alta frecuencia de commits", "Buena trazabilidad tarea-código", "Proactividad en la resolución de bloqueos"],
    improvements: ["Mejorar mensajes de commit siguiendo Conventional Commits", "Aumentar cobertura de tests unitarios"],
    aiGenerated: true,
    reviewedByProfessor: true,
  },
];
