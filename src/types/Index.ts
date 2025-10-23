// Tipos para el sistema veterinario

export interface Paciente {
  id: string;
  nombre: string;
  propietario: string;
  email: string;
  fecha: string;
  sintomas: string;
}

export interface Cita {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  propietario: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: 'pendiente' | 'completada' | 'cancelada' | 'en-proceso';
  fechaCreacion?: string;
}

export interface Actividad {
  id: string;
  tipo: string;
  icono: string;
  color: string;
  titulo: string;
  descripcion: string;
  fecha: string;
}