import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./auth.store";
import { User } from "@/lib/types";

const user: User = {
  id: 1,
  name: "Ada",
  email: "ada@example.com",
  role: "student",
  createdAt: "2026-01-01T00:00:00.000Z",
};

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
});

describe("useAuthStore", () => {
  it("starts logged out", () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it("setAuth logs the user in and persists tokens to localStorage", () => {
    useAuthStore.getState().setAuth(user, "access-token", "refresh-token");

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(user);
    expect(state.token).toBe("access-token");
    expect(localStorage.getItem("token")).toBe("access-token");
    expect(localStorage.getItem("refreshToken")).toBe("refresh-token");
  });

  it("updateUser merges partial data into the existing user", () => {
    useAuthStore.getState().setAuth(user, "access-token", "refresh-token");

    useAuthStore.getState().updateUser({ name: "Ada Lovelace" });

    expect(useAuthStore.getState().user?.name).toBe("Ada Lovelace");
    expect(useAuthStore.getState().user?.email).toBe(user.email);
  });

  it("logout clears state and localStorage", () => {
    useAuthStore.getState().setAuth(user, "access-token", "refresh-token");

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
  });
});
