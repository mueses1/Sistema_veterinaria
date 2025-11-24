import { useState, ChangeEvent, useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

import Swal from 'sweetalert2';
import Navbar from '../components/ui/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ActionButton from '../components/ui/ActionButton';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Formulario from '../components/Formulario';
import { Paciente } from '../types/Index';
import { usePacientesStore } from '../store/pacientesStore';

const Pacientes = () => {
  const navigate = useNavigate();
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

  const pacientes = usePacientesStore((state) => state.pacientes);
  const deletePaciente = usePacientesStore((state) => state.deletePaciente);
  const loadPacientes = usePacientesStore((state) => state.loadPacientes);

  const [paciente, setPaciente] = useState<Partial<Paciente>>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pacienteDetalle, setPacienteDetalle] = useState<Partial<Paciente>>({});
  const [showDetalleModal, setShowDetalleModal] = useState<boolean>(false);

  useEffect(() => {
    loadPacientes();
  }, [loadPacientes]);

  // Si venimos desde una solicitud de cita, prellenar datos y abrir modal de nuevo paciente
  useEffect(() => {
    const state = location.state;
    if (state?.fromSolicitudCita && state.solicitud) {
      const s = state.solicitud;
      setPaciente({
        nombre: s.nombreMascota,
        propietario: s.nombrePropietario,
        email: s.email || '',
        fecha: new Date().toISOString().split('T')[0],
        sintomas: s.motivo,
        tutor_nombre: s.nombrePropietario,
        tutor_telefono_principal: s.telefono || '',
        tutor_email: s.email || '',
      });
      setShowModal(true);
    }
  }, [location.state]);

  const eliminarPaciente = (id: string) => {
    deletePaciente(id);
  };

  const confirmarEliminarPaciente = (id: string, nombre: string) => {
    Swal.fire({
      title: '¿Desea eliminar este paciente?',
      text: `El paciente ${nombre} será eliminado del sistema`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarPaciente(id);
        Swal.fire(
          'Paciente eliminado',
          'El paciente se eliminó del sistema',
          'success'
        );
      }
    });
  };

  const filteredPacientes = pacientes
    .filter((paciente: Paciente) =>
      paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.propietario.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: Paciente, b: Paciente) => {
      // Ordenar por fecha más reciente primero
      const fechaA = new Date(a.fecha || 0);
      const fechaB = new Date(b.fecha || 0);
      
      // Si las fechas son iguales, ordenar por ID (más reciente primero)
      if (fechaA.getTime() === fechaB.getTime()) {
        return b.id.localeCompare(a.id);
      }
      
      return fechaB.getTime() - fechaA.getTime();
    });

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 pt-24">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Gestión de Pacientes</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Administra la información de tus pacientes
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
          >
            Nuevo Paciente
          </Button>
        </div>

        {/* Barra de búsqueda */}
        <Card className="mb-6">
          <Input
            label="Buscar Pacientes"
            placeholder="Buscar por nombre del paciente o propietario..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            error=""
            name="search"
          />
        </Card>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <h3 className="text-2xl font-bold text-blue-600">{pacientes.length}</h3>
            <p className="text-gray-600">Total Pacientes</p>
          </Card>
          <Card className="text-center">
            <h3 className="text-2xl font-bold text-green-600">{filteredPacientes.length}</h3>
            <p className="text-gray-600">Resultados Filtrados</p>
          </Card>
          <Card className="text-center">
            <h3 className="text-2xl font-bold text-purple-600">
              {pacientes.filter((p: Paciente) => new Date(p.fecha) > new Date(Date.now() - 30*24*60*60*1000)).length}
            </h3>
            <p className="text-gray-600">Nuevos (30 días)</p>
          </Card>
        </div>

        {/* Lista de pacientes en grid */}
        <Card title="Lista de Pacientes">
          {filteredPacientes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🐕</div>
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No se encontraron pacientes' : 'No hay pacientes registrados'}
              </p>
              {!searchTerm && (
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => setShowModal(true)}
                >
                  Registrar Primer Paciente
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPacientes.map((pacienteItem: Paciente) => (
                <div key={pacienteItem.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700">
                  {/* Header de la tarjeta */}
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-xl">🐾</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 truncate">{pacienteItem.nombre}</h3>
                      <p className="text-sm text-gray-500 truncate">{pacienteItem.propietario}</p>
                    </div>
                  </div>

                  {/* Información del paciente (resumen clínico) */}
                  <div className="space-y-2 mb-4 text-sm">
                    {/* Especie, raza, edad y peso */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold dark:bg-blue-900 dark:text-blue-100">
                        {pacienteItem.mascota_especie || 'Especie no definida'}
                      </span>
                      {pacienteItem.mascota_raza || pacienteItem.mascota_raza_otro ? (
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold dark:bg-purple-900 dark:text-purple-100">
                          {pacienteItem.mascota_raza || pacienteItem.mascota_raza_otro}
                        </span>
                      ) : null}
                      {pacienteItem.mascota_edad_aproximada_anios !== undefined && (
                        <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold dark:bg-green-900 dark:text-green-100">
                          {pacienteItem.mascota_edad_aproximada_anios} años
                        </span>
                      )}
                      {pacienteItem.mascota_peso_kg !== undefined && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold dark:bg-amber-900 dark:text-amber-100">
                          {pacienteItem.mascota_peso_kg} kg
                        </span>
                      )}
                    </div>

                    {/* Tutor y contacto rápido */}
                    <div className="flex items-center text-sm">
                      <span className="text-gray-400 mr-2">👤</span>
                      <span className="text-gray-600 truncate">
                        {`${pacienteItem.tutor_nombre || ''} ${pacienteItem.tutor_apellido || ''}`.trim() || pacienteItem.propietario}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-400 mr-2">📞</span>
                      <span className="text-gray-600 truncate">
                        {pacienteItem.tutor_telefono_principal || 'Sin teléfono registrado'}
                      </span>
                    </div>

                    {/* Motivo principal / síntomas */}
                    <div className="flex items-start text-sm">
                      <span className="text-gray-400 mr-2 mt-0.5">🩺</span>
                      <span
                        className="text-gray-600 overflow-hidden"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {pacienteItem.sintomas || 'Sin motivo registrado'}
                      </span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="space-y-2 pt-1 border-t border-gray-100 mt-2">
                    <ActionButton
                      onClick={() => {
                        setPacienteDetalle(pacienteItem);
                        setShowDetalleModal(true);
                      }}
                    >
                      👁️ Ver detalles
                    </ActionButton>

                    <div className="flex space-x-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setPaciente(pacienteItem);
                          setShowModal(true);
                        }}
                      >
                        ✏️ Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="flex-1"
                        onClick={() => confirmarEliminarPaciente(pacienteItem.id, pacienteItem.nombre)}
                      >
                        🗑️ Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Modal para formulario */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setPaciente({});
          }}
          title={Object.keys(paciente).length > 0 ? 'Editar Paciente' : 'Nuevo Paciente'}
        >
          <Formulario
            paciente={paciente}
            setPaciente={setPaciente}
            onClose={() => setShowModal(false)}
          />
        </Modal>

        {/* Modal de ficha detallada del paciente */}
        <Modal
          isOpen={showDetalleModal}
          onClose={() => {
            setShowDetalleModal(false);
            setPacienteDetalle({});
          }}
          title="Ficha del Paciente"
        >
          {pacienteDetalle && (
            <div className="space-y-4 text-sm text-gray-700">
              {/* Resumen principal */}
              <div className="flex items-center mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-xl">🐾</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{pacienteDetalle.mascota_nombre || pacienteDetalle.nombre}</h2>
                  <p className="text-gray-500">Tutor: {`${pacienteDetalle.tutor_nombre || ''} ${pacienteDetalle.tutor_apellido || ''}`.trim() || pacienteDetalle.propietario}</p>
                </div>
              </div>

              {/* Datos del tutor */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Datos del Tutor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p><span className="font-semibold">Nombre:</span> {`${pacienteDetalle.tutor_nombre || ''} ${pacienteDetalle.tutor_apellido || ''}`.trim() || '—'}</p>
                  <p><span className="font-semibold">Documento:</span> {pacienteDetalle.tutor_tipo_documento || '—'} {pacienteDetalle.tutor_numero_documento || ''}</p>
                  <p><span className="font-semibold">Teléfono principal:</span> {pacienteDetalle.tutor_telefono_principal || '—'}</p>
                  <p><span className="font-semibold">Teléfono secundario:</span> {pacienteDetalle.tutor_telefono_secundario || '—'}</p>
                  <p><span className="font-semibold">Email:</span> {pacienteDetalle.tutor_email || pacienteDetalle.email || '—'}</p>
                  <p><span className="font-semibold">Dirección:</span> {pacienteDetalle.tutor_direccion || '—'}</p>
                  <p className="md:col-span-2"><span className="font-semibold">¿Cómo nos conoció?:</span> {pacienteDetalle.tutor_como_nos_conocio || '—'}</p>
                </div>
              </div>

              {/* Datos de la mascota */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Datos de la Mascota</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p><span className="font-semibold">Nombre:</span> {pacienteDetalle.mascota_nombre || pacienteDetalle.nombre || '—'}</p>
                  <p><span className="font-semibold">Especie:</span> {pacienteDetalle.mascota_especie || '—'}</p>
                  <p><span className="font-semibold">Raza:</span> {pacienteDetalle.mascota_raza || pacienteDetalle.mascota_raza_otro || '—'}</p>
                  <p><span className="font-semibold">Sexo:</span> {pacienteDetalle.mascota_sexo || '—'}</p>
                  <p><span className="font-semibold">Castrado/Esterilizado:</span> {pacienteDetalle.mascota_castrado || '—'}</p>
                  <p><span className="font-semibold">Edad aprox. (años):</span> {pacienteDetalle.mascota_edad_aproximada_anios ?? '—'}</p>
                  <p><span className="font-semibold">Color:</span> {pacienteDetalle.mascota_color || '—'}</p>
                  <p><span className="font-semibold">Peso (kg):</span> {pacienteDetalle.mascota_peso_kg ?? '—'}</p>
                </div>
              </div>

              {/* Información médica */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Información Médica</h3>
                <div className="space-y-1">
                  <p><span className="font-semibold">Motivo / síntomas de ingreso:</span> {pacienteDetalle.sintomas || '—'}</p>
                  <p><span className="font-semibold">Enfermedades crónicas:</span> {pacienteDetalle.enfermedad_cronica || '—'}</p>
                  <p><span className="font-semibold">Medicación permanente:</span> {pacienteDetalle.medicacion_permanente || '—'}</p>
                  <p><span className="font-semibold">Alergias:</span> {pacienteDetalle.alergias || '—'}</p>
                  <p><span className="font-semibold">Seguro médico:</span> {pacienteDetalle.tiene_seguro_medico === true ? 'Sí' : pacienteDetalle.tiene_seguro_medico === false ? 'No' : '—'}</p>
                  <p><span className="font-semibold">Aseguradora:</span> {pacienteDetalle.nombre_aseguradora || '—'}</p>
                  <p><span className="font-semibold">Observaciones:</span> {pacienteDetalle.observaciones || '—'}</p>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Pacientes;