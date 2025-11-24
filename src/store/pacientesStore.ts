import { create } from 'zustand';
import { Paciente } from '../types/Index.ts';

// Definimos el tipo de estado que manejará el store de pacientes
interface PacientesState {
  pacientes: Paciente[]; // Lista de pacientes
  loadPacientes: () => Promise<void>; // Cargar pacientes desde la API
  addPaciente: (paciente: Paciente) => Promise<void>; // Agregar un paciente
  updatePaciente: (id: string, paciente: Paciente) => Promise<void>; // Actualizar paciente existente
  deletePaciente: (id: string) => Promise<void>; // Eliminar paciente
  getPacienteById: (id: string) => Paciente | undefined; // Obtener paciente por ID
}

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Creamos el estado global con Zustand consumiendo la API FastAPI
export const usePacientesStore = create<PacientesState>()((set, get) => ({
  // Estado inicial
  pacientes: [],

  // Cargar pacientes desde el backend
  loadPacientes: async () => {
    const response = await fetch(`${API_BASE_URL}/patients/`);
    if (!response.ok) return;
    const data: Paciente[] = await response.json();
    set({ pacientes: data });
  },

  // Agregar un nuevo paciente (se crea en la API y luego se actualiza el estado)
  addPaciente: async (paciente: Paciente) => {
    const response = await fetch(`${API_BASE_URL}/patients/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paciente),
    });

    if (!response.ok) return;

    const created: Paciente = await response.json();
    set((state) => ({
      pacientes: [...state.pacientes, created],
    }));
  },

  // Actualizar un paciente existente en la API y en el estado
  updatePaciente: async (id: string, pacienteActualizado: Paciente) => {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pacienteActualizado),
    });

    if (!response.ok) return;

    const updated: Paciente = await response.json();
    set((state) => ({
      pacientes: state.pacientes.map((paciente) =>
        paciente.id === id ? updated : paciente
      ),
    }));
  },

  // Eliminar un paciente en la API y luego en el estado
  deletePaciente: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) return;

    set((state) => ({
      pacientes: state.pacientes.filter((paciente) => paciente.id !== id),
    }));
  },

  // Buscar y devolver un paciente por su ID (o undefined si no existe)
  getPacienteById: (id: string) => {
    return get().pacientes.find((paciente) => paciente.id === id);
  },
}));
