import { describe, it, expect, beforeEach } from "vitest";
import { useThemeStore } from "./theme.store";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("data-mode");
  useThemeStore.setState({ theme: "green", mode: "dark" });
});

describe("useThemeStore", () => {
  it("defaults new users to green/dark", () => {
    const state = useThemeStore.getState();
    expect(state.theme).toBe("green");
    expect(state.mode).toBe("dark");
  });

  it("setTheme updates state and the document attribute", () => {
    useThemeStore.getState().setTheme("blue");

    expect(useThemeStore.getState().theme).toBe("blue");
    expect(document.documentElement.getAttribute("data-theme")).toBe("blue");
  });

  it("toggleMode flips between light and dark", () => {
    useThemeStore.getState().toggleMode();
    expect(useThemeStore.getState().mode).toBe("light");
    expect(document.documentElement.getAttribute("data-mode")).toBe("light");

    useThemeStore.getState().toggleMode();
    expect(useThemeStore.getState().mode).toBe("dark");
    expect(document.documentElement.getAttribute("data-mode")).toBe("dark");
  });
});
