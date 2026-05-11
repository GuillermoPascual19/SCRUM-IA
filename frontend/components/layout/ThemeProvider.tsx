"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme.store";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, mode } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-mode", mode);
  }, [theme, mode]);

  return <>{children}</>;
}