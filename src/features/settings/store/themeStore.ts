import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ThemeMode = "light" | "dark";

interface ThemeState {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (mode) => set({ theme: mode }),
    }),
    {
      name: "tally-theme-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
