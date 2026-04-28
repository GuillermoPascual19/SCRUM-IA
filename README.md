# SCRUM-IA 🎓

> Plataforma web académica para la gestión de TFGs mediante metodología SCRUM con evaluación automática por inteligencia artificial.
>
> Academic web platform for managing final degree projects (TFGs) using the SCRUM methodology with AI-powered automatic evaluation.

---

## 🇪🇸 Español

### ¿Qué es SCRUM-IA?

SCRUM-IA es una aplicación web diseñada para gestionar Trabajos de Fin de Grado en entornos universitarios aplicando la metodología ágil SCRUM. Su objetivo es doble: facilitar la coordinación entre estudiantes y docentes, y fomentar el aprendizaje práctico de metodologías ágiles en un contexto académico real.

### ✨ Funcionalidades principales

- **Gestión de usuarios y roles** — Roles del sistema: estudiante, profesor, coordinador y administrador. Dentro de cada proyecto se asignan etiquetas SCRUM: Product Owner, Scrum Master y Developer.
- **Product Backlog** — Creación y priorización de historias de usuario con criterios de aceptación y story points.
- **Sprints** — Planificación de sprints con fechas, objetivos y duración definidos.
- **Tablero Kanban interactivo** — Seguimiento de tareas en columnas To Do / In Progress / Done.
- **Burn-down charts automáticos** — Visualización del progreso y velocidad del equipo en cada sprint.
- **Retrospectivas** — Espacio dedicado al final de cada sprint para reflexión y mejora continua.
- **Evaluación académica con IA** — Los commits del repositorio GitHub del proyecto son analizados automáticamente por un modelo de IA, que genera notas, feedback y comentarios de mejora por sprint. La nota final se calcula como media de los sprints y puede ser ajustada por el profesor.
- **Trazabilidad de commits** — Cada commit queda vinculado al estudiante, la tarea y el sprint correspondiente.
- **Reportes de rendimiento** — Informes individuales y grupales de productividad útiles para la evaluación continua.
- **Entregables y versiones** — Registro de entregas por sprint con historial de versiones del producto.

### 🛠️ Tecnologías

> Se irá actualizando conforme avance el desarrollo.

- **Frontend:** React + Next.js + Tailwind CSS + shadcn/ui
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL + Prisma + Supabase
- **IA:** Claude API (Anthropic) / OpenAI GPT-4o
- **Integración:** GitHub REST API

### 🔄 Flujo de evaluación con IA

```
Repositorio GitHub del TFG
        ↓
Backend recoge commits via GitHub API
(hash, mensaje, líneas añadidas/eliminadas, archivos, fecha)
        ↓
Se cruzan con tareas y sprints de la plataforma
        ↓
Se construye un prompt con el resumen de actividad del estudiante
        ↓
Modelo de IA analiza y devuelve:
  · nota_commits   → frecuencia, regularidad y calidad de mensajes
  · nota_tareas    → tareas y story points completados
  · nota_final     → nota global del sprint
  · puntos_fuertes / puntos_a_mejorar
        ↓
El profesor revisa, ajusta si es necesario y valida
        ↓
Al cerrar el TFG: media de sprints → nota final del TFG
```

### 👥 Roles

| Rol del sistema | Descripción |
|---|---|
| `estudiante` | Participa en TFGs, gestiona tareas y hace commits |
| `profesor` | Tutoriza TFGs, revisa y valida evaluaciones de la IA |
| `coordinador` | Supervisa varios TFGs y gestiona la asignación |
| `admin` | Administra la plataforma completa |

| Etiqueta SCRUM (dentro del proyecto) | Descripción |
|---|---|
| `Product Owner` | Define y prioriza el Product Backlog |
| `Scrum Master` | Facilita el proceso y elimina impedimentos |
| `Developer` | Desarrolla las tareas del sprint |

### 📁 Estructura del proyecto

> Se actualizará conforme avance el desarrollo.

```
SCRUM-IA/
├── frontend/
├── backend/
├── docs/
└── README.md
```

---

## 🇬🇧 English

### What is SCRUM-IA?

SCRUM-IA is a web application designed to manage Final Degree Projects (TFGs) in university environments using the agile SCRUM methodology. Its goal is twofold: to facilitate coordination between students and teachers, and to promote hands-on learning of agile methodologies in a real academic context.

### ✨ Key Features

- **User and role management** — System roles: student, professor, coordinator and administrator. Within each project, SCRUM labels are assigned: Product Owner, Scrum Master and Developer.
- **Product Backlog** — Creation and prioritization of user stories with acceptance criteria and story points.
- **Sprints** — Sprint planning with defined dates, goals and duration.
- **Interactive Kanban board** — Task tracking across To Do / In Progress / Done columns.
- **Automatic burn-down charts** — Visual representation of team progress and velocity per sprint.
- **Retrospectives** — Dedicated space at the end of each sprint for reflection and continuous improvement.
- **AI-powered academic evaluation** — Commits from the project's GitHub repository are automatically analyzed by an AI model, which generates scores, feedback and improvement comments per sprint. The final grade is calculated as the average of sprint scores and can be adjusted by the professor.
- **Commit traceability** — Each commit is linked to the student, task and sprint it belongs to.
- **Performance reports** — Individual and group productivity reports useful for continuous assessment.
- **Deliverables and versions** — Sprint delivery tracking with product version history.

### 🔄 AI Evaluation Flow

```
TFG GitHub Repository
        ↓
Backend fetches commits via GitHub API
(hash, message, lines added/deleted, files changed, date)
        ↓
Commits are matched to tasks and sprints in the platform
        ↓
A prompt is built with the student's activity summary
        ↓
AI model analyzes and returns:
  · commit_score   → frequency, consistency and message quality
  · task_score     → completed tasks and story points
  · final_score    → overall sprint score
  · strengths / areas to improve
        ↓
Professor reviews, adjusts if needed and validates
        ↓
On TFG completion: sprint average → final TFG grade
```

### 👥 Roles

| System Role | Description |
|---|---|
| `student` | Participates in TFGs, manages tasks and makes commits |
| `professor` | Supervises TFGs, reviews and validates AI evaluations |
| `coordinator` | Oversees multiple TFGs and manages assignments |
| `admin` | Administers the entire platform |

| SCRUM Label (within the project) | Description |
|---|---|
| `Product Owner` | Defines and prioritizes the Product Backlog |
| `Scrum Master` | Facilitates the process and removes impediments |
| `Developer` | Develops sprint tasks |

### 📁 Project Structure

> Will be updated as development progresses.

```
SCRUM-IA/
├── frontend/
├── backend/
├── docs/
└── README.md
```

---

## 📄 License

This project is part of a Final Degree Project (TFG) at University of Salamanca.

---

*Desarrollado como Trabajo de Fin de Grado · Developed as a Final Degree Project*
