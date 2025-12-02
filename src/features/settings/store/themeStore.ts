import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ThemeMode = "light" | "dark";

interface ThemeState {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}

// Hatanın olduğu yer: create fonksiyonuna tipi bu şekilde tanımlamalısın.
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // Burada set parametresi ThemeState tipini otomatik olarak alır.
      theme: "light",
      setTheme: (mode) => set({ theme: mode }),
    }),
    {
      name: "tally-theme-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Önemli Not: Zustand V4'ten sonra persist middleware'i için
// create(persist(...)) yerine create<T>()(persist(...)) yapısı önerilir.
