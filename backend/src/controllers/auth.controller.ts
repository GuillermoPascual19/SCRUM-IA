import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { registerUser, loginUser, getMe } from "../services/auth.service";

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