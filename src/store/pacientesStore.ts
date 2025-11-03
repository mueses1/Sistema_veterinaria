import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Paciente } from '../types/Index.ts';

interface PacientesState {
  pacientes: Paciente[];
  addPaciente: (paciente: Paciente) => void;
  updatePaciente: (id: string, paciente: Paciente) => void;
  deletePaciente: (id: string) => void;
  getPacienteById: (id: string) => Paciente | undefined;
}

export const usePacientesStore = create<PacientesState>()(
  persist(
    (set, get) => ({
      pacientes: [],
      addPaciente: (paciente: Paciente) => {
        set((state) => ({
          pacientes: [...state.pacientes, paciente],
        }));
      },
      updatePaciente: (id: string, pacienteActualizado: Paciente) => {
        set((state) => ({
          pacientes: state.pacientes.map((paciente) =>
            paciente.id === id ? pacienteActualizado : paciente
          ),
        }));
      },
      deletePaciente: (id: string) => {
        set((state) => ({
          pacientes: state.pacientes.filter((paciente) => paciente.id !== id),
        }));
      },
      getPacienteById: (id: string) => {
        return get().pacientes.find((paciente) => paciente.id === id);
      },
    }),
    {
      name: 'pacientes-storage', // nombre de la clave en localStorage
      partialize: (state) => ({ pacientes: state.pacientes }), // Solo persistir el estado, no las funciones
    }
  )
);

