import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import tfgRoutes from "./routes/tfg.routes";
import memberRoutes from "./routes/member.routes";
import sprintRoutes from "./routes/sprint.route";
import userStoryRoutes from "./routes/userStory.routes";
import taskRoutes from "./routes/task.route";
import retrospectiveRoutes from "./routes/retrospective.routes";
import aiRoutes from "./routes/ai.routes";
import { tfgRouter, oauthRouter } from "./routes/github.routes";

import { authenticate } from "./middleware/auth";
import { prisma } from "./lib/prisma";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

//TODO: DELETE THIS COMMENT; ITS JUST TO TEST DEPLOYMENT
app.use("/api/auth", authRoutes);
app.use("/api/tfgs", tfgRoutes);
app.use("/api/tfgs/:tfgId/members", memberRoutes);
app.use("/api/tfgs/:tfgId/sprints", sprintRoutes);
app.use("/api/tfgs/:tfgId/user-stories", userStoryRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/tfgs/:tfgId/sprints/:sprintId/retrospective", retrospectiveRoutes);
app.use("/api/tfgs/:tfgId/github", tfgRouter);
app.use("/api/github", oauthRouter);
app.use("/api/tfgs/:tfgId/evaluations", aiRoutes);

app.post("/api/auth/find-user", authenticate, async (req: any, res: any) => {
  try {
    const { email } = req.body;
    if (!email) { res.status(400).json({ error: "Email requerido" }); return; }
    const user = await prisma.user.findUnique({
      where: { email: String(email) },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) { res.status(404).json({ error: "Usuario no encontrado" }); return; }
    res.json(user);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/api/auth/search-users", authenticate, async (req: any, res: any) => {
  try {
    const { q } = req.query;
    if (!q || String(q).length < 2) { res.json([]); return; }
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: String(q), mode: "insensitive" } },
          { name: { contains: String(q), mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, email: true, role: true },
      take: 6,
    });
    res.json(users);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});