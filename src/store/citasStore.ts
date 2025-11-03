import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cita } from '../types/Index.ts';

interface CitasState {
  citas: Cita[];
  addCita: (cita: Cita) => void;
  updateCita: (id: string, cita: Partial<Cita>) => void;
  deleteCita: (id: string) => void;
  updateEstadoCita: (id: string, estado: Cita['estado']) => void;
  getCitaById: (id: string) => Cita | undefined;
}

export const useCitasStore = create<CitasState>()(
  persist(
    (set, get) => ({
      citas: [],
      addCita: (cita: Cita) => {
        set((state) => ({
          citas: [...state.citas, cita],
        }));
      },
      updateCita: (id: string, citaActualizada: Partial<Cita>) => {
        set((state) => ({
          citas: state.citas.map((cita) =>
            cita.id === id ? { ...cita, ...citaActualizada } : cita
          ),
        }));
      },
      deleteCita: (id: string) => {
        set((state) => ({
          citas: state.citas.filter((cita) => cita.id !== id),
        }));
      },
      updateEstadoCita: (id: string, estado: Cita['estado']) => {
        set((state) => ({
          citas: state.citas.map((cita) =>
            cita.id === id ? { ...cita, estado } : cita
          ),
        }));
      },
      getCitaById: (id: string) => {
        return get().citas.find((cita) => cita.id === id);
      },
    }),
    {
      name: 'citas-storage', // nombre de la clave en localStorage
      partialize: (state) => ({ citas: state.citas }), // Solo persistir el estado, no las funciones
    }
  )
);