import { Router } from "express";
import { register, login, me, activate, forgotPassword, resetPasswordController, updateProfileController, changePasswordController, refresh, githubLoginRedirect, githubLoginCallback } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, updateProfileSchema, refreshSchema } from "../schemas/auth.schemas";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, me);
router.get("/activate", activate);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPasswordController);
router.put("/profile", authenticate, validate(updateProfileSchema), updateProfileController);
router.put("/change-password", authenticate, validate(changePasswordSchema), changePasswordController);
router.post("/refresh", validate(refreshSchema), refresh);
router.get("/github", githubLoginRedirect);
router.get("/github/callback", githubLoginCallback);

export default router;
