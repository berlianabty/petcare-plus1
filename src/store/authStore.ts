import { create } from 'zustand';
import type { User } from '../types';
import { demoUser } from '../data/mockData';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: demoUser,
  isAuthenticated: true,
  login: (email, password) => {
    if (email && password) {
      set({ isAuthenticated: true, user: { ...demoUser, email } });
      return true;
    }
    return false;
  },
  register: (name, email, _password) => {
    set({
      isAuthenticated: false,
      user: { ...demoUser, name, email },
    });
  },
  logout: () => set({ isAuthenticated: false }),
  updateProfile: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}));
