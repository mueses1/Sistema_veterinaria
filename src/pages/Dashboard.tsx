import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { usePacientesStore } from '../store/pacientesStore';
import { useCitasStore } from '../store/citasStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Navbar from '../components/ui/Navbar';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const pacientes = usePacientesStore((state) => state.pacientes);
  const loadPacientes = usePacientesStore((state) => state.loadPacientes);
  const citas = useCitasStore((state) => state.citas);
  const loadCitas = useCitasStore((state) => state.loadCitas);

  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPacientes: 0,
    citasHoy: 0,
    citasPendientes: 0
  });
  const [actividades, setActividades] = useState([]);
  const [mostrarTodasActividades, setMostrarTodasActividades] = useState(false);
  const [filtroActividad, setFiltroActividad] = useState<'todas' | 'pacientes' | 'citas'>('todas');

  useEffect(() => {
    loadPacientes();
    loadCitas();
  }, [loadPacientes, loadCitas]);

  const todayISO = new Date().toISOString().split('T')[0];

  const formatHoraAmPm = (hora24: string) => {
    const [hStr, mStr] = hora24.split(':');
    const h = Number(hStr);
    if (isNaN(h)) return hora24;

    const sufijo = h >= 12 ? 'PM' : 'AM';
    const hora12 = h % 12 === 0 ? 12 : h % 12;
    return `${hora12.toString().padStart(1, '0')}:${(mStr ?? '00').padStart(2, '0')} ${sufijo}`;
  };

  // Función para formatear fecha relativa
  const formatearFechaRelativa = (fecha: string | Date) => {
    const ahora = new Date();
    const fechaActividad = new Date(fecha);
    const diferencia = ahora.getTime() - fechaActividad.getTime();
    
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
    return actividadesGeneradas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  };

  useEffect(() => {
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
  }, [pacientes, citas]);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 pt-24">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-200">
            Bienvenido, {user?.nombre}
          </h1>
          <p className="text-gray-700 dark:text-gray-400 mt-2 font-medium">
            Resumen de tu clínica veterinaria
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            type="button"
            onClick={() => navigate('/pacientes')}
            className="text-left focus:outline-none"
          >
            <Card className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="text-3xl mr-4">🐕</div>
                <div>
                  <h3 className="text-2xl font-extrabold text-blue-700 dark:text-blue-300">
                    {stats.totalPacientes}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">Total Pacientes</p>
                  <p className="text-xs text-blue-700/80 dark:text-blue-200 mt-1">Ver listado completo de pacientes</p>
                </div>
              </div>
            </Card>
          </button>

          <button
            type="button"
            onClick={() => navigate('/citas')}
            className="text-left focus:outline-none"
          >
            <Card className="bg-green-50 dark:bg-green-900 border-l-4 border-green-500 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="text-3xl mr-4">📅</div>
                <div>
                  <h3 className="text-2xl font-extrabold text-green-700 dark:text-green-300">
                    {stats.citasHoy}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">Citas Hoy</p>
                  <p className="text-xs text-green-700/80 dark:text-green-200 mt-1">Ir a la agenda completa de citas</p>
                </div>
              </div>
            </Card>
          </button>

          <button
            type="button"
            onClick={() => navigate('/citas')}
            className="text-left focus:outline-none"
          >
            <Card className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="text-3xl mr-4">⏰</div>
                <div>
                  <h3 className="text-2xl font-extrabold text-yellow-700 dark:text-yellow-300">
                    {stats.citasPendientes}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">Citas Pendientes</p>
                  <p className="text-xs text-yellow-700/80 dark:text-yellow-200 mt-1">Revisa las citas que aún están por atender</p>
                </div>
              </div>
            </Card>
          </button>
        </div>

        {/* Agenda de hoy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card title="Agenda de hoy">
            {citas.filter(cita => cita.fecha === todayISO).length === 0 ? (
              <div className="py-6 text-center text-gray-500 dark:text-gray-300">
                <p className="text-lg mb-1">No hay citas programadas para hoy</p>
                <p className="text-sm">Puedes crear una nueva cita desde el módulo de Citas.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {citas
                  .filter(cita => cita.fecha === todayISO)
                  .sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))
                  .slice(0, 5)
                  .map((cita) => (
                    <div
                      key={cita.id}
                      className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-semibold dark:bg-blue-900 dark:text-blue-100 min-w-[64px] text-center">
                          {formatHoraAmPm(cita.hora)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {cita.pacienteNombre}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Propietario: {cita.propietario}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            Motivo: {cita.motivo}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-semibold ml-2 ${
                          cita.estado === 'completada'
                            ? 'bg-green-100 text-green-800'
                            : cita.estado === 'cancelada'
                            ? 'bg-red-100 text-red-800'
                            : cita.estado === 'en-proceso'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {cita.estado.toUpperCase()}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </Card>

          {/* Acciones rápidas se mantiene a la derecha en pantallas grandes */}
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
        </div>

        {/* Actividad reciente */}
        <Card title="Actividad Reciente" className="mt-6">
          <div className="flex items-center justify-between mb-4 text-xs">
            <div className="inline-flex rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                className={`px-3 py-1.5 ${filtroActividad === 'todas' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
                onClick={() => setFiltroActividad('todas')}
              >
                Todo
              </button>
              <button
                className={`px-3 py-1.5 border-l border-gray-200 dark:border-gray-700 ${filtroActividad === 'pacientes' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
                onClick={() => setFiltroActividad('pacientes')}
              >
                Pacientes
              </button>
              <button
                className={`px-3 py-1.5 border-l border-gray-200 dark:border-gray-700 ${filtroActividad === 'citas' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
                onClick={() => setFiltroActividad('citas')}
              >
                Citas
              </button>
            </div>
          </div>

          {actividades.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-gray-500 dark:text-gray-300">No hay actividades recientes</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Las actividades aparecerán cuando agregues pacientes o programes citas
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {(mostrarTodasActividades
                  ? actividades
                  : actividades.slice(0, 3)
                 )
                  .filter((actividad) => {
                    if (filtroActividad === 'todas') return true;
                    if (filtroActividad === 'pacientes') return actividad.tipo === 'paciente_nuevo';
                    if (filtroActividad === 'citas') return actividad.tipo === 'cita';
                    return true;
                  })
                  .map(actividad => (
                  <div
                    key={actividad.id}
                    className="flex items-start p-3 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => {
                      if (actividad.tipo === 'paciente_nuevo') {
                        navigate('/pacientes');
                      } else if (actividad.tipo === 'cita') {
                        navigate('/citas');
                      }
                    }}
                  >
                    <div className={`${actividad.color} mr-3 text-xl`}>{actividad.icono}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{actividad.titulo}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{actividad.descripcion}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
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