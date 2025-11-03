import { useState, FormEvent, ChangeEvent } from 'react';
import Navbar from '../components/ui/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { Cita, Paciente } from '../types/Index.ts';
import { useCitasStore } from '../store/citasStore';
import { usePacientesStore } from '../store/pacientesStore';

interface FormData {
  pacienteId: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: 'pendiente' | 'completada' | 'cancelada' | 'en-proceso';
}

const Citas = () => {
  const citas = useCitasStore((state) => state.citas);
  const addCita = useCitasStore((state) => state.addCita);
  const updateEstadoCita = useCitasStore((state) => state.updateEstadoCita);
  const deleteCita = useCitasStore((state) => state.deleteCita);
  const pacientes = usePacientesStore((state) => state.pacientes);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    pacienteId: '',
    fecha: '',
    hora: '',
    motivo: '',
    estado: 'pendiente'
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const paciente = pacientes.find((p: Paciente) => p.id === formData.pacienteId);
    if (!paciente) return;

    const nuevaCita: Cita = {
      id: Date.now().toString(),
      ...formData,
      pacienteNombre: paciente.nombre,
      propietario: paciente.propietario,
      fechaCreacion: new Date().toISOString()
    };

    addCita(nuevaCita);
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

  const getEstadoColor = (estado: Cita['estado']) => {
    switch (estado) {
      case 'completada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      case 'en-proceso': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Citas</h1>
            <p className="text-gray-600 mt-2">
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
                <div key={cita.id} className="border rounded-lg p-4 bg-gray-50">
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
                        <strong>Fecha:</strong> {cita.fecha} a las {cita.hora}
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
            <div className="mb-4">
              <label className="block text-gray-700 uppercase font-bold mb-2">
                Paciente *
              </label>
              <select
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
              <label className="block text-gray-700 uppercase font-bold mb-2">
                Motivo de la Cita *
              </label>
              <textarea
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