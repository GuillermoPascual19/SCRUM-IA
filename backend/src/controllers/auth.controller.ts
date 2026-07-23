import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  registerUser, loginUser, getMe,
  activateAccount, requestPasswordReset, resetPassword,
  updateProfile, changePassword, rotateRefreshToken,
} from "../services/auth.service";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const user = await registerUser(name, email, password);
  res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  res.json(result);
}

export async function me(req: AuthRequest, res: Response) {
  const user = await getMe(req.user!.id);
  res.json(user);
}

export async function activate(req: Request, res: Response) {
  const { token } = req.query;
  if (!token || typeof token !== "string") {
    res.status(400).json({ error: "Token inválido" });
    return;
  }
  const result = await activateAccount(token);
  res.json(result);
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  await requestPasswordReset(email);
  res.json({ message: "Si el email existe recibirás un enlace de recuperación" });
}

export async function updateProfileController(req: AuthRequest, res: Response) {
  const { name } = req.body;
  if (!name?.trim()) {
    res.status(400).json({ error: "El nombre es requerido" });
    return;
  }
  const user = await updateProfile(req.user!.id, name.trim());
  res.json(user);
}

export async function changePasswordController(req: AuthRequest, res: Response) {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Todos los campos son requeridos" });
    return;
  }
  await changePassword(req.user!.id, currentPassword, newPassword);
  res.json({ message: "Contraseña actualizada correctamente" });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;
  const tokens = await rotateRefreshToken(refreshToken);
  res.json(tokens);
}

export async function resetPasswordController(req: Request, res: Response) {
  const { token, password } = req.body;
  if (!token || !password) {
    res.status(400).json({ error: "Token y contraseña son requeridos" });
    return;
  }
  const result = await resetPassword(token, password);
  res.json(result);
}
