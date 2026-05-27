import { OpenAPIV3 } from "openapi-types";

const bearerAuth: OpenAPIV3.SecuritySchemeObject = {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
};

const errorSchema = (description: string): OpenAPIV3.ResponseObject => ({
  description,
  content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
});

export const swaggerSpec: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "SCRUM-IA API",
    version: "1.0.0",
    description: "API para la gestión de TFGs con metodología SCRUM e inteligencia artificial.",
  },
  servers: [{ url: "/api", description: "Base URL" }],
  components: {
    securitySchemes: { bearerAuth },
    schemas: {
      Error: {
        type: "object",
        properties: { error: { type: "string" } },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["student", "teacher", "coordinator", "admin"] },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Tfg: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "completed", "revision"] },
          academicYear: { type: "string" },
          tutorId: { type: "integer" },
          tutor: { $ref: "#/components/schemas/User" },
          members: { type: "array", items: { $ref: "#/components/schemas/TfgMember" } },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      TfgMember: {
        type: "object",
        properties: {
          userId: { type: "integer" },
          tfgId: { type: "integer" },
          scrumRole: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      Sprint: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          goal: { type: "string" },
          status: { type: "string", enum: ["planned", "active", "completed"] },
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time" },
          tfgId: { type: "integer" },
        },
      },
      UserStory: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          description: { type: "string" },
          priority: { type: "string", enum: ["low", "medium", "high"] },
          status: { type: "string", enum: ["todo", "in_progress", "done"] },
          storyPoints: { type: "integer" },
          tfgId: { type: "integer" },
        },
      },
      Task: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          status: { type: "string", enum: ["todo", "in_progress", "done"] },
          estimatedHours: { type: "number" },
          actualHours: { type: "number" },
          assignedTo: { type: "integer" },
          sprintId: { type: "integer" },
          userStoryId: { type: "integer" },
        },
      },
      Retrospective: {
        type: "object",
        properties: {
          id: { type: "integer" },
          sprintId: { type: "integer" },
          wentWell: { type: "string" },
          toImprove: { type: "string" },
          actionItems: { type: "string" },
        },
      },
      Evaluation: {
        type: "object",
        properties: {
          id: { type: "integer" },
          tfgId: { type: "integer" },
          sprintId: { type: "integer" },
          studentId: { type: "integer" },
          professorId: { type: "integer" },
          commitsScore: { type: "number" },
          tasksScore: { type: "number" },
          finalScore: { type: "number" },
          strengths: { type: "string" },
          improvements: { type: "string" },
          comments: { type: "string" },
          aiGenerated: { type: "boolean" },
          reviewedByProfessor: { type: "boolean" },
        },
      },
      Notification: {
        type: "object",
        properties: {
          id: { type: "integer" },
          message: { type: "string" },
          type: { type: "string", enum: ["evaluation", "evaluation_reviewed", "member_added"] },
          read: { type: "boolean" },
          link: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Commit: {
        type: "object",
        properties: {
          id: { type: "integer" },
          sha: { type: "string" },
          message: { type: "string" },
          date: { type: "string", format: "date-time" },
          linesAdded: { type: "integer" },
          linesDeleted: { type: "integer" },
          filesChanged: { type: "integer" },
          tfgId: { type: "integer" },
          sprintId: { type: "integer", nullable: true },
          studentId: { type: "integer", nullable: true },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    // ─── AUTH ───────────────────────────────────────────────
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Registrar usuario",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "Ana García" },
                  email: { type: "string", format: "email", example: "ana@usal.es" },
                  password: { type: "string", minLength: 6, example: "secret123" },
                  role: { type: "string", enum: ["student", "teacher"], default: "student" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Usuario registrado (pendiente activación)", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          "400": errorSchema("EMAIL_IN_USE — el email ya está registrado"),
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Iniciar sesión",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Token JWT + datos del usuario",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          "401": errorSchema("Credenciales incorrectas"),
          "403": errorSchema("Cuenta no activada"),
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Obtener usuario autenticado",
        responses: {
          "200": { description: "Datos del usuario", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          "401": errorSchema("Token no válido"),
        },
      },
    },
    "/auth/activate": {
      get: {
        tags: ["Auth"],
        summary: "Activar cuenta por email",
        security: [],
        parameters: [{ name: "token", in: "query", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Cuenta activada" },
          "400": errorSchema("Token inválido o expirado"),
        },
      },
    },
    "/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Solicitar email de recuperación de contraseña",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["email"], properties: { email: { type: "string", format: "email" } } } } },
        },
        responses: { "200": { description: "Email enviado (si existe la cuenta)" } },
      },
    },
    "/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Resetear contraseña con token",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["token", "password"], properties: { token: { type: "string" }, password: { type: "string" } } } } },
        },
        responses: {
          "200": { description: "Contraseña actualizada" },
          "400": errorSchema("Token inválido o expirado"),
        },
      },
    },
    "/auth/profile": {
      put: {
        tags: ["Auth"],
        summary: "Actualizar nombre del perfil",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["name"], properties: { name: { type: "string" } } } } },
        },
        responses: {
          "200": { description: "Perfil actualizado", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          "400": errorSchema("El nombre es requerido"),
        },
      },
    },
    "/auth/change-password": {
      put: {
        tags: ["Auth"],
        summary: "Cambiar contraseña",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["currentPassword", "newPassword"], properties: { currentPassword: { type: "string" }, newPassword: { type: "string" } } } } },
        },
        responses: {
          "200": { description: "Contraseña actualizada" },
          "400": errorSchema("Contraseña actual incorrecta"),
        },
      },
    },
    "/auth/find-user": {
      post: {
        tags: ["Auth"],
        summary: "Buscar usuario por email exacto",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["email"], properties: { email: { type: "string", format: "email" } } } } },
        },
        responses: {
          "200": { description: "Usuario encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          "404": errorSchema("Usuario no encontrado"),
        },
      },
    },
    "/auth/search-users": {
      get: {
        tags: ["Auth"],
        summary: "Buscar usuarios por nombre o email (mínimo 2 caracteres)",
        parameters: [{ name: "q", in: "query", required: true, schema: { type: "string", minLength: 2 } }],
        responses: {
          "200": { description: "Lista de usuarios", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } } },
        },
      },
    },

    // ─── TFGs ───────────────────────────────────────────────
    "/tfgs": {
      get: {
        tags: ["TFGs"],
        summary: "Listar todos los TFGs",
        responses: {
          "200": { description: "Lista de TFGs", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Tfg" } } } } },
        },
      },
      post: {
        tags: ["TFGs"],
        summary: "Crear TFG (teacher, coordinator, admin)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string", example: "Sistema de detección de plagio" },
                  description: { type: "string" },
                  status: { type: "string", enum: ["active", "completed", "revision"], default: "active" },
                  academicYear: { type: "string", example: "2024-2025" },
                  repoUrl: { type: "string", example: "https://github.com/user/repo" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "TFG creado", content: { "application/json": { schema: { $ref: "#/components/schemas/Tfg" } } } },
          "403": errorSchema("Rol insuficiente"),
        },
      },
    },
    "/tfgs/mine": {
      get: {
        tags: ["TFGs"],
        summary: "Listar TFGs del usuario autenticado",
        responses: {
          "200": { description: "TFGs del usuario", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Tfg" } } } } },
        },
      },
    },
    "/tfgs/{id}": {
      get: {
        tags: ["TFGs"],
        summary: "Obtener TFG por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "TFG", content: { "application/json": { schema: { $ref: "#/components/schemas/Tfg" } } } },
          "404": errorSchema("TFG no encontrado"),
        },
      },
      put: {
        tags: ["TFGs"],
        summary: "Actualizar TFG (teacher, coordinator, admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string", enum: ["active", "completed", "revision"] },
                  academicYear: { type: "string" },
                  repoUrl: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "TFG actualizado", content: { "application/json": { schema: { $ref: "#/components/schemas/Tfg" } } } },
          "403": errorSchema("Acceso denegado"),
          "404": errorSchema("TFG no encontrado"),
        },
      },
      delete: {
        tags: ["TFGs"],
        summary: "Eliminar TFG (coordinator, admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "TFG eliminado" },
          "403": errorSchema("Acceso denegado"),
          "404": errorSchema("TFG no encontrado"),
        },
      },
    },

    // ─── MEMBERS ────────────────────────────────────────────
    "/tfgs/{tfgId}/members": {
      get: {
        tags: ["Miembros"],
        summary: "Listar miembros de un TFG",
        parameters: [{ name: "tfgId", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Miembros", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/TfgMember" } } } } },
          "404": errorSchema("TFG no encontrado"),
        },
      },
      post: {
        tags: ["Miembros"],
        summary: "Añadir miembro al TFG (teacher, coordinator, admin)",
        parameters: [{ name: "tfgId", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["userId"], properties: { userId: { type: "integer" }, scrumRole: { type: "string", example: "Scrum Master" } } } } },
        },
        responses: {
          "201": { description: "Miembro añadido", content: { "application/json": { schema: { $ref: "#/components/schemas/TfgMember" } } } },
          "400": errorSchema("El usuario ya es miembro del TFG"),
          "403": errorSchema("Acceso denegado"),
          "404": errorSchema("TFG o usuario no encontrado"),
        },
      },
    },
    "/tfgs/{tfgId}/members/{userId}": {
      put: {
        tags: ["Miembros"],
        summary: "Actualizar rol SCRUM del miembro (teacher, coordinator, admin)",
        parameters: [
          { name: "tfgId", in: "path", required: true, schema: { type: "integer" } },
          { name: "userId", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["scrumRole"], properties: { scrumRole: { type: "string" } } } } },
        },
        responses: {
          "200": { description: "Rol actualizado" },
          "403": errorSchema("Acceso denegado"),
          "404": errorSchema("Miembro no encontrado"),
        },
      },
      delete: {
        tags: ["Miembros"],
        summary: "Eliminar miembro del TFG (teacher, coordinator, admin)",
        parameters: [
          { name: "tfgId", in: "path", required: true, schema: { type: "integer" } },
          { name: "userId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Miembro eliminado" },
          "403": errorSchema("Acceso denegado"),
          "404": errorSchema("Miembro no encontrado"),
        },
      },
    },

    // ─── SPRINTS ─────────────────────────────────────────────
    "/tfgs/{tfgId}/sprints": {
      get: {
        tags: ["Sprints"],
        summary: "Listar sprints de un TFG",
        parameters: [{ name: "tfgId", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Sprints", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Sprint" } } } } },
        },
      },
      post: {
        tags: ["Sprints"],
        summary: "Crear sprint (teacher, coordinator, admin)",
        parameters: [{ name: "tfgId", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "Sprint 1" },
                  goal: { type: "string" },
                  startDate: { type: "string", format: "date-time" },
                  endDate: { type: "string", format: "date-time" },
                  status: { type: "string", enum: ["planned", "active", "completed"] },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Sprint creado", content: { "application/json": { schema: { $ref: "#/components/schemas/Sprint" } } } },
          "403": errorSchema("Acceso denegado"),
          "404": errorSchema("TFG no encontrado"),
        },
      },
    },
    "/tfgs/{tfgId}/sprints/planner": {
      get: {
        tags: ["Sprints"],
        summary: "Obtener datos del planificador (kanban de sprints)",
        parameters: [{ name: "tfgId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Datos del planner" } },
      },
    },
    "/tfgs/{tfgId}/sprints/{id}": {
      get: {
        tags: ["Sprints"],
        summary: "Obtener sprint por ID",
        parameters: [
          { name: "tfgId", in: "path", required: true, schema: { type: "integer" } },
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Sprint", content: { "application/json": { schema: { $ref: "#/components/schemas/Sprint" } } } },
          "404": errorSchema("Sprint no encontrado"),
        },
      },
      put: {
        tags: ["Sprints"],
        summary: "Actualizar sprint (teacher, coordinator, admin)",
        parameters: [
          { name: "tfgId", in: "path", required: true, schema: { type: "integer" } },
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/Sprint" } } },
        },
        responses: {
          "200": { description: "Sprint actualizado" },
          "403": errorSchema("Acceso denegado"),
          "404": errorSchema("Sprint no encontrado"),
        },
      },
      delete: {
        tags: ["Sprints"],
        summary: "Eliminar sprint (teacher, coordinator, admin)",
        parameters: [
          { name: "tfgId", in: "path", required: true, schema: { type: "integer" } },
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Sprint eliminado" },
          "403": errorSchema("Acceso denegado"),
          "404": errorSchema("Sprint no encontrado"),
        },
      },
    },
    "/tfgs/{tfgId}/sprints/{id}/burndown": {
      get: {
        tags: ["Sprints"],
        summary: "Obtener datos del burndown chart",
        parameters: [
          { name: "tfgId", in: "path", required: true, schema: { type: "integer" } },
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Datos del burndown" },
          "404": errorSchema("Sprint no encontrado"),
        },
      },
    },

    // ─── USER STORIES ────────────────────────────────────────
    "/tfgs/{tfgId}/user-stories": {
      get: {
        tags: ["Historias de Usuario"],
        summary: "Listar historias de usuario de un TFG",
        parameters: [{ name: "tfgId", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Historias de usuario", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/UserStory" } } } } },
        },
      },
      post: {
        tags: ["Historias de Usuario"],
        summary: "Crear historia de usuario (teacher, coordinator, admin)",
        parameters: [{ name: "tfgId", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  priority: { type: "string", enum: ["low", "medium", "high"] },
                  storyPoints: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Historia creada", content: { "application/json": { schema: { $ref: "#/components/schemas/UserStory" } } } },
          "403": errorSchema("Acceso denegado"),
        },
      },
    },
    "/tfgs/{tfgId}/user-stories/{id}": {
      get: {
        tags: ["Historias de Usuario"],
        summary: "Obtener historia de usuario por ID",
        parameters: [
          { name: "tfgId", in: "path", required: true, schema: { type: "integer" } },
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Historia de usuario", content: { "application/json": { schema: { $ref: "#/components/schemas/UserStory" } } } },
          "404": errorSchema("Historia no encontrada"),
        },
      },
      put: {
        tags: ["Historias de Usuario"],
        summary: "Actualizar historia de usuario (teacher, coordinator, admin)",
        parameters: [
          { name: "tfgId", in: "path", required: true, schema: { type: "integer" } },
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/UserStory" } } } },
        responses: {
          "200": { description: "Historia actualizada" },
          "403": errorSchema("Acceso denegado"),
          "404": errorSchema("Historia no encontrada"),
        },
      },
      delete: {
        tags: ["Historias de Usuario"],
        summary: "Eliminar historia de usuario (teacher, coordinator, admin)",
        parameters: [
          { name: "tfgId", in: "path", required: true, schema: { type: "integer" } },
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Historia eliminada" },
          "403": errorSchema("Acceso denegado"),
          "404": errorSchema("Historia no encontrada"),
        },
      },
    },

    // ─── TASKS ───────────────────────────────────────────────
    "/tasks": {
      post: {
        tags: ["Tareas"],
        summary: "Crear tarea",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string" },
                  status: { type: "string", enum: ["todo", "in_progress", "done"] },
                  estimatedHours: { type: "number" },
                  actualHours: { type: "number" },
                  assignedTo: { type: "integer" },
                  sprintId: { type: "integer" },
                  userStoryId: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Tarea creada", content: { "application/json": { schema: { $ref: "#/components/schemas/Task" } } } },
        },
      },
    },
    "/tasks/{id}": {
      get: {
        tags: ["Tareas"],
        summary: "Obtener tarea por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Tarea", content: { "application/json": { schema: { $ref: "#/components/schemas/Task" } } } },
          "404": errorSchema("Tarea no encontrada"),
        },
      },
      put: {
        tags: ["Tareas"],
        summary: "Actualizar tarea",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Task" } } } },
        responses: {
          "200": { description: "Tarea actualizada" },
          "404": errorSchema("Tarea no encontrada"),
        },
      },
      delete: {
        tags: ["Tareas"],
        summary: "Eliminar tarea",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Tarea eliminada" },
          "404": errorSchema("Tarea no encontrada"),
        },
      },
    },
    "/tasks/story/{userStoryId}": {
      get: {
        tags: ["Tareas"],
        summary: "Listar tareas de una historia de usuario",
        parameters: [{ name: "userStoryId", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Tareas", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Task" } } } } },
        },
      },
    },
    "/tasks/sprint/{sprintId}": {
      get: {
        tags: ["Tareas"],
        summary: "Listar tareas de un sprint",
        parameters: [{ name: "sprintId", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Tareas", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Task" } } } } },
        },
      },
    },

    // ─── RETROSPECTIVES ──────────────────────────────────────
    "/tfgs/{tfgId}/sprints/{sprintId}/retrospective": {
      get: {
        tags: ["Retrospectivas"],
        summary: "Obtener retrospectiva de un sprint",
        parameters: [
          { name: "tfgId", in: "path", required: true, schema: { type: "integer" } },
          { name: "sprintId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Retrospectiva", content: { "application/json": { schema: { $ref: "#/components/schemas/Retrospective" } } } },
          "404": errorSchema("Retrospectiva no encontrada"),
        },
      },
      post: {
        tags: ["Retrospectivas"],
        summary: "Crear o actualizar retrospectiva (teacher, coordinator, admin)",
        parameters: [
          { name: "tfgId", in: "path", required: true, schema: { type: "integer" } },
          { name: "sprintId", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  wentWell: { type: "string", description: "JSON array de notas" },
                  toImprove: { type: "string" },
                  actionItems: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Retrospectiva guardada", content: { "application/json": { schema: { $ref: "#/components/schemas/Retrospective" } } } },
          "403": errorSchema("Acceso denegado"),
        },
      },
    },

    // ─── EVALUACIONES IA ─────────────────────────────────────
    "/tfgs/{tfgId}/evaluations": {
      get: {
        tags: ["Evaluaciones IA"],
        summary: "Listar evaluaciones de un TFG",
        parameters: [{ name: "tfgId", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Evaluaciones", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Evaluation" } } } } },
        },
      },
    },
    "/tfgs/{tfgId}/evaluations/generate": {
      post: {
        tags: ["Evaluaciones IA"],
        summary: "Generar evaluación IA para un estudiante en un sprint (teacher, coordinator, admin)",
        parameters: [{ name: "tfgId", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["sprintId", "studentId"], properties: { sprintId: { type: "integer" }, studentId: { type: "integer" } } } } },
        },
        responses: {
          "201": { description: "Evaluación generada", content: { "application/json": { schema: { $ref: "#/components/schemas/Evaluation" } } } },
          "400": errorSchema("sprintId y studentId son requeridos"),
          "404": errorSchema("Datos no encontrados"),
        },
      },
    },
    "/tfgs/{tfgId}/evaluations/{id}": {
      put: {
        tags: ["Evaluaciones IA"],
        summary: "Revisar/editar evaluación (teacher, coordinator, admin)",
        parameters: [
          { name: "tfgId", in: "path", required: true, schema: { type: "integer" } },
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { finalScore: { type: "number" }, comments: { type: "string" } },
              },
            },
          },
        },
        responses: { "200": { description: "Evaluación actualizada" } },
      },
    },
    "/tfgs/{tfgId}/evaluations/final": {
      get: {
        tags: ["Evaluaciones IA"],
        summary: "Listar notas finales de un TFG",
        parameters: [{ name: "tfgId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Notas finales" } },
      },
    },
    "/tfgs/{tfgId}/evaluations/final/generate": {
      post: {
        tags: ["Evaluaciones IA"],
        summary: "Generar nota final del TFG para un estudiante (teacher, coordinator, admin)",
        parameters: [{ name: "tfgId", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["studentId"], properties: { studentId: { type: "integer" } } } } },
        },
        responses: {
          "201": { description: "Nota final generada" },
          "400": errorSchema("El estudiante no tiene evaluaciones de sprint"),
        },
      },
    },
    "/tfgs/{tfgId}/evaluations/final/{id}": {
      put: {
        tags: ["Evaluaciones IA"],
        summary: "Actualizar nota final (teacher, coordinator, admin)",
        parameters: [
          { name: "tfgId", in: "path", required: true, schema: { type: "integer" } },
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          content: { "application/json": { schema: { type: "object", properties: { finalScore: { type: "number" }, finalComment: { type: "string" } } } } },
        },
        responses: { "200": { description: "Nota final actualizada" } },
      },
    },
    "/tfgs/{tfgId}/evaluations/retro-insights/{sprintId}": {
      get: {
        tags: ["Evaluaciones IA"],
        summary: "Generar insights IA de una retrospectiva",
        parameters: [
          { name: "tfgId", in: "path", required: true, schema: { type: "integer" } },
          { name: "sprintId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "3 insights accionables del sprint", content: { "application/json": { schema: { type: "array", items: { type: "object", properties: { tipo: { type: "string" }, texto: { type: "string" } } } } } } },
          "404": errorSchema("Sprint no encontrado"),
        },
      },
    },
    "/tfgs/{tfgId}/evaluations/tfg-summary": {
      post: {
        tags: ["Evaluaciones IA"],
        summary: "Generar informe ejecutivo del TFG completo (teacher, coordinator, admin)",
        parameters: [{ name: "tfgId", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: { "application/json": { schema: { type: "object", properties: { prompt: { type: "string", description: "Instrucción adicional para la IA" } } } } },
        },
        responses: {
          "201": { description: "Informe generado y guardado" },
          "404": errorSchema("TFG no encontrado"),
        },
      },
    },
    "/tfgs/{tfgId}/evaluations/reports": {
      get: {
        tags: ["Evaluaciones IA"],
        summary: "Listar informes guardados del TFG (teacher, coordinator, admin)",
        parameters: [{ name: "tfgId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Lista de informes" } },
      },
    },
    "/tfgs/{tfgId}/evaluations/reports/{reportId}": {
      delete: {
        tags: ["Evaluaciones IA"],
        summary: "Eliminar informe (teacher, coordinator, admin)",
        parameters: [
          { name: "tfgId", in: "path", required: true, schema: { type: "integer" } },
          { name: "reportId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: { "200": { description: "Informe eliminado" } },
      },
    },

    // ─── GITHUB ──────────────────────────────────────────────
    "/tfgs/{tfgId}/github/sync": {
      post: {
        tags: ["GitHub"],
        summary: "Sincronizar commits del repositorio (teacher, coordinator, admin)",
        parameters: [{ name: "tfgId", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Commits sincronizados" },
          "400": errorSchema("Sin repositorio vinculado o sin token de GitHub"),
          "404": errorSchema("TFG no encontrado"),
        },
      },
    },
    "/tfgs/{tfgId}/github/commits": {
      get: {
        tags: ["GitHub"],
        summary: "Listar commits de un TFG",
        parameters: [{ name: "tfgId", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Commits", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Commit" } } } } },
        },
      },
    },
    "/tfgs/{tfgId}/github/sprints/{sprintId}/commits": {
      get: {
        tags: ["GitHub"],
        summary: "Listar commits de un sprint",
        parameters: [
          { name: "tfgId", in: "path", required: true, schema: { type: "integer" } },
          { name: "sprintId", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Commits del sprint", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Commit" } } } } },
        },
      },
    },
    "/github/authorize": {
      get: {
        tags: ["GitHub"],
        summary: "Obtener URL de autorización OAuth GitHub",
        responses: {
          "200": { description: "URL de autorización", content: { "application/json": { schema: { type: "object", properties: { url: { type: "string" } } } } } },
        },
      },
    },
    "/github/callback": {
      get: {
        tags: ["GitHub"],
        summary: "Callback OAuth GitHub (redirige al frontend)",
        security: [],
        parameters: [
          { name: "installation_id", in: "query", required: true, schema: { type: "string" } },
          { name: "state", in: "query", required: true, schema: { type: "string" } },
        ],
        responses: { "302": { description: "Redirección al dashboard con ?github=success o ?github=error" } },
      },
    },
    "/github/status": {
      get: {
        tags: ["GitHub"],
        summary: "Comprobar si el usuario tiene GitHub conectado",
        responses: {
          "200": { description: "Estado de conexión", content: { "application/json": { schema: { type: "object", properties: { connected: { type: "boolean" } } } } } },
        },
      },
    },
    "/github/disconnect": {
      delete: {
        tags: ["GitHub"],
        summary: "Desconectar GitHub del usuario",
        responses: { "200": { description: "GitHub desconectado" } },
      },
    },

    // ─── ADMIN ───────────────────────────────────────────────
    "/admin/users": {
      get: {
        tags: ["Admin"],
        summary: "Listar todos los usuarios (admin)",
        responses: {
          "200": { description: "Usuarios", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } } },
          "403": errorSchema("Rol insuficiente"),
        },
      },
    },
    "/admin/users/{id}": {
      patch: {
        tags: ["Admin"],
        summary: "Cambiar rol o estado activo de un usuario (admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  role: { type: "string", enum: ["student", "teacher", "coordinator", "admin"] },
                  isActive: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Usuario actualizado", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } } },
      },
      delete: {
        tags: ["Admin"],
        summary: "Eliminar usuario (admin) — no puede eliminarse a sí mismo",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Usuario eliminado" },
          "400": errorSchema("No puedes eliminar tu propia cuenta"),
          "403": errorSchema("Rol insuficiente"),
        },
      },
    },

    // ─── NOTIFICATIONS ───────────────────────────────────────
    "/notifications": {
      get: {
        tags: ["Notificaciones"],
        summary: "Listar notificaciones del usuario (últimas 30)",
        responses: {
          "200": { description: "Notificaciones", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Notification" } } } } },
        },
      },
    },
    "/notifications/{id}/read": {
      patch: {
        tags: ["Notificaciones"],
        summary: "Marcar notificación como leída",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Notificación marcada como leída" } },
      },
    },
    "/notifications/read-all": {
      patch: {
        tags: ["Notificaciones"],
        summary: "Marcar todas las notificaciones como leídas",
        responses: { "200": { description: "Todas marcadas como leídas" } },
      },
    },
  },
};
