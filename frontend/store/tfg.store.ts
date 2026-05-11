import { create } from "zustand";
import { Tfg } from "@/lib/types";

interface TfgState {
  activeTfg: Tfg | null;
  setActiveTfg: (tfg: Tfg | null) => void;
}

export const useTfgStore = create<TfgState>()((set) => ({
  activeTfg: null,
  setActiveTfg: (tfg) => set({ activeTfg: tfg }),
}));