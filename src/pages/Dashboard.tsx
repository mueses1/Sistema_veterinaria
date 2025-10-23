import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Navbar from '../components/ui/Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPacientes: 0,
    citasHoy: 0,
    citasPendientes: 0
  });
  const [actividades, setActividades] = useState([]);
  const [mostrarTodasActividades, setMostrarTodasActividades] = useState(false);

  // Función para formatear fecha relativa
  const formatearFechaRelativa = (fecha) => {
    const ahora = new Date();
    const fechaActividad = new Date(fecha);
    const diferencia = ahora - fechaActividad;
    
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    
    if (minutos < 60) {
      return minutos <= 1 ? 'Hace 1 minuto' : `Hace ${minutos} minutos`;
    } else if (horas < 24) {
      return horas === 1 ? 'Hace 1 hora' : `Hace ${horas} horas`;
    } else {
      return dias === 1 ? 'Hace 1 día' : `Hace ${dias} días`;
    }
  };

  // Función para formatear fecha completa
  const formatearFechaCompleta = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para generar actividades basadas en datos reales
  const generarActividades = () => {
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    const actividadesGeneradas = [];

    // Actividades de pacientes recientes (últimos 7 días)
    pacientes
      .filter(paciente => {
        const fechaPaciente = new Date(paciente.fecha);
        const hace7Dias = new Date();
        hace7Dias.setDate(hace7Dias.getDate() - 7);
        return fechaPaciente >= hace7Dias;
      })
      .forEach(paciente => {
        actividadesGeneradas.push({
          id: `paciente-${paciente.id}`,
          tipo: 'paciente_nuevo',
          icono: '✅',
          color: 'text-green-500',
          titulo: `Nuevo paciente registrado: ${paciente.nombre}`,
          descripcion: `Propietario: ${paciente.propietario}`,
          fecha: new Date(paciente.fecha).toISOString()
        });
      });

    // Actividades de citas recientes (últimas 48 horas)
    citas
      .filter(cita => {
        const fechaCita = new Date(cita.fechaCreacion || cita.fecha);
        const hace48Horas = new Date();
        hace48Horas.setHours(hace48Horas.getHours() - 48);
        return fechaCita >= hace48Horas;
      })
      .forEach(cita => {
        let icono = '📅';
        let color = 'text-blue-500';
        let accion = 'programada';
        
        if (cita.estado === 'completada') {
          icono = '✅';
          color = 'text-green-500';
          accion = 'completada';
        } else if (cita.estado === 'cancelada') {
          icono = '❌';
          color = 'text-red-500';
          accion = 'cancelada';
        }

        actividadesGeneradas.push({
          id: `cita-${cita.id}`,
          tipo: 'cita',
          icono,
          color,
          titulo: `Cita ${accion}: ${cita.pacienteNombre}`,
          descripcion: `${cita.fecha} - ${cita.motivo}`,
          fecha: new Date(cita.fechaCreacion || cita.fecha).toISOString()
        });
      });

    // Si no hay actividades recientes, agregar algunas de ejemplo
    if (actividadesGeneradas.length === 0) {
      const ahora = new Date();
      actividadesGeneradas.push(
        {
          id: 'ejemplo-1',
          tipo: 'sistema',
          icono: '🏥',
          color: 'text-blue-500',
          titulo: 'Sistema iniciado',
          descripcion: 'Bienvenido al sistema de gestión veterinaria',
          fecha: new Date(ahora.getTime() - 30 * 60 * 1000).toISOString() // hace 30 min
        },
        {
          id: 'ejemplo-2',
          tipo: 'recordatorio',
          icono: '⚠️',
          color: 'text-yellow-500',
          titulo: 'Recordatorio',
          descripcion: 'Revisa las citas programadas para hoy',
          fecha: new Date(ahora.getTime() - 2 * 60 * 60 * 1000).toISOString() // hace 2 horas
        }
      );
    }

    // Ordenar por fecha más reciente
    return actividadesGeneradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  };

  useEffect(() => {
    // Datos del dashboard
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    
    const today = new Date().toISOString().split('T')[0];
    const citasHoy = citas.filter(cita => cita.fecha === today).length;
    const citasPendientes = citas.filter(cita => cita.estado === 'pendiente').length;

    setStats({
      totalPacientes: pacientes.length,
      citasHoy,
      citasPendientes
    });

    // Generar actividades recientes
    setActividades(generarActividades());
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Bienvenido, {user?.nombre}
          </h1>
          <p className="text-gray-600 mt-2">
            Resumen de tu clínica veterinaria
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-blue-50 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🐕</div>
              <div>
                <h3 className="text-2xl font-bold text-blue-600">
                  {stats.totalPacientes}
                </h3>
                <p className="text-gray-600">Total Pacientes</p>
              </div>
            </div>
          </Card>

          <Card className="bg-green-50 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📅</div>
              <div>
                <h3 className="text-2xl font-bold text-green-600">
                  {stats.citasHoy}
                </h3>
                <p className="text-gray-600">Citas Hoy</p>
              </div>
            </div>
          </Card>

          <Card className="bg-yellow-50 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="text-3xl mr-4">⏰</div>
              <div>
                <h3 className="text-2xl font-bold text-yellow-600">
                  {stats.citasPendientes}
                </h3>
                <p className="text-gray-600">Citas Pendientes</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <Card title="Acciones Rápidas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigate('/pacientes')}
            >
              🐾 Gestionar Pacientes
            </Button>
            <Button
              variant="success"
              size="lg"
              className="w-full"
              onClick={() => navigate('/citas')}
            >
              📋 Ver Citas
            </Button>
          </div>
        </Card>

        {/* Actividad reciente */}
        <Card title="Actividad Reciente" className="mt-6">
          {actividades.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-gray-500">No hay actividades recientes</p>
              <p className="text-sm text-gray-400 mt-1">
                Las actividades aparecerán cuando agregues pacientes o programes citas
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {(mostrarTodasActividades ? actividades : actividades.slice(0, 3)).map(actividad => (
                  <div key={actividad.id} className="flex items-start p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                    <div className={`${actividad.color} mr-3 text-xl`}>{actividad.icono}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{actividad.titulo}</p>
                      <p className="text-sm text-gray-600 mt-1">{actividad.descripcion}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span className="mr-3">{formatearFechaRelativa(actividad.fecha)}</span>
                        <span className="text-gray-400">•</span>
                        <span className="ml-3">{formatearFechaCompleta(actividad.fecha)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {actividades.length > 3 && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMostrarTodasActividades(!mostrarTodasActividades)}
                  >
                    {mostrarTodasActividades ? (
                      <>👆 Ver menos actividades</>
                    ) : (
                      <>👇 Ver todas las actividades ({actividades.length})</>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;