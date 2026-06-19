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
  verifyGithubState,
} from "../services/github.service";

export async function sync(req: AuthRequest, res: Response) {
  const result = await syncCommits(Number(req.params.tfgId));
  res.json(result);
}

export async function getByTfg(req: AuthRequest, res: Response) {
  const commits = await getCommitsByTfg(Number(req.params.tfgId), req.user!.id, req.user!.role);
  res.json(commits);
}

export async function getBySprint(req: AuthRequest, res: Response) {
  const commits = await getCommitsBySprint(Number(req.params.sprintId), Number(req.params.tfgId), req.user!.id, req.user!.role);
  res.json(commits);
}

export async function authorize(req: AuthRequest, res: Response) {
  const url = getGithubAuthUrl(req.user!.id);
  res.json({ url });
}

export async function callback(req: Request, res: Response) {
  const { installation_id, state } = req.query;
  if (!installation_id || !state) {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?github=error`);
    return;
  }
  try {
    const { userId } = verifyGithubState(String(state));
    await handleInstallationCallback(Number(installation_id), userId);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?github=success`);
  } catch {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?github=error`);
  }
}

export async function getStatus(req: AuthRequest, res: Response) {
  const status = await getGithubConnectionStatus(req.user!.id);
  res.json(status);
}

export async function disconnect(req: AuthRequest, res: Response) {
  await disconnectGithub(req.user!.id);
  res.json({ message: "GitHub desconectado correctamente" });
}
