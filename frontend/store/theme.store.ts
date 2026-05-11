import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "green" | "blue" | "red" | "orange";
type Mode = "light" | "dark";

interface ThemeState {
  theme: Theme;
  mode: Mode;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "green",
      mode: "dark",

      setTheme: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        set({ theme });
      },

      setMode: (mode) => {
        document.documentElement.setAttribute("data-mode", mode);
        set({ mode });
      },

      toggleMode: () => {
        const newMode = get().mode === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-mode", newMode);
        set({ mode: newMode });
      },
    }),
    {
      name: "theme-storage",
    }
  )
);