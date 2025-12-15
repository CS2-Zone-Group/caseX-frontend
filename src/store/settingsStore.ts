import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'uz' | 'ru' | 'en';
export type Currency = 'UZS' | 'USD' | 'RUB';

interface SettingsState {
  theme: Theme;
  language: Language;
  currency: Currency;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setCurrency: (currency: Currency) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'uz',
      currency: 'UZS',
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'settings-storage',
      skipHydration: true,
    }
  )
);

function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;

  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}

// Theme will be initialized in layout.tsx to prevent hydration mismatch
