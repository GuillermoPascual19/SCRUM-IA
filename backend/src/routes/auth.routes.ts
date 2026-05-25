import { Router } from "express";
import { register, login, me, activate, forgotPassword, resetPasswordController, updateProfileController, changePasswordController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);
router.get("/activate", activate);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordController);
router.put("/profile", authenticate, updateProfileController);
router.put("/change-password", authenticate, changePasswordController);

export default router;
