import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  syncCommits,
  getCommitsByTfg,
  getCommitsBySprint,
  getGithubAuthUrl,
  handleInstallationCallback,
  disconnectGithub,
  getGithubConnectionStatus,
} from "../services/github.service";

export async function sync(req: AuthRequest, res: Response) {
  try {
    const result = await syncCommits(Number(req.params.tfgId));
    res.json(result);
  } catch (e: any) {
    console.error("SYNC ERROR:", e.message, e);
    if (e.message === "TFG_NOT_FOUND") {
      res.status(404).json({ error: "TFG no encontrado" });
      return;
    }
    if (e.message === "NO_REPO_URL") {
      res.status(400).json({ error: "El TFG no tiene repositorio vinculado" });
      return;
    }
    if (e.message === "INVALID_REPO_URL") {
      res.status(400).json({ error: "URL de repositorio inválida" });
      return;
    }
    if (e.message === "NO_GITHUB_TOKEN") {
      res.status(400).json({ error: "Ningún miembro ha conectado su GitHub" });
      return;
    }
    res.status(500).json({ error: "Error al sincronizar commits" });
  }
}

export async function getByTfg(req: AuthRequest, res: Response) {
  try {
    const commits = await getCommitsByTfg(Number(req.params.tfgId));
    res.json(commits);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getBySprint(req: AuthRequest, res: Response) {
  try {
    const commits = await getCommitsBySprint(Number(req.params.sprintId));
    res.json(commits);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function authorize(req: AuthRequest, res: Response) {
  try {
    const url = getGithubAuthUrl(req.user!.id);
    res.json({ url });
  } catch {
    res.status(500).json({ error: "Error al generar URL de autorización" });
  }
}

export async function callback(req: Request, res: Response) {
  const { installation_id, state } = req.query;

  if (!installation_id || !state) {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?github=error`);
    return;
  }

  try {
    const { userId } = JSON.parse(
      Buffer.from(String(state), "base64").toString()
    );
    await handleInstallationCallback(Number(installation_id), userId);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?github=success`);
  } catch {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?github=error`);
  }
}

export async function getStatus(req: AuthRequest, res: Response) {
  try {
    const status = await getGithubConnectionStatus(req.user!.id);
    res.json(status);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function disconnect(req: AuthRequest, res: Response) {
  try {
    await disconnectGithub(req.user!.id);
    res.json({ message: "GitHub desconectado correctamente" });
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}