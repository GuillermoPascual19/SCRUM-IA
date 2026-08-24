import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";

vi.mock("../repositories/user.repository", () => ({
  findUserByEmail: vi.fn(),
  findUserById: vi.fn(),
  createUser: vi.fn(),
  findUserByActivationToken: vi.fn(),
  activateUser: vi.fn(),
  findUserByResetToken: vi.fn(),
  setResetToken: vi.fn(),
  updateUserPassword: vi.fn(),
}));

vi.mock("../lib/prisma", () => ({
  prisma: {
    user: {
      update: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("./email.service", () => ({
  sendActivationEmail: vi.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
}));

process.env.JWT_SECRET = "test-secret";

import * as userRepo from "../repositories/user.repository";
import { prisma } from "../lib/prisma";
import {
  registerUser,
  loginUser,
  rotateRefreshToken,
  changePassword,
} from "./auth.service";

const baseUser = {
  id: 1,
  name: "Ada",
  email: "ada@example.com",
  password: "",
  role: "student",
  isActive: true,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("registerUser", () => {
  it("throws EMAIL_IN_USE when the email is already taken", async () => {
    vi.mocked(userRepo.findUserByEmail).mockResolvedValue(baseUser as any);

    await expect(registerUser("Ada", "ada@example.com", "pw")).rejects.toThrow(
      "EMAIL_IN_USE"
    );
    expect(userRepo.createUser).not.toHaveBeenCalled();
  });

  it("creates an inactive student with a hashed password", async () => {
    vi.mocked(userRepo.findUserByEmail).mockResolvedValue(null);
    vi.mocked(userRepo.createUser).mockImplementation(async (data) => ({
      id: 2,
      ...data,
    }));

    const result = await registerUser("Ada", "ada@example.com", "plaintext");

    expect(result).toMatchObject({ id: 2, name: "Ada", email: "ada@example.com", role: "student" });
    const createArgs = vi.mocked(userRepo.createUser).mock.calls[0][0];
    expect(createArgs.isActive).toBe(false);
    expect(createArgs.password).not.toBe("plaintext");
    expect(await bcrypt.compare("plaintext", createArgs.password)).toBe(true);
  });
});

describe("loginUser", () => {
  it("throws INVALID_CREDENTIALS when the user does not exist", async () => {
    vi.mocked(userRepo.findUserByEmail).mockResolvedValue(null);

    await expect(loginUser("nobody@example.com", "pw")).rejects.toThrow(
      "INVALID_CREDENTIALS"
    );
  });

  it("throws INVALID_CREDENTIALS when the password is wrong", async () => {
    const hashed = await bcrypt.hash("correct-password", 10);
    vi.mocked(userRepo.findUserByEmail).mockResolvedValue({ ...baseUser, password: hashed } as any);

    await expect(loginUser(baseUser.email, "wrong-password")).rejects.toThrow(
      "INVALID_CREDENTIALS"
    );
  });

  it("throws ACCOUNT_NOT_ACTIVATED when the account is inactive", async () => {
    const hashed = await bcrypt.hash("correct-password", 10);
    vi.mocked(userRepo.findUserByEmail).mockResolvedValue({
      ...baseUser,
      password: hashed,
      isActive: false,
    } as any);

    await expect(loginUser(baseUser.email, "correct-password")).rejects.toThrow(
      "ACCOUNT_NOT_ACTIVATED"
    );
  });

  it("returns tokens and persists the refresh token on success", async () => {
    const hashed = await bcrypt.hash("correct-password", 10);
    vi.mocked(userRepo.findUserByEmail).mockResolvedValue({ ...baseUser, password: hashed } as any);
    vi.mocked(prisma.user.update).mockResolvedValue({} as any);

    const result = await loginUser(baseUser.email, "correct-password");

    expect(result.token).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
    expect(result.user).toMatchObject({ id: baseUser.id, email: baseUser.email });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: baseUser.id },
      data: { refreshToken: result.refreshToken },
    });
  });
});

describe("rotateRefreshToken", () => {
  it("throws INVALID_TOKEN when no matching active user is found", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);

    await expect(rotateRefreshToken("stale-token")).rejects.toThrow("INVALID_TOKEN");
  });

  it("issues a new token pair for a valid refresh token", async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue({
      id: baseUser.id,
      email: baseUser.email,
      role: baseUser.role,
      isActive: true,
    } as any);
    vi.mocked(prisma.user.update).mockResolvedValue({} as any);

    const result = await rotateRefreshToken("valid-token");

    expect(result.token).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
  });
});

describe("changePassword", () => {
  it("throws INVALID_PASSWORD when the current password does not match", async () => {
    const hashed = await bcrypt.hash("current-pw", 10);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 1, password: hashed } as any);

    await expect(changePassword(1, "wrong-pw", "new-pw")).rejects.toThrow("INVALID_PASSWORD");
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("hashes and stores the new password when the current one matches", async () => {
    const hashed = await bcrypt.hash("current-pw", 10);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 1, password: hashed } as any);
    vi.mocked(prisma.user.update).mockResolvedValue({} as any);

    await changePassword(1, "current-pw", "new-pw");

    const updateArgs = vi.mocked(prisma.user.update).mock.calls[0][0];
    expect(updateArgs.where).toEqual({ id: 1 });
    expect(await bcrypt.compare("new-pw", updateArgs.data.password)).toBe(true);
  });
});
