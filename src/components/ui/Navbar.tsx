import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface NavigationItem {
  path: string;
  name: string;
  icon: string;
  description: string;
}

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  const isActive = (path: string): boolean => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems: NavigationItem[] = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: '📊',
      description: 'Panel principal'
    },
    {
      path: '/pacientes',
      name: 'Pacientes',
      icon: '🐕',
      description: 'Gestión de pacientes'
    },
    {
      path: '/citas',
      name: 'Citas',
      icon: '📅',
      description: 'Programar citas'
    }
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-xl border-b border-blue-500">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo y marca */}
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 text-white hover:text-blue-100 transition-colors duration-200"
          >
            <div className="bg-white bg-opacity-20 p-2 rounded-lg backdrop-blur-sm">
              <img
                src="/veterinario.png"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold">VetClinic Pro</h1>
              <p className="text-xs text-blue-100 opacity-80">Sistema de Gestión</p>
            </div>
          </Link>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(item.path)
                    ? 'bg-white bg-opacity-20 text-white shadow-lg backdrop-blur-sm'
                    : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
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

          {/* Usuario y acciones */}
          <div className="flex items-center space-x-4">
            {/* Menú de usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 bg-white bg-opacity-10 hover:bg-opacity-20 px-3 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-white font-medium text-sm">{user?.name}</p>
                  <p className="text-blue-100 text-xs">{user?.role}</p>
                </div>
                <span className={`text-white transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Dropdown del usuario */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
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
              className="md:hidden p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg"
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-blue-500 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
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
              ))}
            </div>
          </div>
        )}
      </div>

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
    </nav>
  );
};

export default Navbar;