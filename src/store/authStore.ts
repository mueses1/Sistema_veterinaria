import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Definimos la interfaz User, que representa los datos del usuario
interface User {
  id: string;
  name: string;
  email: string;
  role: string;          // "admin" o "customer"
  token: string;         // access_token devuelto por el backend
  nombre?: string;       // Nombre completo (opcional)
  telefono?: string;     // Teléfono (opcional)
  especialidad?: string; // Especialidad (si aplica) (opcional)
  licencia?: string;     // Licencia profesional (opcional)
  direccion?: string;    // Dirección (opcional)
  biografia?: string;    // Biografía o descripción (opcional)
}

// Estado de autenticación que el store manejará
interface AuthState {
  user: User | null;          // Usuario autenticado o null si no hay sesión
  isAuthenticated: boolean;   // Indica si el usuario está autenticado
  login: (userData: User) => void; // Función para iniciar sesión
  logout: () => void;              // Función para cerrar sesión
}

// Creamos el store de Zustand con persistencia
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,              // Estado inicial: no hay usuario
      isAuthenticated: false,  // No está autenticado inicialmente

      // login: guarda el usuario en el estado y marca como autenticado
      login: (userData: User) => {
        set({ 
          user: userData, 
          isAuthenticated: true 
        });
      },

      // logout: limpia la información y marca como no autenticado
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },
    }),

    {
      name: 'auth-storage', // Nombre con el que guardará los datos en localStorage

      // `partialize` indica qué datos se pueden guardar en localStorage
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }), 
      // No guardamos las funciones (login/logout) porque no son necesarias
    }
  )
);
