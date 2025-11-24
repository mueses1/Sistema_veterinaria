import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Swal from 'sweetalert2';
import Navbar from '../components/ui/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { Cita, Paciente } from '../types/Index.ts';
import { useCitasStore } from '../store/citasStore';
import { usePacientesStore } from '../store/pacientesStore';
import { useAppointmentRequestsStore } from '../store/appointmentRequestsStore';

interface FormData {
  pacienteId: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: 'pendiente' | 'completada' | 'cancelada' | 'en-proceso';
}

const Citas = () => {
  const location = useLocation() as {
    state?: {
      fromSolicitudCita?: boolean;
      solicitud?: {
        id: string;
        nombrePropietario: string;
        nombreMascota: string;
        telefono?: string | null;
        email?: string | null;
        motivo: string;
      };
    };
  };

  const citas = useCitasStore((state) => state.citas);
  const addCita = useCitasStore((state) => state.addCita);
  const updateEstadoCita = useCitasStore((state) => state.updateEstadoCita);
  const deleteCita = useCitasStore((state) => state.deleteCita);
  const loadCitas = useCitasStore((state) => state.loadCitas);
  const pacientes = usePacientesStore((state) => state.pacientes);
  const loadPacientes = usePacientesStore((state) => state.loadPacientes);
  const updateEstadoSolicitud = useAppointmentRequestsStore((state) => state.updateEstado);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    pacienteId: '',
    fecha: '',
    hora: '',
    motivo: '',
    estado: 'pendiente'
  });
  const [errorMensaje, setErrorMensaje] = useState<string>('');

  useEffect(() => {
    loadPacientes();
    loadCitas();
  }, [loadPacientes, loadCitas]);

  // Si venimos desde una solicitud de cita, prellenar motivo y abrir modal
  useEffect(() => {
    const state = location.state;
    if (state?.fromSolicitudCita && state.solicitud) {
      const s = state.solicitud;
      setFormData((prev) => ({
        ...prev,
        motivo:
          prev.motivo ||
          `Solicitud web: ${s.motivo}\nContacto: ${
            s.telefono ? `Tel: ${s.telefono}` : ''
          }${s.telefono && s.email ? ' · ' : ''}${s.email ? `Email: ${s.email}` : ''}`,
      }));
      setShowModal(true);
    }
  }, [location.state]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMensaje('');

    const paciente = pacientes.find((p: Paciente) => p.id === formData.pacienteId);
    if (!paciente) {
      setErrorMensaje('Debes seleccionar un paciente válido.');
      return;
    }

    // Validar fecha y hora: no permitir pasado
    if (!formData.fecha || !formData.hora) {
      setErrorMensaje('La fecha y la hora de la cita son obligatorias.');
      return;
    }

    const ahora = new Date();
    const fechaHoraSeleccionada = new Date(`${formData.fecha}T${formData.hora}`);

    if (isNaN(fechaHoraSeleccionada.getTime())) {
      setErrorMensaje('La fecha u hora seleccionada no es válida.');
      return;
    }

    if (fechaHoraSeleccionada < ahora) {
      setErrorMensaje('No puedes agendar citas en el pasado.');
      return;
    }

    // Validar horario de atención (ejemplo: 08:00 a 20:00)
    const [horaStr, minutoStr] = formData.hora.split(':');
    const horaNum = Number(horaStr);
    const minutoNum = Number(minutoStr);

    if (isNaN(horaNum) || isNaN(minutoNum)) {
      setErrorMensaje('La hora seleccionada no es válida.');
      return;
    }

    if (horaNum < 8 || (horaNum > 20) || (horaNum === 20 && minutoNum > 0)) {
      setErrorMensaje('La hora de la cita debe estar entre 08:00 y 20:00.');
      return;
    }

    // Evitar doble reserva local: misma fecha y hora con cita no cancelada
    const conflictoLocal = citas.some((c: Cita) =>
      c.fecha === formData.fecha &&
      c.hora === formData.hora &&
      c.estado !== 'cancelada'
    );

    if (conflictoLocal) {
      setErrorMensaje('Ya existe una cita programada en esa fecha y hora.');
      return;
    }

    const nuevaCita: Cita = {
      id: Date.now().toString(),
      ...formData,
      pacienteNombre: paciente.nombre,
      propietario: paciente.propietario,
      fechaCreacion: new Date().toISOString()
    };

    addCita(nuevaCita);

    // Alerta de éxito al crear la cita
    Swal.fire({
      icon: 'success',
      title: 'Cita programada',
      text: `Se programó una cita para ${nuevaCita.pacienteNombre} el ${nuevaCita.fecha} a las ${formatHoraAmPm(nuevaCita.hora)}.`,
      confirmButtonColor: '#2563eb',
    });

    // Si esta cita proviene de una solicitud web, marcar la solicitud como gestionada
    const state = location.state;
    if (state?.fromSolicitudCita && state.solicitud?.id) {
      updateEstadoSolicitud(state.solicitud.id, 'gestionada');
    }

    setFormData({
      pacienteId: '',
      fecha: '',
      hora: '',
      motivo: '',
      estado: 'pendiente'
    });
    setShowModal(false);
  };

  const cambiarEstadoCita = (id: string, nuevoEstado: Cita['estado']) => {
    updateEstadoCita(id, nuevoEstado);
  };

  const formatHoraAmPm = (hora24: string) => {
    const [hStr, mStr] = hora24.split(':');
    const h = Number(hStr);
    if (isNaN(h)) return hora24;

    const sufijo = h >= 12 ? 'PM' : 'AM';
    const hora12 = h % 12 === 0 ? 12 : h % 12;
    return `${hora12.toString().padStart(1, '0')}:${(mStr ?? '00').padStart(2, '0')} ${sufijo}`;
  };

  const getEstadoColor = (estado: Cita['estado']) => {
    switch (estado) {
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'en-proceso':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 pt-24">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {location.state?.fromSolicitudCita && location.state.solicitud && (
          <Card className="mb-6 bg-blue-50 border-l-4 border-blue-500">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <p className="font-semibold text-blue-900">
                  Creando cita desde solicitud de {location.state.solicitud.nombreMascota} ({
                    location.state.solicitud.nombrePropietario
                  })
                </p>
                <p className="text-sm text-blue-800">
                  Contacto:{' '}
                  {location.state.solicitud.telefono && `📞 ${location.state.solicitud.telefono} `}
                  {location.state.solicitud.email && `✉️ ${location.state.solicitud.email}`}
                </p>
              </div>
              <p className="text-xs text-blue-700">Revisa los datos y selecciona paciente, fecha y hora.</p>
            </div>
          </Card>
        )}
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Gestión de Citas</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Programa y administra las citas de tus pacientes
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            disabled={pacientes.length === 0}
          >
            📅 Nueva Cita
          </Button>
        </div>

        {pacientes.length === 0 && (
          <Card className="mb-6 bg-yellow-50 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="text-yellow-500 text-2xl mr-3">⚠️</div>
              <div>
                <p className="font-medium">No hay pacientes registrados</p>
                <p className="text-sm text-gray-600">
                  Necesitas registrar pacientes antes de crear citas
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="text-center">
            <h3 className="text-2xl font-bold text-blue-600">{citas.length}</h3>
            <p className="text-gray-600">Total Citas</p>
          </Card>
          <Card className="text-center">
            <h3 className="text-2xl font-bold text-yellow-600">
              {citas.filter((c: Cita) => c.estado === 'pendiente').length}
            </h3>
            <p className="text-gray-600">Pendientes</p>
          </Card>
          <Card className="text-center">
            <h3 className="text-2xl font-bold text-green-600">
              {citas.filter((c: Cita) => c.estado === 'completada').length}
            </h3>
            <p className="text-gray-600">Completadas</p>
          </Card>
          <Card className="text-center">
            <h3 className="text-2xl font-bold text-red-600">
              {citas.filter((c: Cita) => c.estado === 'cancelada').length}
            </h3>
            <p className="text-gray-600">Canceladas</p>
          </Card>
        </div>

        {/* Lista de citas */}
        <Card title="Próximas Citas">
          {citas.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-500 text-lg">No hay citas programadas</p>
              {pacientes.length > 0 && (
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => setShowModal(true)}
                >
                  Programar Primera Cita
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {citas.map((cita: Cita) => (
                <div key={cita.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-bold text-lg mr-3">{cita.pacienteNombre}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(cita.estado)}`}>
                          {cita.estado.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">
                        <strong>Propietario:</strong> {cita.propietario}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <strong>Fecha:</strong> {cita.fecha} a las {formatHoraAmPm(cita.hora)}
                      </p>
                      <p className="text-gray-600 mb-3">
                        <strong>Motivo:</strong> {cita.motivo}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {cita.estado === 'pendiente' && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => cambiarEstadoCita(cita.id, 'completada')}
                          >
                            Completar
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => cambiarEstadoCita(cita.id, 'en-proceso')}
                          >
                            En Proceso
                          </Button>
                        </>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteCita(cita.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Modal para nueva cita */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Nueva Cita"
        >
          <form onSubmit={handleSubmit}>
            {errorMensaje && (
              <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 text-sm">
                {errorMensaje}
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="pacienteId"
                className="block text-gray-700 uppercase font-bold mb-2"
              >
                Paciente *
              </label>
              <select
                id="pacienteId"
                name="pacienteId"
                value={formData.pacienteId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({...formData, pacienteId: e.target.value})}
                className="border-2 w-full p-2 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar paciente</option>
                {pacientes.map((paciente: Paciente) => (
                  <option key={paciente.id} value={paciente.id}>
                    {paciente.nombre} - {paciente.propietario}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Fecha"
              type="date"
              placeholder=""
              value={formData.fecha}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, fecha: e.target.value})}
              error=""
              name="fecha"
              required
            />

            <Input
              label="Hora"
              type="time"
              placeholder=""
              value={formData.hora}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, hora: e.target.value})}
              error=""
              name="hora"
              required
            />

            <div className="mb-4">
              <label
                htmlFor="motivo"
                className="block text-gray-700 uppercase font-bold mb-2"
              >
                Motivo de la Cita *
              </label>
              <textarea
                id="motivo"
                name="motivo"
                value={formData.motivo}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, motivo: e.target.value})}
                className="border-2 w-full p-2 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe el motivo de la cita..."
                required
              />
            </div>

            <div className="flex space-x-3">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
              >
                Programar Cita
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Citas;