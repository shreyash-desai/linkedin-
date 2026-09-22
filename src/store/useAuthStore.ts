import { create } from 'zustand';

export type User = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Demo mode: auto-login a dummy user
  user: {
    id: 'demo-user-123',
    email: 'shreyash@example.com',
    name: 'Shreyash',
    avatar_url: 'https://i.pravatar.cc/150?u=shreyash',
  },
  isAuthenticated: true,
  isLoading: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
