import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  findUserByEmail,
  findUserById,
  createUser,
  findUserByActivationToken,
  activateUser,
  findUserByResetToken,
  setResetToken,
  updateUserPassword,
} from "../repositories/user.repository";
import { prisma } from "../lib/prisma";
import { sendActivationEmail, sendPasswordResetEmail } from "./email.service";

export async function registerUser(name: string, email: string, password: string) {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error("EMAIL_IN_USE");

  const hashed = await bcrypt.hash(password, 10);
  const activationToken = crypto.randomBytes(32).toString("hex");
  const activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await createUser({
    name, email, password: hashed, role: "student",
    isActive: false, activationToken, activationTokenExpires,
  });

  sendActivationEmail(email, name, activationToken).catch((err) => {
    console.error("Error enviando email de activación:", err);
  });

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function generateTokens(user: { id: number; email: string; role: string }) {
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );
  const refreshToken = crypto.randomBytes(64).toString("hex");
  return { token, refreshToken };
}

async function issueSession(user: { id: number; name: string; email: string; role: string }) {
  const { token, refreshToken } = generateTokens(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    token,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  if (!user.isActive) throw new Error("ACCOUNT_NOT_ACTIVATED");

  return issueSession(user);
}

export async function loginWithGithubEmail(email: string) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("NO_ACCOUNT");
  if (!user.isActive) throw new Error("ACCOUNT_NOT_ACTIVATED");

  return issueSession(user);
}

export function signGithubLoginState(): string {
  const payload = JSON.stringify({ ts: Date.now() });
  const sig = crypto.createHmac("sha256", process.env.JWT_SECRET!).update(payload).digest("hex");
  return Buffer.from(JSON.stringify({ payload, sig })).toString("base64url");
}

export function verifyGithubLoginState(rawState: string): void {
  let parsed: { payload: string; sig: string };
  try {
    parsed = JSON.parse(Buffer.from(rawState, "base64url").toString());
  } catch {
    throw new Error("INVALID_STATE");
  }
  const expected = crypto.createHmac("sha256", process.env.JWT_SECRET!).update(parsed.payload).digest("hex");
  const sigBuf = Buffer.from(parsed.sig, "hex");
  const expBuf = Buffer.from(expected, "hex");
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    throw new Error("INVALID_STATE");
  }
  const { ts } = JSON.parse(parsed.payload);
  if (Date.now() - ts > 10 * 60 * 1000) throw new Error("STATE_EXPIRED");
}

export async function rotateRefreshToken(incomingToken: string) {
  const user = await prisma.user.findFirst({
    where: { refreshToken: incomingToken },
    select: { id: true, email: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) throw new Error("INVALID_TOKEN");

  const { token, refreshToken } = generateTokens(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { token, refreshToken };
}

export async function getMe(id: number) {
  const user = await findUserById(id);
  if (!user) throw new Error("USER_NOT_FOUND");
  return user;
}

export async function activateAccount(token: string) {
  const user = await findUserByActivationToken(token);
  if (!user || !user.activationTokenExpires) throw new Error("INVALID_TOKEN");
  if (user.activationTokenExpires < new Date()) throw new Error("TOKEN_EXPIRED");

  await activateUser(user.id);
  return { message: "Cuenta activada correctamente" };
}

export async function requestPasswordReset(email: string) {
  const user = await findUserByEmail(email);
  if (!user) return; // No revelamos si el email existe o no

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await setResetToken(user.id, token, expires);

  sendPasswordResetEmail(email, user.name, token).catch((err) => {
    console.error("Error enviando email de recuperación:", err);
  });
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await findUserByResetToken(token);
  if (!user || !user.resetPasswordTokenExpires) throw new Error("INVALID_TOKEN");
  if (user.resetPasswordTokenExpires < new Date()) throw new Error("TOKEN_EXPIRED");

  const hashed = await bcrypt.hash(newPassword, 10);
  await updateUserPassword(user.id, hashed);
  return { message: "Contraseña actualizada correctamente" };
}

export async function updateProfile(id: number, name: string) {
  return prisma.user.update({
    where: { id },
    data: { name },
    select: { id: true, name: true, email: true, role: true },
  });
}

export async function changePassword(id: number, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, password: true } });
  if (!user) throw new Error("USER_NOT_FOUND");

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new Error("INVALID_PASSWORD");

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id }, data: { password: hashed } });
}
