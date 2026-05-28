import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import authRoutes from "./routes/auth.routes";
import tfgRoutes from "./routes/tfg.routes";
import memberRoutes from "./routes/member.routes";
import sprintRoutes from "./routes/sprint.route";
import userStoryRoutes from "./routes/userStory.routes";
import taskRoutes from "./routes/task.route";
import retrospectiveRoutes from "./routes/retrospective.routes";
import aiRoutes from "./routes/ai.routes";
import { tfgRouter, oauthRouter } from "./routes/github.routes";
import adminRoutes from "./routes/admin.routes";
import notificationRoutes from "./routes/notification.routes";

import { authenticate } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";
import { prisma } from "./lib/prisma";

const app = express();
const PORT = process.env.PORT || 4000;

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas peticiones. Inténtalo de nuevo en 15 minutos." },
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Límite de generaciones IA alcanzado. Espera un momento." },
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "SCRUM-IA API Docs",
  swaggerOptions: { persistAuthorization: true },
}));

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/auth/reset-password", authLimiter);
app.use("/api/auth/refresh", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/tfgs", tfgRoutes);
app.use("/api/tfgs/:tfgId/members", memberRoutes);
app.use("/api/tfgs/:tfgId/sprints", sprintRoutes);
app.use("/api/tfgs/:tfgId/user-stories", userStoryRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/tfgs/:tfgId/sprints/:sprintId/retrospective", retrospectiveRoutes);
app.use("/api/tfgs/:tfgId/github", tfgRouter);
app.use("/api/github", oauthRouter);
app.use("/api/tfgs/:tfgId/evaluations/generate", aiLimiter);
app.use("/api/tfgs/:tfgId/evaluations/final/generate", aiLimiter);
app.use("/api/tfgs/:tfgId/evaluations/tfg-summary", aiLimiter);
app.use("/api/tfgs/:tfgId/evaluations", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

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

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});