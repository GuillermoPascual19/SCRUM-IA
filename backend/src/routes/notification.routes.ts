import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getNotifications, markRead, markAllRead } from "../controllers/notification.controller";

const router = Router();

router.get("/", authenticate, getNotifications);
router.patch("/:id/read", authenticate, markRead);
router.patch("/read-all", authenticate, markAllRead);

export default router;
