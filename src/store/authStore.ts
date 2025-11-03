import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  nombre?: string;
  telefono?: string;
  especialidad?: string;
  licencia?: string;
  direccion?: string;
  biografia?: string;
  rol?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData: User) => {
        set({ 
          user: userData, 
          isAuthenticated: true 
        });
      },
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },
    }),
    {
      name: 'auth-storage', // nombre de la clave en localStorage
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }), // Solo persistir el estado, no las funciones
    }
  )
);