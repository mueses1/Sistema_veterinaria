/**
 * Utilidad para migrar datos antiguos de localStorage a los stores de Zustand
 * Este script se puede ejecutar una sola vez al inicio de la aplicación
 * para migrar datos existentes al nuevo formato de almacenamiento
 */

import { usePacientesStore } from '../store/pacientesStore';
import { useCitasStore } from '../store/citasStore';
import { getItem } from './LocalStorage';
import { Paciente, Cita } from '../types/Index';

export const migrateOldData = () => {
  // Verificar si ya existe el formato de Zustand (evitar migración duplicada)
  const pacientesStorage = getItem<Paciente[]>('pacientes-storage');
  const citasStorage = getItem<Cita[]>('citas-storage');
  
  // Solo migrar si no existe el formato de Zustand
  if (!pacientesStorage) {
    // Migrar pacientes
    const oldPacientes = getItem<Paciente[]>('pacientes');
    if (oldPacientes) {
      try {
        if (Array.isArray(oldPacientes) && oldPacientes.length > 0) {
          const pacientesStore = usePacientesStore.getState();
          // Solo migrar si el store está vacío
          if (pacientesStore.pacientes.length === 0) {
            // Actualizar directamente el estado
            usePacientesStore.setState({ pacientes: oldPacientes });
            console.log('Pacientes migrados:', oldPacientes.length);
          }
        }
      } catch (error) {
        console.error('Error migrando pacientes:', error);
      }
    }
  }

  if (!citasStorage) {
    // Migrar citas
    const oldCitas = getItem<Cita[]>('citas');
    if (oldCitas) {
      try {
        if (Array.isArray(oldCitas) && oldCitas.length > 0) {
          const citasStore = useCitasStore.getState();
          // Solo migrar si el store está vacío
          if (citasStore.citas.length === 0) {
            // Actualizar directamente el estado
            useCitasStore.setState({ citas: oldCitas });
            console.log('Citas migradas:', oldCitas.length);
          }
        }
      } catch (error) {
        console.error('Error migrando citas:', error);
      }
    }
  }
};

