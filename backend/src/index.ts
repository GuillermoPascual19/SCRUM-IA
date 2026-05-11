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


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tfgs", tfgRoutes);
app.use("/api/tfgs/:tfgId/members", memberRoutes);
app.use("/api/tfgs/:tfgId/sprints", sprintRoutes);
app.use("/api/tfgs/:tfgId/user-stories", userStoryRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/tfgs/:tfgId/sprints/:sprintId/retrospective", retrospectiveRoutes);
  
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});