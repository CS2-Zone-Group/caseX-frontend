import { create } from 'zustand';

interface TelegramState {
  isTelegramApp: boolean;
  setIsTelegramApp: (val: boolean) => void;
}

export const useTelegramStore = create<TelegramState>((set) => ({
  isTelegramApp: false,
  setIsTelegramApp: (val) => set({ isTelegramApp: val }),
}));
