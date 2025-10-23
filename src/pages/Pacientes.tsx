import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from '../components/ui/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Formulario from '../components/Formulario';
import { Paciente } from '../types';

const Pacientes = () => {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<Paciente[]>(() => {
    const stored = localStorage.getItem('pacientes');
    return stored ? JSON.parse(stored) : [];
  });
  const [paciente, setPaciente] = useState<Partial<Paciente>>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
  }, [pacientes]);

  const eliminarPaciente = (id: string) => {
    const pacientesActualizados = pacientes.filter(paciente => paciente.id !== id);
    setPacientes(pacientesActualizados);
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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Pacientes</h1>
            <p className="text-gray-600 mt-2">
              Administra la información de tus pacientes
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
          >
            ➕ Nuevo Paciente
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
                <div key={pacienteItem.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
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

                  {/* Información del paciente */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-400 mr-2">📧</span>
                      <span className="text-gray-600 truncate">{pacienteItem.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-400 mr-2">📅</span>
                      <span className="text-gray-600">{pacienteItem.fecha}</span>
                    </div>
                    <div className="flex items-start text-sm">
                      <span className="text-gray-400 mr-2 mt-0.5">🩺</span>
                      <span className="text-gray-600 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>{pacienteItem.sintomas}</span>
                    </div>
                  </div>

                  {/* Botones de acción */}
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
            pacientes={pacientes}
            setPacientes={setPacientes}
            paciente={paciente}
            setPaciente={setPaciente}
            onClose={() => setShowModal(false)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Pacientes;