import { create } from 'zustand';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export type AppointmentRequestEstado = 'pendiente' | 'gestionada' | 'rechazada';

export interface AppointmentRequest {
  id: string;
  nombrePropietario: string;
  nombreMascota: string;
  telefono?: string | null;
  email?: string | null;
  motivo: string;
  estado: AppointmentRequestEstado;
  creadaEn?: string;
}

interface AppointmentRequestsState {
  solicitudes: AppointmentRequest[];
  loading: boolean;
  loadSolicitudes: () => Promise<void>;
  updateEstado: (id: string, estado: AppointmentRequestEstado) => Promise<void>;
  removeSolicitud: (id: string) => Promise<void>;
}

export const useAppointmentRequestsStore = create<AppointmentRequestsState>()((set, get) => ({
  solicitudes: [],
  loading: false,

  loadSolicitudes: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_BASE_URL}/appointment-requests/`);
      if (!res.ok) return;
      const data: AppointmentRequest[] = await res.json();
      set({ solicitudes: data });
    } catch (error) {
      console.error('Error cargando solicitudes de cita', error);
    } finally {
      set({ loading: false });
    }
  },

  updateEstado: async (id, estado) => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointment-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });
      if (!res.ok) return;
      const updated: AppointmentRequest = await res.json();
      set((state) => ({
        solicitudes: state.solicitudes.map((s) => (s.id === id ? updated : s)),
      }));
    } catch (error) {
      console.error('Error actualizando estado de solicitud de cita', error);
    }
  },

  removeSolicitud: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointment-requests/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) return;
      set((state) => ({ solicitudes: state.solicitudes.filter((s) => s.id !== id) }));
    } catch (error) {
      console.error('Error eliminando solicitud de cita', error);
    }
  },
}));
