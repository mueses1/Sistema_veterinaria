import { create } from 'zustand';
import { Cita } from '../types/Index.ts';

// Estado que manejará las citas en la aplicación
interface CitasState {
  citas: Cita[]; // Lista de citas almacenadas
  loadCitas: () => Promise<void>; // Cargar citas desde la API
  addCita: (cita: Cita) => Promise<void>; // Agregar una nueva cita
  updateCita: (id: string, cita: Partial<Cita>) => Promise<void>; // Actualizar datos de una cita
  deleteCita: (id: string) => Promise<void>; // Eliminar una cita
  updateEstadoCita: (id: string, estado: Cita['estado']) => Promise<void>; // Cambiar el estado de la cita (Pendiente / Completada / Cancelada...)
  getCitaById: (id: string) => Cita | undefined; // Obtener una cita específica
}

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Creamos el store de Zustand consumiendo la API FastAPI
export const useCitasStore = create<CitasState>()((set, get) => ({
  // Estado inicial: no hay citas
  citas: [],

  // Cargar citas desde el backend
  loadCitas: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments/`);
    if (!response.ok) return;
    const data: Cita[] = await response.json();
    set({ citas: data });
  },

  // Añade una nueva cita (crea en la API y luego actualiza el estado)
  addCita: async (cita: Cita) => {
    const response = await fetch(`${API_BASE_URL}/appointments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cita),
    });

    if (!response.ok) return;

    const created: Cita = await response.json();
    set((state) => ({
      citas: [...state.citas, created],
    }));
  },

  // Actualiza una cita existente (PATCH/PUT en la API y luego en el estado)
  updateCita: async (id: string, citaActualizada: Partial<Cita>) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(citaActualizada),
    });

    if (!response.ok) return;

    const updated: Cita = await response.json();
    set((state) => ({
      citas: state.citas.map((cita) =>
        cita.id === id ? updated : cita
      ),
    }));
  },

  // Elimina una cita en la API y luego en el estado
  deleteCita: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) return;

    set((state) => ({
      citas: state.citas.filter((cita) => cita.id !== id),
    }));
  },

  // Actualiza únicamente el estado de una cita (por ejemplo: Pendiente → Completada)
  updateEstadoCita: async (id: string, estado: Cita['estado']) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado }),
    });

    if (!response.ok) return;

    const updated: Cita = await response.json();
    set((state) => ({
      citas: state.citas.map((cita) =>
        cita.id === id ? updated : cita
      ),
    }));
  },

  // Busca y devuelve una cita por su ID (si no existe, devuelve undefined)
  getCitaById: (id: string) => {
    return get().citas.find((cita) => cita.id === id);
  },
}));
