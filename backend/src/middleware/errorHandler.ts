import { Request, Response, NextFunction } from "express";

const ERROR_MAP: Record<string, { status: number; message: string }> = {
  // Auth
  EMAIL_IN_USE:          { status: 400, message: "El email ya está registrado" },
  INVALID_CREDENTIALS:   { status: 401, message: "Credenciales incorrectas" },
  ACCOUNT_NOT_ACTIVATED: { status: 403, message: "ACCOUNT_NOT_ACTIVATED" },
  USER_NOT_FOUND:        { status: 404, message: "Usuario no encontrado" },
  INVALID_TOKEN:         { status: 400, message: "El enlace no es válido" },
  TOKEN_EXPIRED:         { status: 400, message: "El enlace ha expirado" },
  INVALID_PASSWORD:      { status: 400, message: "La contraseña actual es incorrecta" },
  // TFG / Member
  TFG_NOT_FOUND:         { status: 404, message: "TFG no encontrado" },
  FORBIDDEN:             { status: 403, message: "Acceso denegado" },
  ALREADY_MEMBER:        { status: 400, message: "El usuario ya es miembro del TFG" },
  MEMBER_NOT_FOUND:      { status: 404, message: "Miembro no encontrado" },
  // Sprint / Story / Task
  SPRINT_NOT_FOUND:      { status: 404, message: "Sprint no encontrado" },
  USER_STORY_NOT_FOUND:  { status: 404, message: "Historia de usuario no encontrada" },
  TASK_NOT_FOUND:        { status: 404, message: "Tarea no encontrada" },
  // GitHub
  NO_REPO_URL:           { status: 400, message: "El TFG no tiene repositorio vinculado" },
  INVALID_REPO_URL:      { status: 400, message: "URL de repositorio inválida" },
  NO_GITHUB_TOKEN:       { status: 400, message: "Ningún miembro ha conectado su GitHub" },
  // AI
  DATA_NOT_FOUND:        { status: 404, message: "Datos no encontrados" },
  AI_INVALID_RESPONSE:   { status: 500, message: "Error al procesar la respuesta de la IA" },
  AI_INVALID_JSON:       { status: 500, message: "Error al procesar la respuesta de la IA" },
  NO_EVALUATIONS:        { status: 400, message: "El estudiante no tiene evaluaciones de sprint" },
};

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const mapped = ERROR_MAP[err.message];
  if (mapped) {
    res.status(mapped.status).json({ error: mapped.message });
    return;
  }
  console.error("[ERROR]", err);
  res.status(500).json({ error: "Error interno del servidor" });
}
