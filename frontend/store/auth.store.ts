import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/lib/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string, refreshToken: string) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token, refreshToken) => {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        set({ user, token, isAuthenticated: true });
      },

      updateUser: (data) => {
        set((state) => ({ user: state.user ? { ...state.user, ...data } : null }));
      },

      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
