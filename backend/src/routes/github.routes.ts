import { Router } from "express";
import {
  sync,
  getByTfg,
  getBySprint,
  authorize,
  callback,
  getStatus,
  disconnect,
} from "../controllers/github.controller";
import { authenticate, requireRole } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const tfgRouter = Router({ mergeParams: true });
tfgRouter.post("/sync", authenticate, requireRole("teacher", "coordinator", "admin"), sync);
tfgRouter.get("/commits", authenticate, getByTfg);
tfgRouter.get("/sprints/:sprintId/commits", authenticate, getBySprint);

const oauthRouter = Router();
oauthRouter.get("/authorize", authenticate, authorize);
oauthRouter.get("/callback", callback);
oauthRouter.get("/status", authenticate, getStatus);
oauthRouter.delete("/disconnect", authenticate, disconnect);

oauthRouter.post("/install", authenticate, async (req: any, res: any) => {
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { githubToken: String(req.body.installationId) },
  });
  res.json({ ok: true });
});

export { tfgRouter, oauthRouter };