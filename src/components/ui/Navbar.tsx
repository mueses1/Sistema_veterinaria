import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAppointmentRequestsStore } from '../../store/appointmentRequestsStore';
import Modal from './Modal';
import Button from './Button';

interface NavigationItem {
  path: string;
  name: string;
  icon: string;
  description: string;
}

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const solicitudes = useAppointmentRequestsStore((state) => state.solicitudes);
  const loadSolicitudes = useAppointmentRequestsStore((state) => state.loadSolicitudes);
  const updateEstadoSolicitud = useAppointmentRequestsStore((state) => state.updateEstado);

  const pendingSolicitudesCount = solicitudes.filter((s) => s.estado === 'pendiente').length;

  const handleClearNotifications = async () => {
    const pendientes = solicitudes.filter((s) => s.estado === 'pendiente');
    for (const s of pendientes) {
      await updateEstadoSolicitud(s.id, 'gestionada');
    }
  };

  const isActive = (path: string): boolean => location.pathname === path;

  const isAdmin = isAuthenticated && user?.role === 'admin';

  // Para clientes (customer) siempre usamos el navbar público (landing-style),
  // los menús de administración solo se muestran a administradores.
  const showPublicNav = !isAdmin;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePublicInicioClick = () => {
    navigate('/');
  };

  const handlePublicServiciosClick = () => {
    navigate('/servicios');
  };

  const handlePublicSobreNosotrosClick = () => {
    navigate('/sobre-nosotros');
  };

  const handlePublicContactoClick = () => {
    navigate('/contacto');
  };

  const handlePublicCarritoClick = () => {
    navigate('/carrito');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadSolicitudes();
    }
  }, [isAuthenticated, loadSolicitudes]);

  const navigationItems: NavigationItem[] = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: '',
      description: 'Panel principal'
    },
    {
      path: '/pacientes',
      name: 'Pacientes',
      icon: '',
      description: 'Gestión de pacientes'
    },
    {
      path: '/citas',
      name: 'Citas',
      icon: '',
      description: 'Programar citas'
    },
    {
      path: '/productos',
      name: 'Productos',
      icon: '',
      description: 'Gestión de productos'
    }
  ];

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 shadow-xl border-b border-blue-500 transition-colors duration-300 ${
    isScrolled
      ? 'bg-white/90 text-gray-900 dark:bg-blue-900/80 dark:text-white backdrop-blur-md'
      : 'bg-white text-gray-900 dark:bg-gradient-to-r dark:from-blue-600 dark:via-blue-700 dark:to-blue-800 dark:text-white'
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo y marca */}
          <Link
            to={!isAuthenticated ? '/' : isAdmin ? '/dashboard' : '/cliente-dashboard'}
            className="flex items-center space-x-3 text-blue-700 hover:text-blue-600 dark:text-white dark:hover:text-blue-100 transition-colors duration-200"
          >
            <div className="bg-blue-100 dark:bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <img
                src="/veterinario.png"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold text-blue-700 dark:text-white">VetClinic Pro</h1>
              <p className="text-xs text-blue-600 opacity-80 dark:text-blue-100">Sistema de Gestión</p>
            </div>
          </Link>

          {/* Navegación desktop */}
          {showPublicNav ? (
            <div className="hidden md:flex items-center space-x-1 text-sm">
              <button
                onClick={handlePublicInicioClick}
                className={`px-3 py-2 rounded-lg transition-colors duration-200 
                  ${location.pathname === '/'
                    ? 'bg-blue-600 text-white shadow-md dark:bg-white/20'
                    : 'text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-100 dark:hover:bg-white/10 dark:hover:text-white'
                  }
                `}
              >
                Inicio
              </button>
              <button
                onClick={handlePublicServiciosClick}
                className={`px-3 py-2 rounded-lg transition-colors duration-200 
                  ${location.pathname === '/servicios'
                    ? 'bg-blue-600 text-white shadow-md dark:bg-white/20'
                    : 'text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-100 dark:hover:bg-white/10 dark:hover:text-white'
                  }
                `}
              >
                Servicios
              </button>
              <button
                onClick={handlePublicSobreNosotrosClick}
                className={`px-3 py-2 rounded-lg transition-colors duration-200 
                  ${location.pathname === '/sobre-nosotros'
                    ? 'bg-blue-600 text-white shadow-md dark:bg-white/20'
                    : 'text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-100 dark:hover:bg-white/10 dark:hover:text-white'
                  }
                `}
              >
                Sobre nosotros
              </button>
              <button
                onClick={handlePublicContactoClick}
                className={`px-3 py-2 rounded-lg transition-colors duration-200 
                  ${location.pathname === '/contacto'
                    ? 'bg-blue-600 text-white shadow-md dark:bg-white/20'
                    : 'text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-100 dark:hover:bg-white/10 dark:hover:text-white'
                  }
                `}
              >
                Contáctanos
              </button>
              <button
                onClick={handlePublicCarritoClick}
                className={`px-3 py-2 rounded-lg transition-colors duration-200 
                  ${location.pathname === '/carrito'
                    ? 'bg-blue-600 text-white shadow-md dark:bg-white/20'
                    : 'text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-100 dark:hover:bg-white/10 dark:hover:text-white'
                  }
                `}
              >
                Carrito
              </button>
            </div>
          ) : (
            !showPublicNav && (
              <div className="hidden md:flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(item.path)
                        ? 'bg-blue-600 text-white shadow-lg dark:bg-white/20'
                        : 'text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-100 dark:hover:bg-white/10 dark:hover:text-white'
                      }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>

                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.description}
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}

          {/* Usuario y acciones / Login público vs autenticado */}
          <div className="flex items-center space-x-4">
            {showPublicNav ? (
              !isAuthenticated ? (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium shadow-sm transition-colors duration-200"
                >
                  Iniciar sesión
                </button>
              ) : (
                // Cliente autenticado: solo menú de usuario simple, sin notificaciones ni navegación de administración
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 bg-blue-50 hover:bg-blue-100 text-gray-800 dark:bg-white/10 dark:hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-gray-900 dark:text-white font-medium text-sm">{user?.name}</p>
                      <p className="text-gray-500 dark:text-blue-100 text-xs">{user?.role}</p>
                    </div>
                    <span className={`text-gray-700 dark:text-white transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 font-semibold">
                        {user?.name}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <span>🚪</span>
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : (
              <>
                {/* Campanita de notificaciones (solo autenticado) */}
                <div className="relative mr-2">
                  <button
                    onClick={() => setShowNotifications((prev) => !prev)}
                    className="relative p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-white/10 dark:hover:bg-white/20"
                  >
                    <span className="text-xl">🔔</span>
                    {solicitudes.filter((s) => s.estado === 'pendiente').length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {solicitudes.filter((s) => s.estado === 'pendiente').length}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 z-50 text-sm">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <span className="font-semibold">Solicitudes de cita</span>
                        {pendingSolicitudesCount > 0 && (
                          <button
                            className="text-[11px] text-blue-600 hover:underline"
                            onClick={handleClearNotifications}
                          >
                            Vaciar
                          </button>
                        )}
                      </div>
                      {pendingSolicitudesCount === 0 ? (
                        <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                          No hay solicitudes pendientes.
                        </div>
                      ) : (
                        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                          {solicitudes
                            .filter((s) => s.estado === 'pendiente')
                            .slice(0, 10)
                            .map((s) => (
                              <li key={s.id} className="px-4 py-3">
                                <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                                  {s.nombreMascota} ({s.nombrePropietario})
                                </p>
                                {(s.telefono || s.email) && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    {s.telefono && <span>📞 {s.telefono}</span>}
                                    {s.telefono && s.email && ' · '}
                                    {s.email && <span>✉️ {s.email}</span>}
                                  </p>
                                )}
                                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                                  {s.motivo}
                                </p>
                                <button
                                  className="text-xs text-blue-600 hover:underline"
                                  onClick={() => {
                                    navigate('/pacientes', {
                                      state: {
                                        fromSolicitudCita: true,
                                        solicitud: {
                                          id: s.id,
                                          nombrePropietario: s.nombrePropietario,
                                          nombreMascota: s.nombreMascota,
                                          telefono: s.telefono,
                                          email: s.email,
                                          motivo: s.motivo,
                                        },
                                      },
                                    });
                                    setShowNotifications(false);
                                  }}
                                >
                                  Registrar
                                </button>
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {/* Menú de usuario */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 bg-blue-50 hover:bg-blue-100 text-gray-800 dark:bg-white/10 dark:hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-gray-900 dark:text-white font-medium text-sm">{user?.name}</p>
                      <p className="text-gray-500 dark:text-blue-100 text-xs">{user?.role}</p>
                    </div>
                    <span className={`text-gray-700 dark:text-white transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>

                  {/* Dropdown del usuario */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 font-semibold">
                        {user?.name}
                      </div>
                      <button
                        onClick={() => {
                          navigate('/perfil');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <span>👤</span>
                        <span>Mi Perfil</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/configuracion');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <span>⚙️</span>
                        <span>Configuración</span>
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <span>🚪</span>
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Botón menú móvil */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 text-blue-700 hover:bg-blue-50 hover:text-blue-900 dark:text-white dark:hover:bg-white/10 rounded-lg"
                >
                  <span className="text-xl">☰</span>
                </button>
              </>
            )}
          </div>

        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-blue-500 py-4">
            <div className="space-y-2">
              {showPublicNav ? (
                <>
                  <button
                    onClick={() => { handlePublicInicioClick(); setIsMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-lg text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white flex items-center space-x-3"
                  >
                    <span className="text-xl">🏠</span>
                    <span>Inicio</span>
                  </button>
                  <button
                    onClick={() => { handlePublicServiciosClick(); setIsMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-lg text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white flex items-center space-x-3"
                  >
                    <span className="text-xl">💼</span>
                    <span>Servicios</span>
                  </button>
                  <button
                    onClick={() => { handlePublicSobreNosotrosClick(); setIsMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-lg text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white flex items-center space-x-3"
                  >
                    <span className="text-xl">ℹ️</span>
                    <span>Sobre nosotros</span>
                  </button>
                  <button
                    onClick={() => { handlePublicContactoClick(); setIsMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-lg text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white flex items-center space-x-3"
                  >
                    <span className="text-xl">📞</span>
                    <span>Contáctanos</span>
                  </button>
                  <button
                    onClick={() => { handlePublicCarritoClick(); setIsMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-lg text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white flex items-center space-x-3"
                  >
                    <span className="text-xl">🛒</span>
                    <span>Carrito</span>
                  </button>
                </>
              ) : (
                navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive(item.path)
                        ? 'bg-white bg-opacity-20 text-white'
                        : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
                      }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs opacity-80">{item.description}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        {/* Overlay para cerrar menús */}
        {(showUserMenu || isMenuOpen) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowUserMenu(false);
              setIsMenuOpen(false);
            }}
          />
        )}

        {/* Modal de detalle de solicitud de cita */}
        <Modal
          isOpen={!!selectedRequestId}
          onClose={() => setSelectedRequestId(null)}
          title="Solicitud de cita"
        >
          {selectedRequestId && (() => {
            const solicitud = solicitudes.find((s) => s.id === selectedRequestId);
            if (!solicitud) return <p className="text-sm">No se encontró la solicitud.</p>;
            return (
              <div className="space-y-3 text-sm">
                <p><span className="font-semibold">Propietario:</span> {solicitud.nombrePropietario}</p>
                <p><span className="font-semibold">Mascota:</span> {solicitud.nombreMascota}</p>
                {solicitud.telefono && (
                  <p><span className="font-semibold">Teléfono:</span> {solicitud.telefono}</p>
                )}
                {solicitud.email && (
                  <p><span className="font-semibold">Email:</span> {solicitud.email}</p>
                )}
                <p><span className="font-semibold">Motivo:</span> {solicitud.motivo}</p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigate('/citas', {
                        state: {
                          fromSolicitudCita: true,
                          solicitud: {
                            id: solicitud.id,
                            nombrePropietario: solicitud.nombrePropietario,
                            nombreMascota: solicitud.nombreMascota,
                            telefono: solicitud.telefono,
                            email: solicitud.email,
                            motivo: solicitud.motivo,
                          },
                        },
                      });
                      setSelectedRequestId(null);
                    }}
                  >
                    Ir a módulo de citas
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        updateEstadoSolicitud(solicitud.id, 'rechazada');
                        setSelectedRequestId(null);
                      }}
                    >
                      Marcar como rechazada
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => {
                        updateEstadoSolicitud(solicitud.id, 'gestionada');
                        setSelectedRequestId(null);
                      }}
                    >
                      Marcar como gestionada
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}
        </Modal>

      </div>
    </nav>
  );
};

export default Navbar;