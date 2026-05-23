import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  findUserByEmail,
  findUserById,
  createUser,
  findUserByActivationToken,
  activateUser,
} from "../repositories/user.repository";
import { sendActivationEmail } from "./email.service";

export async function registerUser(name: string, email: string, password: string, role: string) {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error("EMAIL_IN_USE");

  const hashed = await bcrypt.hash(password, 10);
  const activationToken = crypto.randomBytes(32).toString("hex");
  const activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await createUser({
    name,
    email,
    password: hashed,
    role,
    isActive: false,
    activationToken,
    activationTokenExpires,
  });

  sendActivationEmail(email, name, activationToken).catch((err) => {
    console.error("Error enviando email de activación:", err);
  });

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  if (!user.isActive) throw new Error("ACCOUNT_NOT_ACTIVATED");

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
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
