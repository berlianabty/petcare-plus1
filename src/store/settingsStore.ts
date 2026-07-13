import { create } from 'zustand';

interface SettingsStore {
  darkMode: boolean;
  notifications: boolean;
  language: string;
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  setLanguage: (lang: string) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  darkMode: false,
  notifications: true,
  language: 'English',
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
  setLanguage: (lang) => set({ language: lang }),
}));
