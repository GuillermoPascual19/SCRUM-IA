import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  registerUser, loginUser, getMe,
  activateAccount, requestPasswordReset, resetPassword,
  updateProfile, changePassword,
} from "../services/auth.service";

export async function register(req: Request, res: Response) {
  const { name, email, password, role } = req.body;
  try {
    const user = await registerUser(name, email, password, role);
    res.status(201).json(user);
  } catch (e: any) {
    if (e.message === "EMAIL_IN_USE") {
      res.status(400).json({ error: "El email ya está registrado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const result = await loginUser(email, password);
    res.json(result);
  } catch (e: any) {
    if (e.message === "INVALID_CREDENTIALS") {
      res.status(401).json({ error: "Credenciales incorrectas" });
      return;
    }
    if (e.message === "ACCOUNT_NOT_ACTIVATED") {
      res.status(403).json({ error: "ACCOUNT_NOT_ACTIVATED" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function me(req: AuthRequest, res: Response) {
  try {
    const user = await getMe(req.user!.id);
    res.json(user);
  } catch (e: any) {
    if (e.message === "USER_NOT_FOUND") {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function activate(req: Request, res: Response) {
  const { token } = req.query;
  if (!token || typeof token !== "string") {
    res.status(400).json({ error: "Token inválido" });
    return;
  }
  try {
    const result = await activateAccount(token);
    res.json(result);
  } catch (e: any) {
    if (e.message === "INVALID_TOKEN") {
      res.status(400).json({ error: "El enlace de activación no es válido" });
      return;
    }
    if (e.message === "TOKEN_EXPIRED") {
      res.status(400).json({ error: "El enlace de activación ha expirado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  try {
    await requestPasswordReset(email);
    res.json({ message: "Si el email existe recibirás un enlace de recuperación" });
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateProfileController(req: AuthRequest, res: Response) {
  const { name } = req.body;
  if (!name?.trim()) {
    res.status(400).json({ error: "El nombre es requerido" });
    return;
  }
  try {
    const user = await updateProfile(req.user!.id, name.trim());
    res.json(user);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function changePasswordController(req: AuthRequest, res: Response) {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Todos los campos son requeridos" });
    return;
  }
  try {
    await changePassword(req.user!.id, currentPassword, newPassword);
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (e: any) {
    if (e.message === "INVALID_PASSWORD") {
      res.status(400).json({ error: "La contraseña actual es incorrecta" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function resetPasswordController(req: Request, res: Response) {
  const { token, password } = req.body;
  if (!token || !password) {
    res.status(400).json({ error: "Token y contraseña son requeridos" });
    return;
  }
  try {
    const result = await resetPassword(token, password);
    res.json(result);
  } catch (e: any) {
    if (e.message === "INVALID_TOKEN") {
      res.status(400).json({ error: "El enlace no es válido" });
      return;
    }
    if (e.message === "TOKEN_EXPIRED") {
      res.status(400).json({ error: "El enlace ha expirado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
