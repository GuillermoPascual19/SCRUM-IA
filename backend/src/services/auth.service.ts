import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, findUserById, createUser } from "../repositories/user.repository";

export async function registerUser(name: string, email: string, password: string, role: string) {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error("EMAIL_IN_USE");

  const hashed = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, password: hashed, role });

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

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