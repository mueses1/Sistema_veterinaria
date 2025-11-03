/**
 * Utilidad para migrar datos antiguos de localStorage a los stores de Zustand
 * Este script se puede ejecutar una sola vez al inicio de la aplicación
 * para migrar datos existentes al nuevo formato de almacenamiento
 */

import { usePacientesStore } from '../store/pacientesStore';
import { useCitasStore } from '../store/citasStore';

export const migrateOldData = () => {
  // Verificar si ya existe el formato de Zustand (evitar migración duplicada)
  const pacientesStorage = localStorage.getItem('pacientes-storage');
  const citasStorage = localStorage.getItem('citas-storage');
  
  // Solo migrar si no existe el formato de Zustand
  if (!pacientesStorage) {
    // Migrar pacientes
    const oldPacientes = localStorage.getItem('pacientes');
    if (oldPacientes) {
      try {
        const pacientes = JSON.parse(oldPacientes);
        if (Array.isArray(pacientes) && pacientes.length > 0) {
          const pacientesStore = usePacientesStore.getState();
          // Solo migrar si el store está vacío
          if (pacientesStore.pacientes.length === 0) {
            // Actualizar directamente el estado
            usePacientesStore.setState({ pacientes });
            console.log('Pacientes migrados:', pacientes.length);
          }
        }
      } catch (error) {
        console.error('Error migrando pacientes:', error);
      }
    }
  }

  if (!citasStorage) {
    // Migrar citas
    const oldCitas = localStorage.getItem('citas');
    if (oldCitas) {
      try {
        const citas = JSON.parse(oldCitas);
        if (Array.isArray(citas) && citas.length > 0) {
          const citasStore = useCitasStore.getState();
          // Solo migrar si el store está vacío
          if (citasStore.citas.length === 0) {
            // Actualizar directamente el estado
            useCitasStore.setState({ citas });
            console.log('Citas migradas:', citas.length);
          }
        }
      } catch (error) {
        console.error('Error migrando citas:', error);
      }
    }
  }
};

