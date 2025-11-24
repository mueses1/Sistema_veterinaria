// Tipos para el sistema veterinario

// Representa a un paciente registrado en la veterinaria
export interface Paciente {
  id: string;          // Identificador único del paciente

  // Campos legacy usados en el resto de la app
  nombre: string;      // Nombre del animal (mascota)
  propietario: string; // Nombre completo del tutor
  email: string;       // Email de contacto del propietario
  fecha: string;       // Fecha en que se registró el paciente o fecha de ingreso
  sintomas: string;    // Descripción de los síntomas o motivo de la consulta

  // Datos del tutor (dueño)
  tutor_nombre?: string;
  tutor_apellido?: string;
  tutor_tipo_documento?: string;
  tutor_numero_documento?: string;
  tutor_telefono_principal?: string;
  tutor_telefono_secundario?: string;
  tutor_email?: string;
  tutor_direccion?: string;
  tutor_como_nos_conocio?: string;

  // Datos del paciente (mascota)
  mascota_nombre?: string;
  mascota_especie?: string;
  mascota_especie_otro?: string;
  mascota_raza?: string;
  mascota_raza_otro?: string;
  mascota_sexo?: string;
  mascota_castrado?: string; // 'si' | 'no' | 'no_sabe'
  mascota_fecha_nacimiento?: string;
  mascota_edad_aproximada_anios?: number;
  mascota_edad_aproximada_meses?: number;
  mascota_color?: string;
  mascota_peso_kg?: number;
  mascota_tiene_microchip?: boolean;
  mascota_numero_microchip?: string;
  mascota_foto_url?: string;

  // Información médica importante
  enfermedad_cronica?: string;
  medicacion_permanente?: string;
  alergias?: string;
  tiene_seguro_medico?: boolean;
  nombre_aseguradora?: string;
  observaciones?: string;
}

// Representa una cita médica para un paciente
export interface Cita {
  id: string;               // Identificador único de la cita
  pacienteId: string;       // ID del paciente relacionado con la cita
  pacienteNombre: string;   // Nombre del paciente (para mostrar sin buscar)
  propietario: string;      // Dueño del paciente
  fecha: string;            // Fecha programada para la cita
  hora: string;             // Hora de la cita
  motivo: string;           // Razón o descripción de la cita
  estado: 'pendiente' | 'completada' | 'cancelada' | 'en-proceso'; 
  // Estado actual de la cita (importante para el flujo de atención)

  fechaCreacion?: string;   // Fecha en que se registró la cita (opcional)
}

// Representa actividades registradas en el sistema (para historial o dashboard)
export interface Actividad {
  id: string;         // Identificador único de la actividad
  tipo: string;       // Tipo de actividad (ej: "registro", "actualización", etc.)
  icono: string;      // Icono a mostrar (nombre de icono o ruta)
  color: string;      // Color asociado a la actividad (ej: para UI)
  titulo: string;     // Título corto descriptivo
  descripcion: string;// Descripción detallada de la actividad
  fecha: string;      // Fecha en la que se realizó la actividad
}
