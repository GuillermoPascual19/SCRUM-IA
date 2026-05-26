import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { getUserNotifications, readNotification, readAllNotifications } from "../services/notification.service";

export async function getNotifications(req: AuthRequest, res: Response) {
  const notifications = await getUserNotifications(req.user!.id);
  res.json(notifications);
}

export async function markRead(req: AuthRequest, res: Response) {
  await readNotification(Number(req.params.id), req.user!.id);
  res.json({ ok: true });
}

export async function markAllRead(req: AuthRequest, res: Response) {
  await readAllNotifications(req.user!.id);
  res.json({ ok: true });
}
